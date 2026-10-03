import Link from 'next/link'
import { listCategories } from '@/server/db'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/product.module.css'

export default async function CategoryShortcuts() {
  const categories = await listCategories()

  return (
    <section aria-labelledby="category-title" className={layoutStyles.section}>
      <h2 id="category-title" className={layoutStyles.sectionTitle}>
        카테고리
      </h2>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/products?category=${category.id}`} className={styles.categoryButton}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
