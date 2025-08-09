'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Brain,
  FileText,
  CheckSquare,
  BarChart3,
  Workflow,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Users
} from 'lucide-react'

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Brain, label: 'AI Studio', href: '/dashboard/ai-studio' },
  { icon: FileText, label: 'File Vault', href: '/dashboard/file-vault' },
  { icon: CheckSquare, label: 'Task Manager', href: '/dashboard/tasks' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Workflow, label: 'Workspace', href: '/dashboard/workspace' },
  { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      localStorage.removeItem('td-user')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  // Mobile menu toggle button
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-[60] md:hidden p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div className={`fixed left-0 top-0 h-screen w-80 glass-card border-r border-white/10 z-50 rounded-none transform transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold chrome-text">TD Studios</h1>
                  <p className="text-xs text-gray-400">Command Hub</p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : ''}`} />
                    <span className="font-medium text-base">{item.label}</span>
                  </Link>
                )
              })}

              {/* Additional Menu Items */}
              <Link
                href="/dashboard/library"
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                  pathname === '/dashboard/library'
                    ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${pathname === '/dashboard/library' ? 'text-blue-400' : ''}`}>
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span className="font-medium text-base">Library</span>
              </Link>

              <Link
                href="/dashboard/affiliates"
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                  pathname === '/dashboard/affiliates'
                    ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className={`w-6 h-6 ${pathname === '/dashboard/affiliates' ? 'text-blue-400' : ''}`} />
                <span className="font-medium text-base">Affiliates</span>
              </Link>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-medium text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop sidebar
  return (
    <div className={`fixed left-0 top-0 h-screen ${collapsed ? 'w-16' : 'w-64'} glass-sidebar border-r border-white/10 z-50 rounded-none transition-all duration-300 hidden md:block`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold chrome-text">TD Studios</h1>
                <p className="text-xs text-gray-400">Command Hub</p>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}

          {/* Additional Menu Items */}
          <Link
            href="/dashboard/library"
            className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              pathname === '/dashboard/library'
                ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${pathname === '/dashboard/library' ? 'text-blue-400' : ''}`}>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            {!collapsed && <span className="font-medium">Library</span>}
          </Link>

          <Link
            href="/dashboard/affiliates"
            className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              pathname === '/dashboard/affiliates'
                ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className={`w-5 h-5 ${pathname === '/dashboard/affiliates' ? 'text-blue-400' : ''}`} />
            {!collapsed && <span className="font-medium">Affiliates</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
