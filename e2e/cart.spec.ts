import { expect, formatPrice, getProduct, test } from './helpers'

test('수량을 바꾸고 상품을 삭제하면 합계와 배지가 바뀐다', async ({ page, request }) => {
  const first = await getProduct(request, 3)
  const second = await getProduct(request, 10)
  await page.request.post('/api/cart', { data: { productId: first.id, quantity: 1 } })
  await page.request.post('/api/cart', { data: { productId: second.id, quantity: 2 } })

  await page.goto('/cart')
  const rows = page.getByRole('list', { name: '장바구니 상품' }).getByRole('listitem')
  const total = page.getByTestId('cart-total')
  await expect(rows).toHaveCount(2)
  await expect(total).toHaveText(formatPrice(first.price + second.price * 2))
  await expect(page.getByTestId('cart-count')).toHaveText('3')

  await page.getByRole('combobox', { name: `${first.name} 수량` }).selectOption('3')
  await expect(total).toHaveText(formatPrice(first.price * 3 + second.price * 2))
  await expect(page.getByTestId('cart-count')).toHaveText('5')

  await page.getByRole('button', { name: `${first.name} 삭제` }).click()
  await expect(rows).toHaveCount(1)
  await expect(total).toHaveText(formatPrice(second.price * 2))

  await page.getByRole('button', { name: `${second.name} 삭제` }).click()
  await expect(page.getByText('장바구니가 비어 있습니다.')).toBeVisible()
  await expect(page.getByRole('button', { name: '주문하기' })).toHaveCount(0)
  await expect(page.getByTestId('cart-count')).toHaveText('0')
})

test('주문하면 마이페이지로 이동하고 새 주문이 맨 위에 보인다', async ({ page, request }) => {
  const product = await getProduct(request, 5)
  await page.request.post('/api/cart', { data: { productId: product.id, quantity: 1 } })

  await page.goto('/cart')
  await page.getByRole('button', { name: '주문하기' }).click()
  await expect(page).toHaveURL(/\/mypage$/)

  const orders = page.getByRole('region', { name: '주문 내역' })
  await expect(orders.getByText(/^주문번호 #\d+$/).first()).toHaveText('주문번호 #3001')
  await expect(orders.getByText(`${product.name} x 1`)).toBeVisible()
  await expect(page.getByTestId('cart-count')).toHaveText('0')
})
