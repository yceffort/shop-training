import type { Review } from '../src/lib/types'
import { expect, expectEveryText, formatPrice, getProduct, test } from './helpers'

test('상품 정보, 설명, 리뷰, 관련 상품을 보여 준다', async ({ page, request }) => {
  const product = await getProduct(request, 7)
  const reviews: Review[] = (await (await request.get('/api/products/7/reviews')).json()).items

  await page.goto('/products/7')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(product.name)
  await expect(page.getByTestId('product-price').first()).toHaveText(formatPrice(product.price))
  await expect(page.getByText(`평점 ${product.rating} (리뷰 ${product.reviewCount}개)`)).toBeVisible()
  await expect(page.getByRole('img', { name: product.name }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: '상품 소개' })).toBeVisible()
  await expect(page.getByRole('list', { name: '리뷰 목록' }).getByRole('listitem')).toHaveCount(reviews.length)

  const related = page.getByRole('region', { name: '관련 상품' })
  await expect(related.getByRole('listitem')).toHaveCount(4)
  await expectEveryText(related.getByTestId('product-category'), '의류')
  await expect(related.getByRole('link', { name: product.name })).toHaveCount(0)
})

test('수량을 정해 장바구니에 담으면 안내가 뜨고 배지가 바뀐다', async ({ page }) => {
  await page.goto('/products/3')
  await expect(page.getByTestId('cart-count')).toHaveText('0')
  await page.getByRole('spinbutton', { name: '수량' }).fill('2')
  await page.getByRole('button', { name: '장바구니 담기' }).click()
  await expect(page.getByRole('status')).toHaveText('장바구니에 담았습니다.')
  await expect(page.getByTestId('cart-count')).toHaveText('2')
})
