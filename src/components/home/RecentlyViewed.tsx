'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/product.module.css'

type RecentProduct = { id: number; name: string }

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentProduct[]>([])

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('recentProducts') ?? '[]'))
  }, [])

  return (
    <section aria-labelledby="recent-title" className={layoutStyles.section}>
      <h2 id="recent-title" className={layoutStyles.sectionTitle}>
        최근 본 상품
      </h2>
      {items.length === 0 ? (
        <p className={layoutStyles.empty}>최근 본 상품이 없습니다.</p>
      ) : (
        <ul className={styles.categoryList}>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/products/${item.id}`} className={styles.categoryButton}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
