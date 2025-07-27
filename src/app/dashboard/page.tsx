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
  Plus,
  Sparkles,
  Command
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
      gradient: 'from-white/20 to-chrome-silver/10'
    },
    { 
      icon: <Files className="w-6 h-6" />, 
      label: 'File Vault', 
      href: '/dashboard/file-vault',
      gradient: 'from-chrome-silver/20 to-white/10'
    },
    { 
      icon: <CheckSquare className="w-6 h-6" />, 
      label: 'Task Manager', 
      href: '/dashboard/tasks',
      gradient: 'from-white/15 to-chrome-silver/15'
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      label: 'Analytics', 
      href: '/dashboard/analytics',
      gradient: 'from-chrome-silver/20 to-white/5'
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      label: 'Workflows', 
      href: '/dashboard/workflows',
      gradient: 'from-white/20 to-chrome-silver/20'
    },
    { 
      icon: <MessageSquare className="w-6 h-6" />, 
      label: 'Messages', 
      href: '/dashboard/messages',
      gradient: 'from-chrome-silver/15 to-white/15'
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
    <div className="min-h-screen bg-luxury-gradient perspective-1000">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b border-white/10 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl glass-card chrome-pulse flex items-center justify-center transform-3d"
              >
                <Command className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-luxury chrome-text animate-chrome-shine">
                  TD Studios
                </h1>
                <p className="luxury-subtitle">Command Hub</p>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div 
              className="flex-1 max-w-2xl mx-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files, tasks, or ask AI..."
                  className="w-full pl-12 pr-4 py-3 glass-card border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all duration-300 hover:shadow-chrome"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-white/60 bg-white/10 rounded border border-white/20">⌘K</kbd>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="btn-glass-icon">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <button className="btn-glass-icon">
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleLogout}
                className="btn-chrome"
              >
                Logout
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <div className="glass-card p-8 chrome-reflection floating-3d">
            <motion.h2 
              className="text-4xl font-luxury chrome-text mb-3"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'ease-in-out' }}
            >
              Welcome back, Tyler
            </motion.h2>
            <p className="text-white/70 text-lg font-light">
              Your digital command center is ready. What would you like to accomplish today?
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-chrome-silver animate-pulse" />
              <span className="luxury-subtitle">All systems operational</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          {[
            { label: 'Active Projects', value: stats.activeProjects, icon: Activity, color: 'blue' },
            { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckSquare, color: 'green' },
            { label: 'AI Interactions', value: stats.aiInteractions, icon: Brain, color: 'purple' },
            { label: 'Storage Used', value: stats.storageUsed, icon: Database, color: 'orange' },
            { label: 'Uptime', value: stats.uptime, icon: TrendingUp, color: 'cyan' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="glass-card p-6 hover:shadow-chrome transition-all duration-500 chrome-pulse animate-float-3d group"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="luxury-subtitle text-white/60">{stat.label}</p>
                  <motion.p 
                    className="text-3xl font-bold text-white mt-1"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  className="w-14 h-14 glass-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-chrome-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-8 chrome-reflection">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-luxury text-white">Quick Actions</h3>
                <motion.button 
                  className="btn-glass-icon"
                  whileHover={{ scale: 1.1, rotateZ: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    whileHover={{ 
                      y: -8, 
                      rotateX: 5,
                      transition: { duration: 0.2 } 
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(action.href)}
                    className="group relative p-8 glass-card hover:shadow-chrome transition-all duration-500 transform-3d chrome-reflection overflow-hidden"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {action.icon}
                    </div>
                    <p className="text-white font-semibold text-lg text-left group-hover:chrome-text transition-all duration-300">
                      {action.label}
                    </p>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card p-8 animate-glass-morph">
              <h3 className="text-2xl font-luxury text-white mb-8">Recent Activity</h3>
              
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300"
                  >
                    <motion.div 
                      className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-400' :
                        activity.type === 'warning' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      } shadow-lg`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium group-hover:text-chrome-silver transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-white/50 text-sm mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8"
        >
          <div className="glass-card p-8 chrome-pulse holographic-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="w-16 h-16 bg-chrome-gradient rounded-xl flex items-center justify-center chrome-reflection"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-luxury text-white mb-1">AI Neural Network</h3>
                  <p className="text-white/60">All systems operational • Processing at 94% efficiency</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="chrome-text font-semibold">Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}