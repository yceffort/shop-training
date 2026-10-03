'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { fetcher } from '@/lib/fetcher'
import { formatPrice } from '@/lib/format'
import type { Cart, CartItem } from '@/lib/types'
import styles from '@/styles/cart.module.css'
import layoutStyles from '@/styles/layout.module.css'

const quantityOptions = Array.from({ length: 20 }, (_, index) => index + 1)

function CartRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}) {
  const [quantity, setQuantity] = useState(item.quantity)

  return (
    <li className={styles.row}>
      <img src={item.image} alt={item.name} className={styles.rowImage} />
      <div>
        <p className={styles.rowName}>{item.name}</p>
        <p className={styles.rowPrice}>{formatPrice(item.price)}</p>
      </div>
      <select
        aria-label={`${item.name} 수량`}
        className={styles.quantitySelect}
        value={quantity}
        onChange={(event) => {
          const next = Number(event.target.value)
          setQuantity(next)
          onQuantityChange(next)
        }}
      >
        {quantityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button aria-label={`${item.name} 삭제`} className={styles.removeButton} onClick={onRemove}>
        삭제
      </button>
    </li>
  )
}

export default function CartPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: cart, isLoading } = useQuery({ queryKey: ['cart'], queryFn: () => fetcher<Cart>('/api/cart') })

  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      }),
    onMutate: ({ productId, quantity }) => {
      queryClient.setQueryData<Cart>(['cart'], (old) =>
        old ? { items: old.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)) } : old,
      )
    },
  })

  const removeItem = useMutation({
    mutationFn: (productId: number) => fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const placeOrder = useMutation({
    mutationFn: () => fetch('/api/orders', { method: 'POST' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/mypage')
    },
  })

  if (isLoading || !cart) {
    return <p className={layoutStyles.empty}>불러오는 중...</p>
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <h1 className={layoutStyles.pageTitle}>장바구니</h1>
      {cart.items.length === 0 ? (
        <p className={layoutStyles.empty}>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul aria-label="장바구니 상품" className={styles.list}>
            {cart.items.map((item, index) => (
              <CartRow
                key={index}
                item={item}
                onQuantityChange={(quantity) => updateQuantity.mutate({ productId: item.productId, quantity })}
                onRemove={() => removeItem.mutate(item.productId)}
              />
            ))}
          </ul>
          <div className={styles.summary}>
            <div>
              합계 <span data-testid="cart-total" className={styles.total}>{formatPrice(total)}</span>
            </div>
            <button className={styles.orderButton} onClick={() => placeOrder.mutate()} disabled={placeOrder.isPending}>
              주문하기
            </button>
          </div>
        </>
      )}
    </>
  )
}
