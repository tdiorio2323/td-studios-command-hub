'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('td-auth')
    if (!auth) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)', color: 'var(--text-primary)' }}>
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}