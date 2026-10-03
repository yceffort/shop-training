import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { cookies } from 'next/headers'
import OrderHistory from '@/components/mypage/OrderHistory'
import Profile from '@/components/mypage/Profile'
import layoutStyles from '@/styles/layout.module.css'

export default async function MyPage() {
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['orders', 1],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/orders?page=1', {
        headers: { cookie: cookieStore.toString() },
      })
      return res.json()
    },
  })

  return (
    <>
      <h1 className={layoutStyles.pageTitle}>마이페이지</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile />
        <OrderHistory />
      </HydrationBoundary>
    </>
  )
}
