import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'
import { usePublicClient } from 'wagmi'

import {
  delegatePoolsAddress,
  delegatePoolsEventsAbi,
  semaphoreAddress,
  semaphoreEventsAbi,
} from '@/lib/abi'

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
        address: [delegatePoolsAddress, semaphoreAddress],
        events: [...delegatePoolsEventsAbi, ...semaphoreEventsAbi],
        fromBlock: 22355096n,
      })

      const logs = await client.getFilterLogs({ filter })

      const poolCreatedLogs = logs.filter(
        (log) => log.eventName === 'PoolCreated'
      )

      const poolJoinedLogs = logs.filter(
        (log) => log.eventName === 'PoolJoined'
      )

      const memberAddedLogs = logs.filter(
        (log) => log.eventName === 'MemberAdded'
      )

      // Combine the events to get the members of each pool
      const pools = poolCreatedLogs.map((pool) => {
        const members = new Array<Pool['members'][number]>()

        poolJoinedLogs
          .filter((log) => log.args.minVotes === pool.args.minVotes)
          .map((log) => {
            const memberAddedLog = memberAddedLogs.find(
              (innerLog) => log.transactionHash === innerLog.transactionHash
            )

            members.push({
              address: log.args.member!,
              identityCommitment: memberAddedLog!.args.identityCommitment!,
            })
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
