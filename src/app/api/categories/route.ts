import { listCategories } from '@/server/db'

export async function GET() {
  return Response.json(await listCategories())
}
