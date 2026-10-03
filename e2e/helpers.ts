import { type APIRequestContext, expect, type Locator, test as base } from '@playwright/test'
import type { Product, ProductListResponse } from '../src/lib/types'

export const test = base.extend({
  page: async ({ page, request }, use) => {
    await request.post('/api/test/reset')
    await use(page)
  },
})

export { expect }

export function formatPrice(price: number) {
  return `${price.toLocaleString('ko-KR')}원`
}

export function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((part) => part.type === type)?.value
  return `${get('year')}.${get('month')}.${get('day')}`
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getProduct(request: APIRequestContext, id: number): Promise<Product> {
  return (await request.get(`/api/products/${id}`)).json()
}

export async function listProducts(request: APIRequestContext, query: Record<string, string>) {
  const response = await request.get(`/api/products?${new URLSearchParams(query)}`)
  return (await response.json()) as ProductListResponse
}

export async function expectProductNames(items: Locator, names: string[]) {
  await expect(items).toHaveText(names.map((name) => new RegExp(escapeRegExp(name))))
}

export async function expectEveryText(locator: Locator, expected: string) {
  await expect
    .poll(async () => {
      const texts = await locator.allTextContents()
      return texts.length > 0 && texts.every((text) => text.trim() === expected)
    })
    .toBe(true)
}
