import { cookies } from 'next/headers'
import { isUserId } from './db'

export const SESSION_COOKIE = 'uid'

export async function getCurrentUserId() {
  const cookieStore = await cookies()
  const id = cookieStore.get(SESSION_COOKIE)?.value
  return isUserId(id) ? id : 'u1'
}
