import { ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center md:py-32">
      <div className="mb-6 inline-block rounded-full bg-emerald-500/20 p-3">
        <Lock className="h-8 w-8 text-emerald-500" />
      </div>
      <h1 className="mb-6 max-w-4xl text-4xl font-bold md:text-6xl">
        Private Statements for DAO Delegates
      </h1>
      <p className="mb-10 max-w-2xl text-xl text-gray-300">
        Express your views without revealing your identity. Verified by
        zero-knowledge proofs.
      </p>
      <div className="mb-16 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants(),
            'h-auto bg-emerald-500 px-8 py-6 text-lg text-black hover:bg-emerald-600'
          )}
        >
          Join a Pool <ChevronRight className="ml-2 h-5 w-5" />
        </Link>
        {/* <Link
          href="/verification"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-auto border-emerald-500 px-8 py-6 text-lg text-emerald-500 hover:bg-emerald-500/10'
          )}
        >
          View Statements
        </Link> */}
      </div>
      <div className="w-full max-w-4xl rounded-xl bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-6 sm:p-12">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-4 rounded-lg bg-black/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="font-mono text-sm text-emerald-500">
                Pool: 10k Voting Power
              </span>
            </div>
            <div className="rounded bg-gray-900 p-4 text-left">
              <p className="font-mono text-gray-300">
                &quot;I believe we should allocate more resources to research
                before voting on Proposal #42. The current approach lacks
                sufficient data to make an informed decision.&quot;
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-400">ZK Verified</span>
              </div>
              {/* <span className="text-sm text-gray-400">Posted 2 hours ago</span> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
