'use client'

import { Identity } from '@semaphore-protocol/identity'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { encodeFunctionData } from 'viem'
import {
  useAccount,
  usePrepareTransactionRequest,
  useSignMessage,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { usePools } from '@/hooks/usePools'
import { delegatePoolsAbi, delegatePoolsAddress } from '@/lib/abi'

import { Button } from './ui/button'

type Props = {
  disabled: boolean
}

export function JoinPoolsDialog({ disabled }: Props) {
  const { address } = useAccount()
  const pools = usePools(address)
  const [identityCommitment, setIdentityCommitment] = useState<bigint>()

  const unjoinedPools = pools.data?.filter((pool) => !pool.joined) ?? []
  const unjoinedPoolIds = unjoinedPools.map((pool) => pool.minVotes)

  const sign = useSignMessage()
  const tx = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: tx.data })

  useEffect(() => {
    if (sign.data) {
      const identity = new Identity(sign.data)
      setIdentityCommitment(identity.commitment)
    }
  }, [sign.data])

  useEffect(() => {
    if (receipt.isSuccess) {
      pools.refetch()
    }
  }, [receipt.isSuccess])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          loading={pools.isLoading}
          className="w-full"
        >
          {disabled ? 'Already in All Pools' : 'Join Available Pools'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle>Join Available Pools</DialogTitle>

          <DialogDescription>
            First, you will need to sign a message to create your{' '}
            <a
              href="https://docs.semaphore.pse.dev/guides/identities#create-deterministic-identities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400"
            >
              Semaphore Identity
            </a>
            .
          </DialogDescription>

          <DialogDescription>
            Then, you will need to make a transaction to join eligible pools.
            This will be visible onchain and is non-reversible. This will allow
            you to make private statements if you want, but also improve the
            anonymity of the rest of the pool.
          </DialogDescription>

          {receipt.isError && (
            <Alert variant="destructive" className="!mt-4 max-w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your transaction failed for some reason :/
              </AlertDescription>
            </Alert>
          )}

          {receipt.isSuccess && (
            <Alert variant="default" className="!mt-4 max-w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your transaction was successful! You can close this dialog.
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={!!sign.data}
            onClick={() => {
              sign.signMessage({
                message: 'Generate my private delegate identity',
              })
            }}
          >
            1. Create Identity
          </Button>
          <Button
            disabled={!identityCommitment || tx.isPending || !!tx.data}
            loading={tx.isPending || receipt.isLoading}
            onClick={() => {
              if (!identityCommitment) {
                alert('Unreachable: No identity commitment')
                return
              }

              tx.writeContract({
                address: delegatePoolsAddress,
                abi: delegatePoolsAbi,
                functionName:
                  unjoinedPoolIds.length > 1 ? 'joinPools' : 'joinPool',
                args:
                  unjoinedPoolIds.length > 1
                    ? [unjoinedPoolIds, identityCommitment]
                    : [unjoinedPoolIds[0], identityCommitment],
              })
            }}
          >
            2. Join Pools
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
