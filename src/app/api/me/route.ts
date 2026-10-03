import { getUser } from '@/server/db'
import { getCurrentUserId } from '@/server/session'

export async function GET() {
  return Response.json(await getUser(await getCurrentUserId()))
}
