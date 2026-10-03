import { DbError } from './db'

export async function handle(run: () => Promise<unknown>) {
  try {
    return Response.json(await run())
  } catch (error) {
    if (error instanceof DbError) return Response.json({ error: error.message }, { status: error.status })
    throw error
  }
}
