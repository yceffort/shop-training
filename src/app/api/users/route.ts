import { listUsers } from '@/server/db'

export async function GET() {
  return Response.json(await listUsers())
}
