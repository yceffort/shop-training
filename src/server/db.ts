import type {
  Cart,
  Category,
  Order,
  OrderListResponse,
  Product,
  ProductListResponse,
  ProductSort,
  Review,
  User,
} from '@/lib/types'

export const categories: Category[] = [
  { id: 'clothing', name: '의류' },
  { id: 'shoes', name: '신발' },
  { id: 'bags', name: '가방' },
  { id: 'accessories', name: '액세서리' },
  { id: 'beauty', name: '뷰티' },
  { id: 'living', name: '리빙' },
]

type UserRecord = User & { phone: string; address: string }

const users: UserRecord[] = [
  { id: 'u1', name: '김민준', email: 'minjun@example.com', phone: '010-2841-7730', address: '서울시 강남구 테헤란로 123' },
  { id: 'u2', name: '이서연', email: 'seoyeon@example.com', phone: '010-6612-0954', address: '부산시 해운대구 해운대로 456' },
]

const nouns: Record<string, string[]> = {
  clothing: ['티셔츠', '셔츠', '니트', '후드티', '청바지', '슬랙스', '원피스', '자켓', '코트', '맨투맨'],
  shoes: ['스니커즈', '러닝화', '로퍼', '부츠', '샌들', '슬리퍼', '더비슈즈', '뮬'],
  bags: ['백팩', '토트백', '크로스백', '클러치', '에코백', '숄더백', '메신저백'],
  accessories: ['모자', '머플러', '벨트', '선글라스', '시계', '장갑', '양말', '귀걸이'],
  beauty: ['립밤', '핸드크림', '선크림', '향수', '클렌저', '토너', '세럼'],
  living: ['머그컵', '쿠션', '담요', '디퓨저', '캔들', '수건', '화분', '무드등'],
}
const adjectives = ['베이직', '오버핏', '클래식', '데일리', '프리미엄', '미니멀', '빈티지', '소프트', '모던', '내추럴', '슬림', '컴포트']
const colors = ['블랙', '화이트', '네이비', '베이지', '그레이', '카키', '브라운']
const materials = ['면 100%', '폴리에스터 혼방', '천연 가죽', '리넨', '울 혼방', '스테인리스', '세라믹']
const origins = ['대한민국', '베트남', '이탈리아', '포르투갈', '일본']
const reviewers = ['김', '이', '박', '최', '정', '강', '조', '윤']
const reviewTexts = [
  '생각보다 품질이 좋아요. 재구매 의사 있습니다.',
  '배송이 빨랐고 포장도 꼼꼼했어요.',
  '사진이랑 색감이 조금 달라요. 그래도 만족합니다.',
  '가격 대비 훌륭합니다.',
  '사이즈가 딱 맞아요. 추천합니다.',
  '선물용으로 샀는데 받는 사람이 좋아했어요.',
  '마감이 조금 아쉽지만 쓰기엔 문제없어요.',
  '두 번째 구매입니다. 역시 좋네요.',
]

function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, list: T[]): T {
  return list[Math.floor(random() * list.length)]
}

function dateFrom(base: string, offsetDays: number) {
  const date = new Date(base)
  date.setUTCDate(date.getUTCDate() + offsetDays)
  return date.toISOString()
}

function createProducts(): Product[] {
  const random = seededRandom(20261003)
  const used = new Set<string>()
  const products: Product[] = []
  let id = 1
  while (products.length < 200) {
    const category = categories[products.length % categories.length]
    const name = `${pick(random, adjectives)} ${pick(random, nouns[category.id])} ${pick(random, colors)}`
    if (used.has(name)) continue
    used.add(name)
    const categoryName = category.name
    products.push({
      id,
      name,
      categoryId: category.id,
      price: Math.round((9900 + random() * 180000) / 100) * 100,
      rating: Math.round((3 + random() * 2) * 10) / 10,
      reviewCount: 3 + Math.floor(random() * 10),
      stock: 3 + Math.floor(random() * 13),
      image: `/images/products/${category.id}-${(id % 3) + 1}.jpg`,
      description: [
        '## 상품 소개',
        '',
        `**${name}**은 ${categoryName} 카테고리에서 꾸준히 사랑받는 상품입니다. 매일 부담 없이 사용할 수 있도록 디자인했습니다.`,
        '',
        `- 소재: ${pick(random, materials)}`,
        `- 원산지: ${pick(random, origins)}`,
        '- 관리 방법: 직사광선을 피해 보관해 주세요.',
        '',
        '## 배송 안내',
        '',
        '평일 오후 2시 이전에 주문하시면 _당일 출고_됩니다. 제주와 도서 산간 지역은 추가 배송비가 발생할 수 있습니다.',
      ].join('\n'),
      popularity: Math.floor(random() * 10000),
      createdAt: dateFrom('2026-01-01T00:00:00Z', Math.floor(random() * 270)),
    })
    id++
  }
  return products
}

const products = createProducts()

function createReviews(product: Product): Review[] {
  const random = seededRandom(product.id * 7919)
  return Array.from({ length: product.reviewCount }, (_, index) => ({
    id: product.id * 100 + index,
    productId: product.id,
    author: `${pick(random, reviewers)}**`,
    rating: 1 + Math.floor(random() * 5),
    content: pick(random, reviewTexts),
    createdAt: dateFrom(product.createdAt, 3 + index * 5),
  }))
}

type CartLine = { productId: number; quantity: number }

type DbState = {
  carts: Map<string, CartLine[]>
  orders: Map<string, Order[]>
  nextOrderId: number
}

function createOrders(userId: string, count: number, seed: number, startId: number): Order[] {
  const random = seededRandom(seed)
  const orders: Order[] = []
  for (let i = 0; i < count; i++) {
    const lineCount = 1 + Math.floor(random() * 3)
    const items = Array.from({ length: lineCount }, () => {
      const product = pick(random, products)
      return { productId: product.id, name: product.name, price: product.price, quantity: 1 + Math.floor(random() * 2) }
    })
    orders.push({
      id: startId + count - 1 - i,
      createdAt: dateFrom('2026-09-28T09:00:00Z', -i * 9 - Math.floor(random() * 4)),
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    })
  }
  return orders
}

function createState(): DbState {
  return {
    carts: new Map(users.map((user) => [user.id, []])),
    orders: new Map([
      ['u1', createOrders('u1', 25, 11, 1001)],
      ['u2', createOrders('u2', 3, 22, 2001)],
    ]),
    nextOrderId: 3001,
  }
}

const globalForDb = globalThis as unknown as { __shopDb?: DbState }

function state() {
  globalForDb.__shopDb ??= createState()
  return globalForDb.__shopDb
}

export function resetDb() {
  globalForDb.__shopDb = createState()
}

export class DbError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

function delay() {
  const fixed = process.env.API_DELAY_MS
  const ms = fixed !== undefined ? Number(fixed) : 150 + Math.random() * 650
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const sorters: Record<ProductSort, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
}

export function isProductSort(value: string): value is ProductSort {
  return value in sorters
}

export async function listProducts({
  q = '',
  category = '',
  sort = 'popular',
  page = 1,
  limit = 20,
}: {
  q?: string
  category?: string
  sort?: ProductSort
  page?: number
  limit?: number
}): Promise<ProductListResponse> {
  await delay()
  const keyword = q.trim()
  const filtered = products
    .filter((product) => (category ? product.categoryId === category : true))
    .filter((product) => (keyword ? product.name.includes(keyword) : true))
    .sort(sorters[sort])
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
  const current = Math.min(Math.max(1, page), totalPages)
  return {
    items: filtered.slice((current - 1) * limit, current * limit),
    total: filtered.length,
    page: current,
    totalPages,
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  await delay()
  return products.find((product) => product.id === id) ?? null
}

export async function listReviews(productId: number): Promise<Review[]> {
  await delay()
  const product = products.find((item) => item.id === productId)
  return product ? createReviews(product) : []
}

export async function listCategories(): Promise<Category[]> {
  await delay()
  return categories
}

export function isUserId(id: string | undefined): id is string {
  return users.some((user) => user.id === id)
}

export async function listUsers(): Promise<User[]> {
  return users.map(({ id, name, email }) => ({ id, name, email }))
}

export async function getUser(id: string): Promise<User | null> {
  await delay()
  const user = users.find((item) => item.id === id)
  return user ? { id: user.id, name: user.name, email: user.email } : null
}

function toCart(lines: CartLine[]): Cart {
  return {
    items: lines.map((line) => {
      const product = products.find((item) => item.id === line.productId)!
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: line.quantity,
      }
    }),
  }
}

function findProductOrThrow(productId: number) {
  const product = products.find((item) => item.id === productId)
  if (!product) throw new DbError('상품을 찾을 수 없습니다.', 404)
  return product
}

export async function getCart(userId: string): Promise<Cart> {
  await delay()
  return toCart(state().carts.get(userId) ?? [])
}

export async function addToCart(userId: string, productId: number, quantity: number): Promise<Cart> {
  await delay()
  const product = findProductOrThrow(productId)
  const lines = state().carts.get(userId) ?? []
  const line = lines.find((item) => item.productId === productId)
  const nextQuantity = (line?.quantity ?? 0) + quantity
  if (quantity < 1 || nextQuantity > product.stock) throw new DbError('재고가 부족합니다.', 400)
  if (line) line.quantity = nextQuantity
  else lines.push({ productId, quantity })
  state().carts.set(userId, lines)
  return toCart(lines)
}

export async function updateCartItem(userId: string, productId: number, quantity: number): Promise<Cart> {
  await delay()
  const product = findProductOrThrow(productId)
  const lines = state().carts.get(userId) ?? []
  const line = lines.find((item) => item.productId === productId)
  if (!line) throw new DbError('장바구니에 없는 상품입니다.', 404)
  if (quantity < 1 || quantity > product.stock) throw new DbError('재고가 부족합니다.', 400)
  line.quantity = quantity
  return toCart(lines)
}

export async function removeCartItem(userId: string, productId: number): Promise<Cart> {
  await delay()
  const lines = (state().carts.get(userId) ?? []).filter((item) => item.productId !== productId)
  state().carts.set(userId, lines)
  return toCart(lines)
}

export async function listOrders(userId: string, page = 1, limit = 10): Promise<OrderListResponse> {
  await delay()
  const orders = state().orders.get(userId) ?? []
  const current = Math.max(1, page)
  return {
    items: orders.slice((current - 1) * limit, current * limit),
    page: current,
    hasMore: current * limit < orders.length,
  }
}

export async function createOrder(userId: string): Promise<Order> {
  await delay()
  const db = state()
  const cart = toCart(db.carts.get(userId) ?? [])
  if (cart.items.length === 0) throw new DbError('장바구니가 비어 있습니다.', 400)
  const items = cart.items.map(({ productId, name, price, quantity }) => ({ productId, name, price, quantity }))
  const order: Order = {
    id: db.nextOrderId++,
    createdAt: new Date().toISOString(),
    items,
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }
  db.orders.set(userId, [order, ...(db.orders.get(userId) ?? [])])
  db.carts.set(userId, [])
  return order
}
