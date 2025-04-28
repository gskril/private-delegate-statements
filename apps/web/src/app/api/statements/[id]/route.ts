import { NextResponse } from 'next/server'

import { redis } from '@/lib/redis'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const statement = await redis.get(`statement:${id}`)

  if (!statement) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json({ id, ...statement })
}
