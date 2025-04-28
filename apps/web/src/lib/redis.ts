import { Redis } from '@upstash/redis'
import 'server-only'
import { Hex } from 'viem'
import { keccak256, toHex } from 'viem/utils'

import { RedisStatement } from './types'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export function getStatementHash(statement: string) {
  return keccak256(toHex(statement))
}

export async function getStatement(statementId: Hex) {
  return (await redis.get(statementId)) as RedisStatement
}
