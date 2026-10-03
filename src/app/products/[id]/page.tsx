'use client'

import dynamic from 'next/dynamic'
import layoutStyles from '@/styles/layout.module.css'

const ProductDetail = dynamic(() => import('@/components/products/ProductDetail'), {
  ssr: false,
  loading: () => <p className={layoutStyles.empty}>불러오는 중...</p>,
})

export default function ProductDetailPage() {
  return <ProductDetail />
}
