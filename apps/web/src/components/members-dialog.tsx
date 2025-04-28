'use client'

import { useEnsName } from 'wagmi'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pool } from '@/hooks/usePools'
import { formatMinVotes, truncateAddress } from '@/lib/utils'

export function MembersDialog({ pool }: { pool: Pool }) {
  if (!pool) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger>
        <span className="text-gray-400">{pool.members.length} members</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle>Members in the Pool</DialogTitle>
          <DialogDescription>
            All of these delegates had more than {formatMinVotes(pool.minVotes)}{' '}
            votes at the time of joining the pool. Any statement made from this
            pool must have a signature from one of these members.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {pool.members.map((member) => (
            <Member key={member.address} member={member} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Member({ member }: { member: Pool['members'][number] }) {
  const { data: ensName } = useEnsName({ address: member.address })

  return (
    <div className="flex items-center gap-2">
      <img
        src={`https://ens-api.gregskril.com/avatar/${ensName}?width=64`}
        width={28}
        height={28}
        className="rounded-full object-cover"
      />
      <span>{ensName || truncateAddress(member.address)}</span>
    </div>
  )
}
