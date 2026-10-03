import { Suspense } from 'react'
import ProductList from '@/components/products/ProductList'
import layoutStyles from '@/styles/layout.module.css'

export default function ProductsPage() {
  return (
    <>
      <h1 className={layoutStyles.pageTitle}>상품 목록</h1>
      <Suspense>
        <ProductList />
      </Suspense>
    </>
  )
}
