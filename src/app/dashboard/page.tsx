'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Files, 
  CheckSquare, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Users,
  TrendingUp,
  Activity,
  Cpu,
  Database,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  activeProjects: number
  completedTasks: number
  aiInteractions: number
  storageUsed: string
  uptime: string
}

interface QuickAction {
  icon: React.ReactNode
  label: string
  href: string
  color: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 8,
    completedTasks: 47,
    aiInteractions: 234,
    storageUsed: '2.4 GB',
    uptime: '99.9%'
  })

  const [recentActivity] = useState([
    { id: 1, action: 'AI Analysis completed', time: '2m ago', type: 'success' },
    { id: 2, action: 'New file uploaded to vault', time: '5m ago', type: 'info' },
    { id: 3, action: 'Task "Project Review" completed', time: '12m ago', type: 'success' },
    { id: 4, action: 'Workflow automation triggered', time: '18m ago', type: 'warning' },
    { id: 5, action: 'AI Assistant trained on new data', time: '1h ago', type: 'info' }
  ])

  const quickActions: QuickAction[] = [
    { 
      icon: <Brain className="w-6 h-6" />, 
      label: 'AI Studio', 
      href: '/dashboard/ai-studio',
      color: 'bw-icon'
    },
    { 
      icon: <Files className="w-6 h-6" />, 
      label: 'File Vault', 
      href: '/dashboard/file-vault',
      color: 'bw-icon'
    },
    { 
      icon: <CheckSquare className="w-6 h-6" />, 
      label: 'Task Manager', 
      href: '/dashboard/tasks',
      color: 'bw-icon'
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      label: 'Analytics', 
      href: '/dashboard/analytics',
      color: 'bw-icon'
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      label: 'Workflows', 
      href: '/dashboard/workflows',
      color: 'bw-icon'
    },
    { 
      icon: <MessageSquare className="w-6 h-6" />, 
      label: 'Messages', 
      href: '/dashboard/messages',
      color: 'bw-icon'
    }
  ]

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('td-auth')
    if (!auth) {
      router.push('/login')
    }

    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        aiInteractions: prev.aiInteractions + Math.floor(Math.random() * 3),
        storageUsed: (parseFloat(prev.storageUsed) + Math.random() * 0.01).toFixed(2) + ' GB'
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('td-auth')
    router.push('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full bw-icon flex items-center justify-center"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                TD Studios
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files, tasks, or ask AI..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg dark-input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, Tyler
          </h2>
          <p className="text-gray-400">
            Your digital command center is ready. What would you like to accomplish today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Interactions</p>
                <p className="text-2xl font-bold text-white">{stats.aiInteractions}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">{stats.storageUsed}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-white">{stats.uptime}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => router.push(action.href)}
                    className="group relative p-6 bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <p className="text-white font-medium text-left">{action.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 rounded-full mt-2 bg-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Neural Network</h3>
                  <p className="text-gray-400 text-sm">All systems operational • Processing at 94% efficiency</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}