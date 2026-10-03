'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { fetcher } from '@/lib/fetcher'
import { formatPrice } from '@/lib/format'
import type { Category, Product, ProductListResponse } from '@/lib/types'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/product.module.css'

const sortOptions = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
  { value: 'rating', label: '평점순' },
]

type Filters = { q: string; category: string; sort: string; page: number }

export default function ProductList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'popular')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1))
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher<Category[]>('/api/categories'),
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      fetcher<ProductListResponse>(`/api/products?${new URLSearchParams({ q, category, sort, page: String(page) })}`),
  })

  useEffect(() => {
    refetch()
  }, [q, category, sort, page])

  useEffect(() => {
    setTimeout(() => {
      if (keyword !== q) {
        setQ(keyword)
        setPage(1)
        updateUrl({ q: keyword, page: 1 })
      }
    }, 300)
  }, [keyword])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 400)
    })
  }, [])

  const updateUrl = (next: Partial<Filters>) => {
    const merged = { q, category, sort, page, ...next }
    const params = new URLSearchParams()
    if (merged.q) params.set('q', merged.q)
    if (merged.category) params.set('category', merged.category)
    if (merged.sort !== 'popular') params.set('sort', merged.sort)
    if (merged.page > 1) params.set('page', String(merged.page))
    router.push(`/products?${params}`)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
    updateUrl({ category: value, page: 1 })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setPage(1)
    updateUrl({ sort: value, page: 1 })
  }

  const handlePageChange = (value: number) => {
    setPage(value)
    updateUrl({ page: value })
  }

  const ProductItem = ({ product }: { product: Product }) => {
    const [loaded, setLoaded] = useState(false)

    return (
      <li>
        <Link href={`/products/${product.id}`} className={styles.card}>
          <div className={styles.cardImageWrap}>
            {!loaded && <div className={styles.skeleton} />}
            <img src={product.image} alt={product.name} className={styles.cardImage} onLoad={() => setLoaded(true)} />
          </div>
          <div className={styles.cardBody}>
            <span data-testid="product-category" className={styles.cardCategory}>
              {categories.find((item) => item.id === product.categoryId)?.name}
            </span>
            <p className={styles.cardName}>{product.name}</p>
            <span data-testid="product-price" className={styles.cardPrice}>
              {formatPrice(product.price)}
            </span>
          </div>
        </Link>
      </li>
    )
  }

  return (
    <>
      <div className={styles.filters}>
        <input
          aria-label="결과 내 검색"
          className={styles.filterInput}
          placeholder="결과 내 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <select
          aria-label="카테고리"
          className={styles.filterSelect}
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          <option value="">전체</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          aria-label="정렬"
          className={styles.filterSelect}
          value={sort}
          onChange={(event) => handleSortChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <p className={layoutStyles.empty}>불러오는 중...</p>
      ) : data && data.items.length > 0 ? (
        <>
          <p className={styles.resultCount}>총 {data.total}개</p>
          <ul aria-label="검색 결과" className={styles.grid}>
            {data.items.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </ul>
          <div className={styles.pagination}>
            <button className={styles.pageButton} disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
              이전
            </button>
            <span data-testid="page-indicator">
              {data.page} / {data.totalPages}
            </span>
            <button
              className={styles.pageButton}
              disabled={page >= data.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <p className={layoutStyles.empty}>검색 결과가 없습니다.</p>
      )}
      {showScrollTop && (
        <button className={styles.scrollTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          맨 위로
        </button>
      )}
    </>
  )
}
