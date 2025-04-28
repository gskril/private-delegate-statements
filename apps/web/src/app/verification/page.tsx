'use client'

import { CheckCircle, Search, XCircle } from 'lucide-react'
import { useState } from 'react'

import DashboardNav from '@/components/dashboard-nav'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStatement } from '@/hooks/useStatements'
import { Statement } from '@/lib/types'
import { getStatementHash } from '@/lib/utils'

export default function Verification() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statement, setStatement] = useState<Statement | null>()

  const handleVerifyStatement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const message = formData.get('statement') as string

    try {
      const statement = await getStatement(getStatementHash(message))
      setStatement(statement)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">Statement Verification</h1>
        <p className="mb-8 text-gray-400">
          Verify that statements came from legitimate delegates in the specified
          pool.
        </p>

        <Card className="mx-auto max-w-3xl border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle>Verify Statement</CardTitle>
            <CardDescription>
              Every statement on this website is already verified, but you can
              double check by using the tools below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="statement" className="w-full">
              {/* <TabsList className="mb-6 grid grid-cols-2">
                <TabsTrigger
                  value="statement"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  Verify by Statement
                </TabsTrigger>
                <TabsTrigger
                  value="proof"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  Verify by Proof
                </TabsTrigger>
              </TabsList> */}

              <TabsContent value="statement">
                <div className="space-y-4">
                  <form onSubmit={handleVerifyStatement} className="flex gap-2">
                    <Input
                      name="statement"
                      placeholder="Paste statement"
                      className="border-gray-700 bg-gray-900"
                    />
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="bg-emerald-500 text-black hover:bg-emerald-600"
                    >
                      <Search className="h-4 w-4" />
                      Fetch proof
                    </Button>
                  </form>

                  {/* <div className="flex items-start gap-3 rounded-lg border border-emerald-500 bg-emerald-500/20 p-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                    <div>
                      <p className="mb-2 font-medium text-emerald-300">
                        Statement Verified!
                      </p>
                      <p className="text-sm text-gray-300">
                        This statement was created by a verified member of the
                        10k voting power pool. The zero-knowledge proof confirms
                        pool membership without revealing the specific delegate
                        identity.
                      </p>
                    </div>
                  </div> */}

                  {statement === null && !isSubmitting && (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                      <p className="text-gray-400">
                        No statement found. Please try again.
                      </p>
                    </div>
                  )}

                  {statement && !isSubmitting && (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="font-mono text-sm text-emerald-500">
                          10k Pool
                        </span>
                        <div className="ml-auto flex items-center gap-1 text-sm text-gray-400">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          <span>Verified</span>
                        </div>
                      </div>

                      <p className="mb-4 text-gray-200">
                        {statement.statement}
                      </p>

                      <div className="text-sm text-gray-400">
                        <span>
                          {new Date(statement.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="mb-3 text-lg font-medium">
                          Semaphore Proof
                        </h3>

                        <pre className="overflow-x-scroll rounded-lg bg-gray-800 p-4 font-mono text-sm">
                          {JSON.stringify(statement.proof, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="proof">
                <div className="space-y-4">
                  <Input
                    placeholder="Paste ZK proof"
                    className="border-gray-700 bg-gray-900 font-mono"
                  />

                  <div className="flex items-start gap-3 rounded-lg border border-red-500 bg-red-500/20 p-4">
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="mb-2 font-medium text-red-300">
                        Invalid Proof
                      </p>
                      <p className="text-sm text-gray-300">
                        The provided proof could not be verified. This may be
                        due to an invalid format, tampered data, or a proof that
                        doesn&apos;t correspond to any known anonymity pool.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="mb-3 text-lg font-medium">
                      Technical Details
                    </h3>
                    <div className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm">
                      <p className="text-red-400">
                        Error: Invalid nullifier hash
                      </p>
                      <p className="mt-2 text-gray-400">
                        Verification process:
                      </p>
                      <p className="text-gray-500">
                        1. Proof format check:{' '}
                        <span className="text-emerald-400">PASSED</span>
                      </p>
                      <p className="text-gray-500">
                        2. Signature verification:{' '}
                        <span className="text-emerald-400">PASSED</span>
                      </p>
                      <p className="text-gray-500">
                        3. Nullifier check:{' '}
                        <span className="text-red-400">FAILED</span>
                      </p>
                      <p className="text-gray-500">
                        4. Merkle tree verification:{' '}
                        <span className="text-gray-400">SKIPPED</span>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">How Verification Works</h2>

          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="mb-4 text-lg font-medium">
              Semaphore Zero-Knowledge Proofs
            </h3>

            <p className="mb-4 text-gray-300">
              Private Delegate Statements uses the Semaphore protocol to enable
              anonymous yet verifiable communication:
            </p>

            <ol className="list-inside list-decimal space-y-3 text-gray-300">
              <li>
                <span className="font-medium text-white">
                  Identity Creation:
                </span>{' '}
                Each delegate generates a Semaphore identity (a private key and
                a commitment).
              </li>
              <li>
                <span className="font-medium text-white">Pool Joining:</span>{' '}
                The commitment is added to the Merkle tree of the appropriate
                voting power pool.
              </li>
              <li>
                <span className="font-medium text-white">
                  Statement Creation:
                </span>{' '}
                When making a statement, the delegate generates a zero-knowledge
                proof that proves:
                <ul className="ml-6 mt-2 list-inside list-disc text-gray-400">
                  <li>
                    They are a member of the specified pool (without revealing
                    which member)
                  </li>
                  <li>They have the authority to make the statement</li>
                  <li>The statement hasn&apos;t been tampered with</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-white">Verification:</span>{' '}
                Anyone can verify the proof against the pool&apos;s Merkle root
                to confirm the statement&apos;s authenticity.
              </li>
            </ol>

            <div className="mt-6">
              <a
                href="https://semaphore.pse.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'outline' })}
              >
                Learn More About Semaphore
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
