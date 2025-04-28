import { SemaphoreProof } from '@semaphore-protocol/proof'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatEther, keccak256, toHex } from 'viem/utils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatMinVotes(minVotes: bigint) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(Number(formatEther(minVotes)))
}

export function getStatementHash(statement: string) {
  return keccak256(toHex(statement))
}

export function formatProof(proof: SemaphoreProof) {
  return {
    merkleTreeDepth: BigInt(proof.merkleTreeDepth),
    merkleTreeRoot: BigInt(proof.merkleTreeRoot),
    message: BigInt(proof.message),
    nullifier: BigInt(proof.nullifier),
    scope: BigInt(proof.scope),
    points: proof.points,
  }
}
