'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useRef, useState } from 'react'
import styles from '@/styles/layout.module.css'

const queryClient = new QueryClient()

type AppContextValue = {
  searchText: string
  setSearchText: (value: string) => void
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext() {
  const value = useContext(AppContext)
  if (!value) throw new Error('useAppContext must be used within Providers')
  return value
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = (message: string) => {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ searchText, setSearchText, showToast }}>
        {children}
        {toast && (
          <div role="status" className={styles.toast}>
            {toast}
          </div>
        )}
      </AppContext.Provider>
    </QueryClientProvider>
  )
}
