import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import { getUser } from '@/server/db'
import { getCurrentUserId } from '@/server/session'
import styles from '@/styles/layout.module.css'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: '쇼핑몰',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const userId = await getCurrentUserId()
  await queryClient.prefetchQuery({ queryKey: ['me'], queryFn: () => getUser(userId) })

  return (
    <html lang="ko">
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            <main className={`${styles.container} ${styles.main}`}>{children}</main>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  )
}
