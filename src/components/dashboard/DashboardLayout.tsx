'use client'

import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
      <div className="matrix-bg"></div>
      <Sidebar />
      <main className="flex-1 overflow-x-hidden ml-64 relative">
        <div className="p-8 w-full max-w-none pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
