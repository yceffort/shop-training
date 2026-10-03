'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product, ProductListResponse } from '@/lib/types'
import { categories } from '@/server/db'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/product.module.css'

const tabs = [{ id: '', name: '전체' }, ...categories]

export default function RecommendedProducts() {
  const [tab, setTab] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products?sort=popular&limit=8${tab ? `&category=${tab}` : ''}`)
      .then((res) => res.json())
      .then((data: ProductListResponse) => {
        setProducts(data.items)
        setLoading(false)
      })
  }, [tab])

  return (
    <section aria-labelledby="recommended-title" className={layoutStyles.section}>
      <h2 id="recommended-title" className={layoutStyles.sectionTitle}>
        추천 상품
      </h2>
      <div role="tablist" className={styles.tabs}>
        {tabs.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            className={styles.tab}
            onClick={() => setTab(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {loading ? (
        <p className={layoutStyles.empty}>불러오는 중...</p>
      ) : (
        <ul aria-label="추천 상품 목록" className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categories.find((category) => category.id === product.categoryId)?.name}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
