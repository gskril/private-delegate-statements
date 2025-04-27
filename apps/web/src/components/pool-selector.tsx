'use client'

import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function PoolSelector() {
  const [selectedPool, setSelectedPool] = useState('10k')

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-medium">Select Anonymity Pool</h3>
      <RadioGroup
        defaultValue={selectedPool}
        onValueChange={setSelectedPool}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div
          className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedPool === '1k' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700'}`}
        >
          <RadioGroupItem value="1k" id="pool-1k" />
          <Label htmlFor="pool-1k" className="flex cursor-pointer flex-col">
            <span className="font-medium">1k Pool</span>
            <span className="text-sm text-gray-400">42 members</span>
          </Label>
        </div>

        <div
          className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedPool === '10k' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700'}`}
        >
          <RadioGroupItem value="10k" id="pool-10k" />
          <Label htmlFor="pool-10k" className="flex cursor-pointer flex-col">
            <span className="font-medium">10k Pool</span>
            <span className="text-sm text-gray-400">18 members</span>
          </Label>
        </div>

        <div
          className={`flex items-center space-x-2 rounded-lg border p-4 ${selectedPool === '50k' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700'}`}
        >
          <RadioGroupItem value="50k" id="pool-50k" />
          <Label htmlFor="pool-50k" className="flex cursor-pointer flex-col">
            <span className="font-medium">50k Pool</span>
            <span className="text-sm text-gray-400">7 members</span>
          </Label>
        </div>
      </RadioGroup>

      <p className="mt-3 text-sm text-gray-400">
        Your voting power: 12,500 — You are eligible for the 1k and 10k pools.
      </p>
    </div>
  )
}
