'use client'

import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/lib/fetcher'
import type { User } from '@/lib/types'
import layoutStyles from '@/styles/layout.module.css'
import styles from '@/styles/mypage.module.css'

export default function Profile() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => fetcher<User>('/api/me') })

  return (
    <section aria-labelledby="profile-title" className={layoutStyles.section}>
      <h2 id="profile-title" className={layoutStyles.sectionTitle}>
        프로필
      </h2>
      <div className={styles.profile}>
        <dl>
          <dt>이름</dt>
          <dd>{me?.name}</dd>
          <dt>이메일</dt>
          <dd>{me?.email}</dd>
        </dl>
      </div>
    </section>
  )
}
