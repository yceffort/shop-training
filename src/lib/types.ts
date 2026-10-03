export type Category = {
  id: string
  name: string
}

export type Product = {
  id: number
  name: string
  categoryId: string
  price: number
  rating: number
  reviewCount: number
  stock: number
  image: string
  description: string
  popularity: number
  createdAt: string
}

export type ProductSort = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating'

export type ProductListResponse = {
  items: Product[]
  total: number
  page: number
  totalPages: number
}

export type Review = {
  id: number
  productId: number
  author: string
  rating: number
  content: string
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
}

export type CartItem = {
  productId: number
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

export type Cart = {
  items: CartItem[]
}

export type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: number
  createdAt: string
  items: OrderItem[]
  totalPrice: number
}

export type OrderListResponse = {
  items: Order[]
  page: number
  hasMore: boolean
}
