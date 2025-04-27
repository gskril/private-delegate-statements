import { CheckCircle, ChevronRight, MessageSquare, Users } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="container mx-auto rounded-2xl bg-gray-900/50 px-4 py-24"
    >
      <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
        How It Works
      </h2>

      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <Users className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
              1
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">Join Anonymity Pool</h3>
          <p className="text-gray-300">
            Delegates join onchain pools based on their voting power (1k, 10k,
            or 50k).
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <MessageSquare className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
              2
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">Make Private Statement</h3>
          <p className="text-gray-300">
            Create a statement that will be associated with your pool, not your
            specific identity.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-black">
              3
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">ZK Verification</h3>
          <p className="text-gray-300">
            Viewers verify the statement came from a legitimate delegate in the
            pool using Semaphore ZK proofs.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-4xl rounded-xl bg-black/30 p-8">
        <h3 className="mb-6 text-center text-2xl font-bold">
          Technical Implementation
        </h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-semibold text-emerald-400">
              Semaphore Protocol
            </h4>
            <p className="mb-4 text-gray-300">
              We leverage Semaphore, a zero-knowledge protocol that enables
              proving membership of a group without revealing which member you
              are.
            </p>
            <a
              href="https://semaphore.pse.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-emerald-500 hover:text-emerald-400"
            >
              Learn more about Semaphore{' '}
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-semibold text-emerald-400">
              On-chain Verification
            </h4>
            <p className="mb-4 text-gray-300">
              All pool memberships are verified on-chain, ensuring that only
              legitimate delegates with the required voting power can join
              specific pools.
            </p>
            <div className="overflow-x-auto rounded bg-gray-800 p-3 font-mono text-xs">
              <code className="text-emerald-300">
                {`// Example verification\nfunction verifyMembership(bytes memory proof) public view returns (bool) {\n  return semaphore.verifyProof(poolId, proof);\n}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
