import type { OrderListResponse } from '../src/lib/types'
import { expect, formatDate, formatPrice, test } from './helpers'

test('프로필과 주문 내역을 보여 주고 더 보기로 이어서 불러온다', async ({ page, request }) => {
  const firstPage: OrderListResponse = await (await request.get('/api/orders?page=1')).json()
  const latest = firstPage.items[0]

  await page.goto('/mypage')
  const profile = page.getByRole('region', { name: '프로필' })
  await expect(profile).toContainText('김민준')
  await expect(profile).toContainText('minjun@example.com')

  const orders = page.getByRole('region', { name: '주문 내역' })
  const orderNumbers = orders.getByText(/^주문번호 #\d+$/)
  await expect(orderNumbers).toHaveCount(10)
  await expect(orderNumbers.first()).toHaveText(`주문번호 #${latest.id}`)
  await expect(orders.getByRole('heading', { name: '2026년 9월' })).toBeVisible()
  await expect(orders.getByText(formatDate(latest.createdAt)).first()).toBeVisible()
  await expect(orders.getByText(formatPrice(latest.totalPrice)).first()).toBeVisible()

  await page.getByRole('button', { name: '더 보기' }).click()
  await expect(orderNumbers).toHaveCount(20)
  await page.getByRole('button', { name: '더 보기' }).click()
  await expect(orderNumbers).toHaveCount(25)
  await expect(page.getByRole('button', { name: '더 보기' })).toHaveCount(0)
})

test('사용자를 전환하면 헤더와 마이페이지가 전환한 사용자 기준으로 바뀐다', async ({ page }) => {
  await page.goto('/')
  const header = page.getByRole('banner')
  await expect(header).toContainText('김민준님')

  await page.getByRole('combobox', { name: '사용자 전환' }).selectOption({ label: '이서연' })
  await expect(header).toContainText('이서연님')

  await page.goto('/mypage')
  await expect(page.getByRole('region', { name: '프로필' })).toContainText('이서연')
  await expect(page.getByRole('region', { name: '주문 내역' }).getByText(/^주문번호 #\d+$/)).toHaveCount(3)
})
