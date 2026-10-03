import { getProduct } from '@/server/db'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(Number(id))
  if (!product) return Response.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 })
  return Response.json(product)
}
