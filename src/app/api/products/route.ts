import { isProductSort, listProducts } from '@/server/db'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const sort = params.get('sort') ?? 'popular'
  return Response.json(
    await listProducts({
      q: params.get('q') ?? '',
      category: params.get('category') ?? '',
      sort: isProductSort(sort) ? sort : 'popular',
      page: Number(params.get('page') ?? 1),
      limit: Number(params.get('limit') ?? 20),
    }),
  )
}
