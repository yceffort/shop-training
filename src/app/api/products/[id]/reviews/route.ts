import { listReviews } from '@/server/db'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return Response.json({ items: await listReviews(Number(id)) })
}
