import { expect, expectEveryText, expectProductNames, getProduct, listProducts, test } from './helpers'

test('추천 상품은 인기순 8개를 보여 주고 탭으로 카테고리를 바꿀 수 있다', async ({ page, request }) => {
  const popular = await listProducts(request, { sort: 'popular', limit: '8' })
  await page.goto('/')
  const list = page.getByRole('list', { name: '추천 상품 목록' })
  await expectProductNames(
    list.getByRole('listitem'),
    popular.items.map((product) => product.name),
  )

  const shoes = await listProducts(request, { sort: 'popular', limit: '8', category: 'shoes' })
  await page.getByRole('tab', { name: '신발' }).click()
  await expect(page.getByRole('tab', { name: '신발' })).toHaveAttribute('aria-selected', 'true')
  await expectProductNames(
    list.getByRole('listitem'),
    shoes.items.map((product) => product.name),
  )
  await expectEveryText(list.getByTestId('product-category'), '신발')
})

test('카테고리 바로가기를 누르면 해당 카테고리의 상품 목록으로 이동한다', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('region', { name: '카테고리' }).getByText('가방', { exact: true }).click()
  await expect(page).toHaveURL(/\/products\?category=bags/)
  await expectEveryText(page.getByRole('list', { name: '검색 결과' }).getByTestId('product-category'), '가방')
})

test('상세 페이지에서 본 상품이 최근 본 상품에 최신순으로 표시된다', async ({ page, request }) => {
  const first = await getProduct(request, 1)
  const second = await getProduct(request, 2)

  await page.goto('/products/1')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(first.name)
  await page.waitForLoadState('networkidle')
  await page.goto('/products/2')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(second.name)
  await page.waitForLoadState('networkidle')

  await page.goto('/')
  await expect(page.getByRole('region', { name: '최근 본 상품' }).getByRole('link')).toHaveText([
    second.name,
    first.name,
  ])
})

test('최근 본 상품이 없으면 안내 문구를 보여 준다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: '최근 본 상품' })).toContainText('최근 본 상품이 없습니다.')
})
