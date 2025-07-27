'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  MessageSquare, 
  Database, 
  Zap,
  Send,
  Plus,
  Settings,
  Download,
  Upload,
  Play,
  Pause,
  Activity,
  Cpu,
  BarChart3,
  Clock,
  User,
  Bot,
  Sparkles,
  Code,
  FileText,
  Image,
  Video
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  model?: string
}

interface AIModel {
  id: string
  name: string
  type: string
  status: 'training' | 'deployed' | 'inactive'
  accuracy: number
  lastTrained: string
}

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'training' | 'automation'>('chat')
  const [selectedModel, setSelectedModel] = useState<'claude' | 'gpt' | 'compare'>('claude')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 300000),
      model: 'Claude-3.5-Sonnet'
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [models] = useState<AIModel[]>([
    {
      id: '1',
      name: 'TD Custom GPT',
      type: 'Language Model',
      status: 'deployed',
      accuracy: 94.2,
      lastTrained: '2 hours ago'
    },
    {
      id: '2',
      name: 'Image Classifier',
      type: 'Vision Model',
      status: 'training',
      accuracy: 87.5,
      lastTrained: '1 day ago'
    },
    {
      id: '3',
      name: 'Code Assistant',
      type: 'Code Model',
      status: 'deployed',
      accuracy: 91.8,
      lastTrained: '3 days ago'
    }
  ])

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      role: 'user',
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      // Get all messages for context
      const allMessages = [...chatMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages,
          model: 'claude',
          modelVariant: 'claude-3-5-sonnet-20241022'
        })
      })

      const data = await response.json()

      if (data.success) {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.data.message,
          role: 'assistant',
          timestamp: new Date(),
          model: 'Claude-3.5-Sonnet'
        }
        setChatMessages(prev => [...prev, aiResponse])
      } else {
        // Handle error
        const errorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Sorry, I encountered an error: ${data.error}. Please try again.`,
          role: 'assistant',
          timestamp: new Date(),
          model: 'Error'
        }
        setChatMessages(prev => [...prev, errorResponse])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting to the AI service. Please check your connection and try again.',
        role: 'assistant',
        timestamp: new Date(),
        model: 'Error'
      }
      setChatMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'training': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'inactive': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Studio</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Advanced AI development and interaction platform</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-700/70 transition-all"
            >
              <Settings className="w-5 h-5" />
              <span>Model Settings</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Models</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">API Calls</p>
                <p className="text-2xl font-bold text-white">12.4K</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Accuracy</p>
                <p className="text-2xl font-bold text-white">91.2%</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Training Hours</p>
                <p className="text-2xl font-bold text-white">146h</p>
              </div>
              <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-6">
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {[
              { id: 'chat', label: 'Chat Interface', icon: MessageSquare },
              { id: 'training', label: 'Model Training', icon: Database },
              { id: 'automation', label: 'Automation', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Chat Interface */}
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">AI Chat</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-400">Claude-3.5-Sonnet</span>
                    <select 
                      onChange={(e) => {
                        // Model switching functionality
                        console.log('Model switched to:', e.target.value)
                      }}
                      className="ml-2 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="claude">Claude</option>
                      <option value="gpt">GPT-4</option>
                      <option value="compare">Compare Both</option>
                    </select>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 mb-6 pr-2">
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-gray-600' 
                            : 'bg-gray-700'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gray-700/50 border border-gray-600'
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          <p className="text-white">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                            {message.model && ` • ${message.model}`}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-600"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Chat Tools */}
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Code, label: 'Code Generation', color: 'blue' },
                      { icon: FileText, label: 'Document Analysis', color: 'green' },
                      { icon: Image, label: 'Image Description', color: 'purple' },
                      { icon: Video, label: 'Video Summary', color: 'orange' }
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="w-full flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <action.icon className="w-5 h-5 text-gray-300" />
                        <span className="text-white">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Model Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Response Time</span>
                        <span className="text-white">1.2s</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'training' && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Model Management */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Model Management</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Train New Model</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {models.map((model) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getModelStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{model.type}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Accuracy</span>
                            <span className="text-white">{model.accuracy}%</span>
                          </div>
                          <div className="bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full" 
                              style={{ width: `${model.accuracy}%` }} 
                            />
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-400">Last trained: {model.lastTrained}</p>
                        
                        <div className="flex space-x-2 pt-3">
                          <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            <Play className="w-4 h-4 mx-auto" />
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            <Download className="w-4 h-4 mx-auto" />
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            <Settings className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Training Progress */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-6">Current Training Session</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Image Classifier v2.0</span>
                      <span className="text-blue-400 font-semibold">Training...</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">67%</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-3 relative overflow-hidden">
                        <motion.div 
                          className="bg-gray-600 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '67%' }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Epoch</p>
                        <p className="text-white font-semibold">156/234</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Loss</p>
                        <p className="text-white font-semibold">0.0234</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Learning Rate</p>
                        <p className="text-white font-semibold">0.001</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ETA</p>
                        <p className="text-white font-semibold">2h 34m</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">System Resources</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">GPU Usage</span>
                          <span className="text-white">89%</span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{ width: '89%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Memory</span>
                          <span className="text-white">67%</span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{ width: '67%' }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">CPU</span>
                          <span className="text-white">34%</span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{ width: '34%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'automation' && (
            <motion.div
              key="automation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Automation Dashboard */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">AI Automations</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Workflow</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Content Generator',
                      description: 'Automatically generate blog posts and social media content',
                      status: 'active',
                      runs: 247,
                      lastRun: '2 hours ago'
                    },
                    {
                      name: 'Image Processor',
                      description: 'Automatically optimize and tag uploaded images',
                      status: 'active',
                      runs: 1456,
                      lastRun: '15 minutes ago'
                    },
                    {
                      name: 'Email Responder',
                      description: 'AI-powered email responses for customer inquiries',
                      status: 'paused',
                      runs: 89,
                      lastRun: '1 day ago'
                    }
                  ].map((automation, index) => (
                    <motion.div
                      key={automation.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{automation.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${
                          automation.status === 'active' ? 'bg-gray-300 animate-pulse' : 'bg-gray-500'
                        }`} />
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{automation.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Runs</span>
                          <span className="text-white">{automation.runs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Run</span>
                          <span className="text-white">{automation.lastRun}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          {automation.status === 'active' ? <Pause className="w-4 h-4 mx-auto" /> : <Play className="w-4 h-4 mx-auto" />}
                        </button>
                        <button className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                          <Settings className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Workflow Builder Preview */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-6">Workflow Builder</h3>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Visual Workflow Designer</h4>
                  <p className="text-gray-400 mb-6">
                    Drag and drop interface for creating complex AI-powered automations
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600"
                  >
                    Launch Builder
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}