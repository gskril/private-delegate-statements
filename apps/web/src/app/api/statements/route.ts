import { NextResponse } from 'next/server'

import { getStatementHash, redis } from '@/lib/redis'
import { RedisStatement } from '@/lib/types'

export async function GET() {
  const statements = await redis.keys('statement:*')

  if (statements.length === 0) {
    return NextResponse.json([])
  }

  const values = (await redis.mget(statements)) as RedisStatement[]

  // Add `id` to each proof
  const statementsWithIds = values
    .map((v) => ({
      ...v,
      id: getStatementHash(v.statement),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

  return NextResponse.json(statementsWithIds)
}
