import { expect, expectEveryText, expectProductNames, listProducts, test } from './helpers'

const names = (response: { items: { name: string }[] }) => response.items.map((product) => product.name)

test('헤더 검색은 상품 목록으로 이동해 검색어로 필터링한다', async ({ page, request }) => {
  const expected = await listProducts(request, { q: '셔츠' })
  await page.goto('/')
  await page.getByRole('textbox', { name: '상품 검색' }).fill('셔츠')
  await page.getByRole('button', { name: '검색', exact: true }).click()

  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('셔츠')
  await expect(page.getByRole('textbox', { name: '결과 내 검색' })).toHaveValue('셔츠')
  await expectProductNames(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem'), names(expected))
})

test('카테고리를 고르면 URL과 결과가 바뀐다', async ({ page, request }) => {
  const expected = await listProducts(request, { category: 'shoes' })
  await page.goto('/products')
  const results = page.getByRole('list', { name: '검색 결과' })
  await expect(results.getByRole('listitem')).toHaveCount(20)

  await page.getByRole('combobox', { name: '카테고리' }).selectOption({ label: '신발' })
  await expect(page).toHaveURL(/category=shoes/)
  await expectProductNames(results.getByRole('listitem'), names(expected))
  await expectEveryText(results.getByTestId('product-category'), '신발')
  await expect(page.getByText(`총 ${expected.total}개`)).toBeVisible()
})

test('정렬을 바꾸면 URL과 결과 순서가 바뀐다', async ({ page, request }) => {
  const expected = await listProducts(request, { sort: 'price-asc' })
  await page.goto('/products')
  await expect(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem')).toHaveCount(20)
  await page.getByRole('combobox', { name: '정렬' }).selectOption({ label: '낮은 가격순' })
  await expect(page).toHaveURL(/sort=price-asc/)
  await expectProductNames(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem'), names(expected))
})

test('결과 내 검색어는 URL에 반영되고 결과를 좁힌다', async ({ page, request }) => {
  const expected = await listProducts(request, { q: '니트' })
  await page.goto('/products')
  await expect(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem')).toHaveCount(20)
  await page.getByRole('textbox', { name: '결과 내 검색' }).fill('니트')
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('니트')
  await expectProductNames(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem'), names(expected))
})

test('결과가 없으면 안내 문구를 보여 준다', async ({ page }) => {
  await page.goto('/products?q=존재하지않는상품')
  await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible()
})

test('페이지네이션으로 다음, 이전 페이지를 볼 수 있다', async ({ page, request }) => {
  const first = await listProducts(request, { page: '1' })
  const second = await listProducts(request, { page: '2' })
  await page.goto('/products')
  const results = page.getByRole('list', { name: '검색 결과' })
  const indicator = page.getByTestId('page-indicator')
  await expect(indicator).toHaveText(`1 / ${first.totalPages}`)
  await expect(page.getByRole('button', { name: '이전' })).toBeDisabled()

  await page.getByRole('button', { name: '다음' }).click()
  await expect(page).toHaveURL(/page=2/)
  await expect(indicator).toHaveText(`2 / ${first.totalPages}`)
  await expectProductNames(results.getByRole('listitem'), names(second))

  await page.getByRole('button', { name: '이전' }).click()
  await expect(indicator).toHaveText(`1 / ${first.totalPages}`)
  await expectProductNames(results.getByRole('listitem'), names(first))
})

test('URL로 직접 들어오면 필터 UI와 결과가 URL을 따른다', async ({ page, request }) => {
  const expected = await listProducts(request, { category: 'beauty', sort: 'price-desc' })
  await page.goto('/products?category=beauty&sort=price-desc')
  await expect(page.getByRole('combobox', { name: '카테고리' })).toHaveValue('beauty')
  await expect(page.getByRole('combobox', { name: '정렬' })).toHaveValue('price-desc')
  await expectProductNames(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem'), names(expected))
})

test('스크롤을 내리면 맨 위로 버튼이 나타난다', async ({ page }) => {
  await page.goto('/products')
  await expect(page.getByRole('list', { name: '검색 결과' }).getByRole('listitem')).toHaveCount(20)
  const button = page.getByRole('button', { name: '맨 위로' })
  await expect(button).toHaveCount(0)
  await page.mouse.wheel(0, 1500)
  await expect(button).toBeVisible()
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
