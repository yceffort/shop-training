import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/types'
import styles from '@/styles/product.module.css'

export default function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  return (
    <li>
      <Link href={`/products/${product.id}`} className={styles.card}>
        <div className={styles.cardImageWrap}>
          <img src={product.image} alt={product.name} className={styles.cardImage} />
        </div>
        <div className={styles.cardBody}>
          <span data-testid="product-category" className={styles.cardCategory}>
            {categoryName}
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
