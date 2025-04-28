'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { RedisStatement } from '@/lib/types'
import { formatMinVotes } from '@/lib/utils'

export default function StatementFeed() {
  const statements = useQuery({
    queryKey: ['statements'],
    queryFn: async () => {
      const response = await fetch('/api/statements')
      return response.json() as Promise<(RedisStatement & { id: string })[]>
    },
  })

  if (statements.data?.length === 0) {
    return <div>No statements found</div>
  }

  return (
    <div>
      <div className="space-y-6">
        {statements.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

        {statements.data?.map((statement) => (
          <div
            key={statement.id}
            className="rounded-lg border border-gray-800 bg-gray-900 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="font-mono text-sm text-emerald-500">
                {formatMinVotes(BigInt(statement.minVotes))} Pool
              </span>
              <div className="ml-auto flex items-center gap-1 text-sm text-gray-400">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>Verified</span>
              </div>
            </div>

            <p className="mb-4 text-gray-200">{statement.statement}</p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{new Date(statement.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
