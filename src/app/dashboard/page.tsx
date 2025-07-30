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
  Bot,
  Search,
  Plus,
  Sparkles,
  Command
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

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
  gradient: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 8,
    completedTasks: 47,
    aiInteractions: 235,
    storageUsed: '2.40 GB',
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
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: <Files className="w-6 h-6" />,
      label: 'File Vault',
      href: '/dashboard/file-vault',
      gradient: 'from-blue-500 to-green-500'
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      label: 'Task Manager',
      href: '/dashboard/tasks',
      gradient: 'from-green-500 to-yellow-500'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Analytics',
      href: '/dashboard/analytics',
      gradient: 'from-yellow-500 to-red-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Workflows',
      href: '/dashboard/workspace',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: 'Messages',
      href: '/dashboard/messages',
      gradient: 'from-pink-500 to-purple-500'
    }
  ]

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/overview')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStats(data.data.stats)
            setRecentActivity(data.data.recentActivity)
            setNotifications(data.data.notifications)
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }

    loadDashboardData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('td-auth')
    router.push('/login')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Header with Logo */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            {/* TD Studios Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative p-2 glass-card rounded-xl">
                <img
                  src="/td-logo.png"
                  alt="TD Studios Logo"
                  className="w-10 h-10 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none"></div>
              </div>
              <div>
                <motion.h1
                  className="text-4xl font-luxury chrome-text mb-1"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Welcome back, Tyler
                </motion.h1>
                <p className="text-gray-400 text-lg">Your digital command center is ready. What would you like to accomplish today?</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card-gradient p-4 md:p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">ACTIVE PROJECTS</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.activeProjects}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card-gradient p-4 md:p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">COMPLETED TASKS</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.completedTasks}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card-gradient p-4 md:p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">AI INTERACTIONS</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.aiInteractions}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card-gradient p-4 md:p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">STORAGE USED</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.storageUsed}</p>
              <p className="text-xs text-orange-400">GB</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card-gradient p-4 md:p-6 hover:bg-white/10 transition-all duration-300 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-1">UPTIME</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.uptime}</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 w-full">

          {/* Quick Actions */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">Quick Actions</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(action.href)}
                    className={`relative p-4 md:p-6 rounded-xl bg-gradient-to-br ${action.gradient} bg-opacity-20 border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <div className="text-white mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <p className="text-white font-medium text-xs md:text-sm">{action.label}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-card p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-white">Recent Activity</h2>
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>

              <div className="space-y-3 md:space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-3 p-2 md:p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-400' : activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs md:text-sm font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 md:mt-6 py-2 md:py-3 text-xs md:text-sm text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:border-white/20"
              >
                View All Activity
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Advanced AI Operations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="glass-card p-6 w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Advanced AI Operations</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">AI BEAST MODE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Clone Studio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400 font-medium">CLONE STUDIO</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Website Replication Engine</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">22</span>
                  <span className="text-sm text-gray-400">SITES CLONED</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-400">5</span>
                  <span className="text-sm text-gray-400">ACTIVE CLONES</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">85%</span>
                  <span className="text-sm text-gray-400">SUCCESS RATE</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Clone Engine Status</span>
                  <span className="text-blue-400">59%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '59%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  LAUNCH STUDIO
                </button>
                <button className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  VIEW SITES
                </button>
              </div>
            </motion.div>

            {/* Bot Army */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-xs text-red-400 font-medium">BOT ARMY</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Autonomous AI Agents</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">9</span>
                  <span className="text-sm text-gray-400">ACTIVE BOTS</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-orange-400">332</span>
                  <span className="text-sm text-gray-400">TASKS TODAY</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">92%</span>
                  <span className="text-sm text-gray-400">EFFICIENCY</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Bot Army Activity</span>
                  <span className="text-red-400">64%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{width: '64%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  DEPLOY ARMY
                </button>
                <button className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  MANAGE BOTS
                </button>
              </div>
            </motion.div>

            {/* Market Scanner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs text-purple-400 font-medium">MARKET SCANNER</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Opportunity Detection AI</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">17</span>
                  <span className="text-sm text-gray-400">OPPORTUNITIES</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-purple-400">82</span>
                  <span className="text-sm text-gray-400">MARKETS SCANNED</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">78%</span>
                  <span className="text-sm text-gray-400">ACCURACY</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Scanning Progress</span>
                  <span className="text-purple-400">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  START SCAN
                </button>
                <button className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                  VIEW OPPORTUNITIES
                </button>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="glass-card p-6 w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Neural Network</h3>
                <p className="text-gray-400 text-sm">All systems operational • Processing at 94% efficiency</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
