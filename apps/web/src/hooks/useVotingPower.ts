import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'
import { usePublicClient } from 'wagmi'

import { erc20WithVotesAbi } from '@/lib/abi'

export function useVotingPower({
  address,
  token = '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
}: {
  address?: Address
  token?: Address
}) {
  const client = usePublicClient()

  return useQuery({
    queryKey: ['voting-power', address, token],
    queryFn: async () => {
      if (!address) return undefined

      const res = await client?.readContract({
        address: token,
        abi: erc20WithVotesAbi,
        functionName: 'getVotes',
        args: [address],
      })

      return res
    },
  })
}
