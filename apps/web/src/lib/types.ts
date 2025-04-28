import { SemaphoreProof } from '@semaphore-protocol/proof'

export type RedisStatement = {
  statement: string
  minVotes: string
  proof: SemaphoreProof
  timestamp: number
}
