import { SemaphoreProof } from '@semaphore-protocol/proof'

export type RedisStatement = {
  statement: string
  minVotes: string
  groupSize: number
  proof: SemaphoreProof
  timestamp: number
}
