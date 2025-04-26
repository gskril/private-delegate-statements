import { SemaphoreProof } from '@semaphore-protocol/proof'

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
