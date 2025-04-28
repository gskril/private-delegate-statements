'use server'

import { type SemaphoreProof } from '@semaphore-protocol/proof'

import { redis } from './redis'
import { type RedisStatement } from './types'
import { getStatementHash } from './utils'

export async function saveStatement({
  groupSize,
  statement,
  minVotes,
  proof,
}: {
  groupSize: number
  statement: string
  minVotes: bigint
  proof: SemaphoreProof
}) {
  const statementId = `statement:${getStatementHash(statement)}`

  const object: RedisStatement = {
    statement,
    minVotes: minVotes.toString(),
    groupSize,
    proof,
    timestamp: Date.now(),
  }

  await redis.set(statementId, object)
}
