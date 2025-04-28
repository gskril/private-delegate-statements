import { useQuery } from '@tanstack/react-query'
import { Hex } from 'viem'

import { Statement } from '@/lib/types'

export function useStatements() {
  return useQuery({
    queryKey: ['statements'],
    queryFn: async () => {
      return await getStatements()
    },
  })
}

export async function getStatements() {
  const response = await fetch('/api/statements')
  return response.json() as Promise<Statement[]>
}

export async function getStatement(id: Hex) {
  const response = await fetch(`/api/statements/${id}`)
  return response.json() as Promise<Statement | null>
}
