'use server'

import { SemaphoreProof } from '@semaphore-protocol/proof'

import { getStatementHash, redis } from './redis'
import { RedisStatement } from './types'

export async function saveStatement({
  statement,
  minVotes,
  proof,
}: {
  statement: string
  minVotes: bigint
  proof: SemaphoreProof
}) {
  const statementId = `statement:${getStatementHash(statement)}`

  const object: RedisStatement = {
    statement,
    minVotes: minVotes.toString(),
    proof,
    timestamp: Date.now(),
  }

  await redis.set(statementId, object)
}
