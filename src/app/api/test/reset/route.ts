import { resetDb } from '@/server/db'

export async function POST() {
  if (process.env.E2E !== '1') return new Response(null, { status: 404 })
  resetDb()
  return Response.json({ ok: true })
}
