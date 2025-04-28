import { SemaphoreProof } from '@semaphore-protocol/proof'
import { Hex } from 'viem'

export interface RedisStatement {
  statement: string
  minVotes: string
  groupSize: number
  proof: SemaphoreProof
  timestamp: number
}

export interface Statement extends RedisStatement {
  id: Hex
}
