'use client'

import { CheckCircle } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function StatementForm() {
  const [statement, setStatement] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission and ZK proof generation
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        setStatement('')
      }, 3000)
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your private statement here..."
          className="min-h-[150px] resize-none border-gray-700 bg-gray-900"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          required
        />

        <div className="text-sm text-gray-400">
          <p className="mb-2">Guidelines:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Your statement will be associated with the 10k pool, not your
              specific identity
            </li>
            <li>
              A zero-knowledge proof will be generated to verify your pool
              membership
            </li>
            <li>The statement cannot be deleted once published</li>
          </ul>
        </div>

        {isSuccess && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500 bg-emerald-500/20 p-4">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <p className="text-emerald-300">
              Statement successfully published with ZK proof! Your identity
              remains private.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-emerald-500 text-black hover:bg-emerald-600"
            disabled={isSubmitting || statement.trim().length < 10}
          >
            {isSubmitting ? 'Generating ZK Proof...' : 'Publish Statement'}
          </Button>
        </div>
      </div>
    </form>
  )
}
