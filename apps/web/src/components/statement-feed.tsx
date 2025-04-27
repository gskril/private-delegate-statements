'use client'

import { CheckCircle, Flag, MessageSquare, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StatementFeed() {
  const [filter, setFilter] = useState('all')

  const statements = [
    {
      id: 1,
      pool: '10k',
      content:
        'I believe we should allocate more resources to research before voting on Proposal #42. The current approach lacks sufficient data to make an informed decision.',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      pool: '50k',
      content:
        'The treasury diversification strategy needs to be reconsidered. Our current allocation is too heavily weighted towards volatile assets, which poses unnecessary risk to the DAO.',
      timestamp: '5 hours ago',
      likes: 24,
      comments: 7,
    },
    {
      id: 3,
      pool: '1k',
      content:
        'I disagree with the direction of the marketing initiatives. We should focus on community building rather than paid promotions at this stage.',
      timestamp: '1 day ago',
      likes: 8,
      comments: 2,
    },
    {
      id: 4,
      pool: '10k',
      content:
        'The governance process is becoming too bureaucratic. We need to streamline decision-making for minor operational changes while maintaining rigorous review for protocol changes.',
      timestamp: '2 days ago',
      likes: 19,
      comments: 5,
    },
  ]

  const filteredStatements =
    filter === 'all' ? statements : statements.filter((s) => s.pool === filter)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Pool</h3>
        <Select defaultValue={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-gray-900">
            <SelectValue placeholder="Select Pool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pools</SelectItem>
            <SelectItem value="1k">1k Pool</SelectItem>
            <SelectItem value="10k">10k Pool</SelectItem>
            <SelectItem value="50k">50k Pool</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredStatements.map((statement) => (
          <div
            key={statement.id}
            className="rounded-lg border border-gray-800 bg-gray-900 p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="font-mono text-sm text-emerald-500">
                {statement.pool} Pool
              </span>
              <div className="ml-auto flex items-center gap-1 text-sm text-gray-400">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>Verified</span>
              </div>
            </div>

            <p className="mb-4 text-gray-200">{statement.content}</p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{statement.timestamp}</span>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-auto items-center gap-1 p-0 text-gray-400 hover:text-emerald-400"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{statement.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-auto items-center gap-1 p-0 text-gray-400 hover:text-emerald-400"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{statement.comments}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-auto items-center gap-1 p-0 text-gray-400 hover:text-emerald-400"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
        >
          Load More
        </Button>
      </div>
    </div>
  )
}
