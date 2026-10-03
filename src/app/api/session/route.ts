import { cookies } from 'next/headers'
import { getUser, isUserId } from '@/server/db'
import { SESSION_COOKIE } from '@/server/session'

export async function POST(request: Request) {
  const { userId } = await request.json()
  if (!isUserId(userId)) return Response.json({ error: '존재하지 않는 사용자입니다.' }, { status: 400 })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, { path: '/', httpOnly: true, sameSite: 'lax' })
  return Response.json(await getUser(userId))
}
