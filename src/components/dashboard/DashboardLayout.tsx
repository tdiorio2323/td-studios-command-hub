'use client'

import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' }}>
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden ml-64">
        <div className="p-4 md:p-8 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  )
}
