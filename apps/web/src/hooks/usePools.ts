import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'
import { usePublicClient } from 'wagmi'

import { delegatePoolsAddress, delegatePoolsEventsAbi } from '@/lib/abi'

interface Pool {
  members: Address[]
  minVotes: bigint
  groupId: bigint
}

interface PoolWithJoined extends Pool {
  joined: boolean
}

export function usePools(): UseQueryResult<Pool[]>
export function usePools(address?: Address): UseQueryResult<PoolWithJoined[]>
export function usePools(address?: Address) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['pools'],
    queryFn: async () => {
      if (!client) {
        console.error('No client in usePools')
        return []
      }

      const filter = await client.createEventFilter({
        address: delegatePoolsAddress,
        events: delegatePoolsEventsAbi,
        fromBlock: 22355096n,
      })

      const logs = await client.getFilterLogs({ filter })

      const poolCreatedLogs = logs
        .filter((log) => log.eventName === 'PoolCreated')
        .map((log) => log.args)

      const poolJoinedLogs = logs
        .filter((log) => log.eventName === 'PoolJoined')
        .map((log) => log.args)

      // Combine the events to get the members of each pool
      const pools = poolCreatedLogs.map((pool) => {
        const members = poolJoinedLogs
          .filter((log) => log.minVotes === pool.minVotes)
          .map((log) => log.member)

        return { ...pool, members }
      })

      if (address) {
        // Add `joined` boolean to each pool
        return pools.map((pool) => ({
          ...pool,
          joined: pool.members.includes(address),
        }))
      }

      return pools
    },
  })
}
