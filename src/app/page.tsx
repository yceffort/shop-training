import CategoryShortcuts from '@/components/home/CategoryShortcuts'
import RecentlyViewed from '@/components/home/RecentlyViewed'
import RecommendedProducts from '@/components/home/RecommendedProducts'

export default function HomePage() {
  return (
    <>
      <RecommendedProducts />
      <CategoryShortcuts />
      <RecentlyViewed />
    </>
  )
}
