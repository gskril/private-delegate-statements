import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'
import { usePublicClient } from 'wagmi'

import { delegatePoolsAddress, delegatePoolsEventsAbi } from '@/lib/abi'

export interface Pool {
  members: {
    address: Address
    identityCommitment: bigint
  }[]
  minVotes: bigint
  groupId: bigint
}

export interface PoolWithJoined extends Pool {
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
        fromBlock: 22369782n,
      })

      const logs = await client.getFilterLogs({ filter })

      const poolCreatedLogs = logs.filter(
        (log) => log.eventName === 'PoolCreated'
      )

      const poolJoinedLogs = logs.filter(
        (log) => log.eventName === 'PoolJoined'
      )

      // Combine the events to get the members of each pool
      const pools = poolCreatedLogs.map((pool) => {
        const members = poolJoinedLogs
          .filter((log) => log.args.minVotes === pool.args.minVotes)
          .map((log) => {
            return {
              address: log.args.member!,
              identityCommitment: log.args.identityCommitment!,
            }
          })

        return { ...pool.args, members }
      })

      if (address) {
        // Add `joined` boolean to each pool
        return pools.map((pool) => ({
          ...pool,
          joined: pool.members.some((member) => member.address === address),
        }))
      }

      return pools
    },
  })
}
