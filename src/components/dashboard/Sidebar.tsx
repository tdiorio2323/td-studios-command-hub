'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Files, 
  CheckSquare, 
  BarChart3, 
  Zap, 
  MessageSquare,
  Settings,
  Key,
  Folder,
  Camera,
  Code,
  Shield,
  Database,
  GitBranch,
  Terminal,
  Globe,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  children?: NavItem[]
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>(['workspace'])

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'AI Studio',
      href: '/dashboard/ai-studio',
      icon: <Brain className="w-5 h-5" />,
      badge: 'AI',
      children: [
        { label: 'Chat Interface', href: '/dashboard/ai-studio/chat', icon: <MessageSquare className="w-4 h-4" /> },
        { label: 'Model Training', href: '/dashboard/ai-studio/training', icon: <Database className="w-4 h-4" /> },
        { label: 'Automation', href: '/dashboard/ai-studio/automation', icon: <Zap className="w-4 h-4" /> }
      ]
    },
    {
      label: 'File Vault',
      href: '/dashboard/file-vault',
      icon: <Files className="w-5 h-5" />,
      children: [
        { label: 'Documents', href: '/dashboard/file-vault/documents', icon: <Files className="w-4 h-4" /> },
        { label: 'Media', href: '/dashboard/file-vault/media', icon: <Camera className="w-4 h-4" /> },
        { label: 'Code', href: '/dashboard/file-vault/code', icon: <Code className="w-4 h-4" /> },
        { label: 'Archives', href: '/dashboard/file-vault/archives', icon: <Folder className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Task Manager',
      href: '/dashboard/tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: '12'
    },
    {
      label: 'Workspace',
      href: '/dashboard/workspace',
      icon: <Folder className="w-5 h-5" />,
      children: [
        { label: 'Environment Vars', href: '/dashboard/workspace/env', icon: <Terminal className="w-4 h-4" /> },
        { label: 'API Keys', href: '/dashboard/workspace/keys', icon: <Key className="w-4 h-4" /> },
        { label: 'Credentials', href: '/dashboard/workspace/credentials', icon: <Shield className="w-4 h-4" /> },
        { label: 'Repositories', href: '/dashboard/workspace/repos', icon: <GitBranch className="w-4 h-4" /> }
      ]
    },
    {
      label: 'CMS',
      href: '/dashboard/cms',
      icon: <Globe className="w-5 h-5" />,
      children: [
        { label: 'Content', href: '/dashboard/cms/content', icon: <Files className="w-4 h-4" /> },
        { label: 'Pages', href: '/dashboard/cms/pages', icon: <Globe className="w-4 h-4" /> },
        { label: 'Templates', href: '/dashboard/cms/templates', icon: <Code className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Messages',
      href: '/dashboard/messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: '3'
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 className="w-5 h-5" />
    }
  ]

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-64 border-r z-50"
      style={{ 
        background: 'var(--secondary-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">
              TD Studios
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Command Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gray-700/50 border border-gray-600 text-white'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault()
                      toggleExpanded(item.label)
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`transition-colors ${isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.badge === 'AI' 
                          ? 'bg-gray-700/50 text-gray-300 border border-gray-600'
                          : 'bg-gray-700/50 text-gray-300 border border-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.label) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>

              {/* Submenu */}
              <AnimatePresence>
                {item.children && expandedItems.includes(item.label) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-4"
                  >
                    {item.children.map((child) => (
                      <motion.div
                        key={child.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={child.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(child.href)
                              ? 'bg-gray-700/50 text-gray-300'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {child.icon}
                          <span className="text-sm">{child.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>

      {/* Status Indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>
    </motion.div>
  )
}