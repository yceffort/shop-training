import { createOrder, listOrders } from '@/server/db'
import { handle } from '@/server/http'
import { getCurrentUserId } from '@/server/session'

export async function GET(request: Request) {
  const page = Number(new URL(request.url).searchParams.get('page') ?? 1)
  return handle(async () => listOrders(await getCurrentUserId(), page))
}

export async function POST() {
  return handle(async () => createOrder(await getCurrentUserId()))
}
