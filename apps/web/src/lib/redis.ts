import { Redis } from '@upstash/redis'
import 'server-only'
import { Hex } from 'viem'

import { RedisStatement } from './types'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function getStatement(statementId: Hex) {
  return (await redis.get(statementId)) as RedisStatement
}
