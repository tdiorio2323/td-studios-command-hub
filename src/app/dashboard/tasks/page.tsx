'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '@/hooks/useAI'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Star,
  User,
  Tag,
  MoreHorizontal,
  Brain,
  Zap
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  assignee?: string
  tags: string[]
  aiGenerated: boolean
  createdAt: string
}

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [aiInsights, setAiInsights] = useState<string>('')
  
  const { prioritizeTasks, loading: aiLoading } = useAI({
    onSuccess: (data) => {
      console.log('AI prioritization successful:', data)
      setAiInsights(data.summary || 'Tasks analyzed successfully')
    },
    onError: (error) => {
      console.error('AI prioritization failed:', error)
      setAiInsights('AI analysis temporarily unavailable')
    }
  })

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete AI model training documentation',
      description: 'Write comprehensive documentation for the new neural network model training process',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-15',
      assignee: 'Tyler DiOrio',
      tags: ['AI', 'Documentation', 'ML'],
      aiGenerated: false,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Optimize dashboard performance',
      description: 'Improve loading times and reduce bundle size for the main dashboard',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-20',
      tags: ['Performance', 'Frontend'],
      aiGenerated: true,
      createdAt: '2024-01-09'
    },
    {
      id: '3',
      title: 'Set up automated backups',
      description: 'Configure automated backup system for file vault and database',
      status: 'completed',
      priority: 'urgent',
      dueDate: '2024-01-08',
      assignee: 'Tyler DiOrio',
      tags: ['DevOps', 'Security'],
      aiGenerated: false,
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      title: 'Design new authentication flow',
      description: 'Create user-friendly authentication system with biometric support',
      status: 'pending',
      priority: 'high',
      tags: ['UX', 'Security', 'Design'],
      aiGenerated: true,
      createdAt: '2024-01-11'
    },
    {
      id: '5',
      title: 'Implement real-time notifications',
      description: 'Add WebSocket-based notifications for instant updates across the platform',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-25',
      tags: ['Backend', 'Real-time'],
      aiGenerated: false,
      createdAt: '2024-01-12'
    }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-400" />
      case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = activeFilter === 'all' || task.status === activeFilter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    aiGenerated: tasks.filter(t => t.aiGenerated).length
  }

  const handleAISuggest = async () => {
    const taskTitles = tasks
      .filter(t => t.status !== 'completed')
      .map(t => t.title)
    
    if (taskTitles.length === 0) {
      setAiInsights('No pending tasks to analyze')
      return
    }

    await prioritizeTasks(taskTitles, 'Daily productivity optimization')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Manager</h1>
            <p className="text-gray-400 mt-1">Organize and track your work with AI assistance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAISuggest}
              disabled={aiLoading}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-purple-600/30 transition-all disabled:opacity-50"
            >
              <Brain className={`w-5 h-5 ${aiLoading ? 'animate-pulse' : ''}`} />
              <span>{aiLoading ? 'Analyzing...' : 'AI Suggest'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewTaskForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{taskStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{taskStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">{taskStats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{taskStats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Generated</p>
                <p className="text-2xl font-bold text-white">{taskStats.aiGenerated}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            {/* Search & Filters */}
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex bg-white/5 rounded-lg p-1">
                {['all', 'pending', 'in-progress', 'completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors capitalize ${
                      activeFilter === filter
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer ${
                    selectedTasks.includes(task.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                          {task.aiGenerated && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                              <Brain className="w-3 h-3 text-purple-300" />
                              <span className="text-xs text-purple-300 font-medium">AI</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-4">{task.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          {task.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due {task.dueDate}</span>
                            </div>
                          )}
                          
                          {task.assignee && (
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{task.assignee}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Productivity Insights */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Productivity Insights</h3>
                <p className="text-gray-400 text-sm">Personalized recommendations to boost your efficiency</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">AI Task Analysis</p>
                  <p className="text-gray-400 text-sm">{aiInsights || 'Click "AI Suggest" for intelligent prioritization'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Task Completion Rate</p>
                  <p className="text-gray-400 text-sm">{Math.round((taskStats.completed / taskStats.total) * 100)}% completion rate ({taskStats.completed}/{taskStats.total})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}