'use client'

import { ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { useStatements } from '@/hooks/useStatements'
import { cn, formatMinVotes } from '@/lib/utils'

export default function HeroSection() {
  const statements = useStatements()

  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center md:py-32">
      <div className="mb-6 inline-block rounded-full bg-green/10 p-3">
        <Lock className="h-8 w-8 text-green" />
      </div>
      <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
        Private Statements for DAO Delegates
      </h1>
      <p className="mb-10 max-w-2xl text-xl text-muted-foreground">
        Express your views without revealing your identity. Verified by
        zero-knowledge proofs.
      </p>
      <div className="mb-16 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants(),
            'h-auto px-8 py-4 text-base'
          )}
        >
          Join a Pool <ChevronRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          href="/dashboard?tab=view"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-auto px-8 py-4 text-base'
          )}
        >
          View Statements
        </Link>
      </div>

      <div className="w-full max-w-4xl border p-6 sm:p-12">
        <div className="flex items-center justify-center">
          <div className="flex min-w-full flex-col gap-4 rounded-lg bg-muted p-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green"></div>
              <span className="font-mono text-sm">
                Pool:{' '}
                {statements.data?.[0].minVotes &&
                  `${formatMinVotes(BigInt(statements.data[0].minVotes))} Voting Power`}
              </span>
            </div>
            <div className="rounded bg-background p-4 text-left">
              <p className="font-mono text-muted-foreground">
                {statements.data?.[0].statement ?? '...'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green"></div>
                <span className="text-sm text-muted-foreground">
                  ZK Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
