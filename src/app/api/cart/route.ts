import { addToCart, getCart, removeCartItem, updateCartItem } from '@/server/db'
import { handle } from '@/server/http'
import { getCurrentUserId } from '@/server/session'

export async function GET() {
  return handle(async () => getCart(await getCurrentUserId()))
}

export async function POST(request: Request) {
  const { productId, quantity } = await request.json()
  return handle(async () => addToCart(await getCurrentUserId(), Number(productId), Number(quantity)))
}

export async function PATCH(request: Request) {
  const { productId, quantity } = await request.json()
  return handle(async () => updateCartItem(await getCurrentUserId(), Number(productId), Number(quantity)))
}

export async function DELETE(request: Request) {
  const productId = Number(new URL(request.url).searchParams.get('productId'))
  return handle(async () => removeCartItem(await getCurrentUserId(), productId))
}
