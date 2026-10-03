'use client'

import { useQuery } from '@tanstack/react-query'
import _ from 'lodash'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { fetcher } from '@/lib/fetcher'
import { formatPrice } from '@/lib/format'
import type { Order, OrderListResponse } from '@/lib/types'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/mypage.module.css'

export default function OrderHistory() {
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const { data, isFetching } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => fetcher<OrderListResponse>(`/api/orders?page=${page}`),
  })

  useEffect(() => {
    if (data) {
      setOrders((prev) => _.uniqBy([...prev, ...data.items], 'id'))
    }
  }, [data])

  const groups = _.groupBy(orders, (order) => moment(order.createdAt).format('YYYY년 M월'))

  return (
    <section aria-labelledby="orders-title" className={layoutStyles.section}>
      <h2 id="orders-title" className={layoutStyles.sectionTitle}>
        주문 내역
      </h2>
      {Object.entries(groups).map(([month, monthOrders]) => (
        <div key={month}>
          <h3 className={styles.monthTitle}>{month}</h3>
          <ul className={styles.orderList}>
            {monthOrders.map((order) => (
              <li key={order.id} className={styles.order}>
                <div className={styles.orderHeader}>
                  <span>주문번호 #{order.id}</span>
                  <span>{moment(order.createdAt).format('YYYY.MM.DD')}</span>
                </div>
                <ul className={styles.orderItems}>
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>{formatPrice(order.totalPrice)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {data?.hasMore && (
        <button className={styles.moreButton} disabled={isFetching} onClick={() => setPage(page + 1)}>
          더 보기
        </button>
      )}
    </section>
  )
}
