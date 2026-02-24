import { CheckCircle, ChevronRight, MessageSquare, Users } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="container mx-auto px-4 py-24"
    >
      <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl">
        How It Works
      </h2>

      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
              <Users className="h-10 w-10" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green font-bold text-green-foreground">
              1
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">Join Anonymity Pool</h3>
          <p className="text-muted-foreground">
            Delegates join onchain pools based on their voting power.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
              <MessageSquare className="h-10 w-10" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green font-bold text-green-foreground">
              2
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">Make Private Statement</h3>
          <p className="text-muted-foreground">
            Create a statement that will be associated with your pool, but not
            your specific identity.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green font-bold text-green-foreground">
              3
            </div>
          </div>
          <h3 className="mb-3 text-xl font-bold">ZK Verification</h3>
          <p className="text-muted-foreground">
            Viewers verify the statement came from a legitimate delegate in the
            pool using ZK proofs.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-4xl border p-8">
        <h3 className="mb-6 text-center text-2xl font-bold">
          Technical Implementation
        </h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-semibold">
              Semaphore Protocol
            </h4>
            <p className="mb-4 text-muted-foreground">
              We leverage Semaphore, a zero-knowledge protocol that enables
              proving membership of a group without revealing which member you
              are.
            </p>
            <a
              href="https://semaphore.pse.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green underline underline-offset-4 hover:text-green/80"
            >
              Learn more about Semaphore{' '}
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <div>
            <h4 className="mb-3 text-lg font-semibold">
              Trustless Verification
            </h4>
            <p className="mb-4 text-muted-foreground">
              All pool memberships are verified onchain, ensuring that only
              legitimate delegates with the required voting power can join
              specific pools.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
