'use client'

import { Group } from '@semaphore-protocol/group'
import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { keccak256, toHex } from 'viem/utils'
import { useAccount, useSignMessage } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Pool, usePools } from '@/hooks/usePools'
import { saveStatement } from '@/lib/actions'
import { cn, formatMinVotes } from '@/lib/utils'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export default function StatementForm() {
  const { address } = useAccount()
  const sign = useSignMessage()
  const pools = usePools(address)
  const joinedPools = pools.data?.filter((pool) => pool.joined) ?? []

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    const statement = formData.get('statement') as string
    const pool = formData.get('pool') as string

    // TODO: Implement proper validation
    if (!pool) {
      alert('Select a pool')
      setIsSubmitting(false)
      return
    }

    const minVotes = BigInt(pool)

    try {
      const data = await sign.signMessageAsync({
        message: 'Generate my private delegate identity',
      })

      // Identity commitments of everyone in the pool
      const group = new Group(
        joinedPools
          .find((p) => p.minVotes === minVotes)!
          .members.map((m) => m.identityCommitment)
      )
      const scope = group.root
      const identity = new Identity(data)

      const proof = await generateProof(
        identity,
        group,
        keccak256(toHex(statement)),
        scope
      )
      console.log({ proof })

      await saveStatement({ statement, minVotes, proof })
      setIsSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Error generating proof')
      }
    }

    setIsSubmitting(false)
  }

  if (!address) {
    return null
  }

  if (pools.isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  if (joinedPools.length === 0) {
    return (
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Cannot publish statements</AlertTitle>
        <AlertDescription>
          You are not in any anonymity pools. Please join one to publish.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form action={handleSubmit}>
      <PoolSelector pools={joinedPools} />

      <div className="space-y-4">
        <Textarea
          name="statement"
          placeholder="Enter your anonymous statement here..."
          className="min-h-[150px] resize-none border-gray-700 bg-gray-900"
          required
        />

        <div className="text-sm text-gray-400">
          <p className="mb-2">Guidelines:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Your statement will be associated with the pool you select, not
              your specific identity.
            </li>
            <li>
              As a general best practice, you should not post a statement
              immediately after joining a pool.
            </li>
          </ul>
        </div>

        {isSuccess && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500 bg-emerald-500/20 p-4">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <p className="text-emerald-300">
              A ZK proof has been generated for your statement! See the "View
              Statements" tab.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-500 text-black hover:bg-emerald-600"
          >
            {isSubmitting ? 'Generating ZK Proof...' : 'Publish Statement'}
          </Button>
        </div>
      </div>
    </form>
  )
}

function PoolSelector({ pools }: { pools: Pool[] }) {
  const [selectedPool, setSelectedPool] = useState<string>()

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-medium">Select Anonymity Pool</h3>

      <RadioGroup
        name="pool"
        onValueChange={setSelectedPool}
        className={`grid grid-cols-1 gap-4 md:grid-cols-${Math.max(
          pools.length ?? 0,
          2
        )}`}
      >
        {pools.map((pool) => {
          const minVotesStr = pool.minVotes.toString()

          return (
            <div
              key={pool.groupId}
              className={cn(
                'flex items-center space-x-2 rounded-lg border p-4',
                selectedPool === minVotesStr
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700'
              )}
            >
              <RadioGroupItem value={minVotesStr} id={minVotesStr} />
              <Label
                htmlFor={minVotesStr}
                className="flex cursor-pointer flex-col"
              >
                <span className="font-medium">
                  {formatMinVotes(pool.minVotes)} Pool
                </span>
                <span className="text-sm text-gray-400">
                  {pool.members.length} members
                </span>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
