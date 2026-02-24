'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { useStatements } from '@/hooks/useStatements'
import { formatMinVotes } from '@/lib/utils'

export default function StatementFeed() {
  const statements = useStatements()

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
            className="rounded-lg border p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green"></div>
              <span className="font-mono text-sm">
                {formatMinVotes(BigInt(statement.minVotes))} Pool with{' '}
                {statement.groupSize} members
              </span>
              <Link
                href={`/verification?statement=${encodeURI(statement.statement)}`}
                className="ml-auto flex items-center gap-1 text-sm text-green hover:text-green/80"
              >
                <CheckCircle className="h-3 w-3" />
                <span>View Proof</span>
              </Link>
            </div>

            <p className="mb-4">{statement.statement}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{new Date(statement.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
