'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/app/providers'
import { fetcher } from '@/lib/fetcher'
import type { Cart, User } from '@/lib/types'
import styles from '@/styles/header.module.css'
import layoutStyles from '@/styles/layout.module.css'

export default function Header() {
  const queryClient = useQueryClient()
  const { searchText, setSearchText } = useAppContext()
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => fetcher<User>('/api/me') })
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: () => fetcher<User[]>('/api/users') })
  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: () => fetcher<Cart>('/api/cart') })
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (cart) {
      setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0))
    }
  }, [cart])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.location.href = `/products?q=${searchText}`
  }

  const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: event.target.value }),
    })
    queryClient.invalidateQueries({ queryKey: ['me'] })
  }

  return (
    <header className={styles.header}>
      <div className={`${layoutStyles.container} ${styles.inner}`}>
        <a href="/" className={styles.logo}>
          쇼핑몰
        </a>
        <nav aria-label="주요 메뉴" className={styles.nav}>
          <a href="/products" className={styles.navLink}>
            상품
          </a>
          <span>
            <a href="/cart" className={styles.navLink}>
              장바구니
            </a>
            <span data-testid="cart-count" className={styles.badge}>
              {cartCount}
            </span>
          </span>
          <a href="/mypage" className={styles.navLink}>
            마이페이지
          </a>
        </nav>
        <form role="search" className={styles.search} onSubmit={handleSearch}>
          <input
            aria-label="상품 검색"
            className={styles.searchInput}
            placeholder="상품을 검색하세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>
        <div className={styles.user}>
          {me && <span>{me.name}님</span>}
          <select aria-label="사용자 전환" className={styles.userSelect} value={me?.id ?? ''} onChange={handleUserChange}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
