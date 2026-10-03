import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Markdown from 'react-markdown'
import { useAppContext } from '@/app/providers'
import ProductCard from '@/components/ProductCard'
import { fetcher } from '@/lib/fetcher'
import { formatPrice } from '@/lib/format'
import type { Category, Product, ProductListResponse, Review } from '@/lib/types'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/product.module.css'

type RecentProduct = { id: number; name: string }

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { showToast } = useAppContext()
  const [quantity, setQuantity] = useState(1)

  const { data: product } = useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: () => fetcher<Product>(`/api/products/${id}`),
  })
  const { data: reviews } = useSuspenseQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetcher<{ items: Review[] }>(`/api/products/${id}/reviews`),
  })
  const { data: categories } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher<Category[]>('/api/categories'),
  })
  const { data: related } = useSuspenseQuery({
    queryKey: ['related', product.categoryId],
    queryFn: () => fetcher<ProductListResponse>(`/api/products?category=${product.categoryId}&limit=5`),
  })

  if (typeof window !== 'undefined') {
    const recent: RecentProduct[] = JSON.parse(localStorage.getItem('recentProducts') ?? '[]')
    const next = [{ id: product.id, name: product.name }, ...recent.filter((item) => item.id !== product.id)].slice(0, 5)
    localStorage.setItem('recentProducts', JSON.stringify(next))
  }

  const handleAddToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(id), quantity }),
    })
    await queryClient.refetchQueries()
    showToast('장바구니에 담았습니다.')
  }

  const categoryName = categories.find((category) => category.id === product.categoryId)?.name
  const relatedProducts = related.items.filter((item) => item.id !== product.id).slice(0, 4)

  return (
    <>
      <div className={styles.detail}>
        <img src={product.image} alt={product.name} className={styles.detailImage} />
        <div className={styles.detailInfo}>
          <span className={styles.cardCategory}>{categoryName}</span>
          <h1>{product.name}</h1>
          <p data-testid="product-price" className={styles.price}>
            {formatPrice(product.price)}
          </p>
          <p className={styles.meta}>
            평점 {product.rating} (리뷰 {product.reviewCount}개)
          </p>
          <div className={styles.purchase}>
            <input
              type="number"
              aria-label="수량"
              min={1}
              className={styles.quantityInput}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
            <button className={styles.primaryButton} onClick={handleAddToCart}>
              장바구니 담기
            </button>
          </div>
          <div className={styles.description}>
            <Markdown>{product.description}</Markdown>
          </div>
        </div>
      </div>
      <section aria-labelledby="reviews-title" className={layoutStyles.section}>
        <h2 id="reviews-title" className={layoutStyles.sectionTitle}>
          리뷰
        </h2>
        <ul aria-label="리뷰 목록" className={styles.reviews}>
          {reviews.items.map((review) => (
            <li key={review.id} className={styles.review}>
              <div className={styles.reviewMeta}>
                {review.author} | 별점 {review.rating}
              </div>
              <p>{review.content}</p>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="related-title" className={layoutStyles.section}>
        <h2 id="related-title" className={layoutStyles.sectionTitle}>
          관련 상품
        </h2>
        <ul className={styles.grid}>
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} categoryName={categoryName} />
          ))}
        </ul>
      </section>
    </>
  )
}

export default function ProductDetail() {
  return (
    <Suspense fallback={<p className={layoutStyles.empty}>불러오는 중...</p>}>
      <ProductDetailContent />
    </Suspense>
  )
}
