'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Terminal, 
  Key, 
  Shield, 
  GitBranch,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  Lock,
  Unlock,
  Code,
  Server,
  Database,
  Cloud,
  Folder,
  AlertTriangle,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface EnvironmentVariable {
  id: string
  key: string
  value: string
  environment: 'development' | 'staging' | 'production' | 'all'
  category: 'api' | 'database' | 'auth' | 'service' | 'config'
  encrypted: boolean
  lastModified: string
  description?: string
}

interface APIKey {
  id: string
  name: string
  key: string
  service: string
  permissions: string[]
  expiresAt?: string
  lastUsed: string
  active: boolean
  environment: string
}

interface Credential {
  id: string
  name: string
  username: string
  password: string
  url?: string
  category: 'database' | 'service' | 'ssh' | 'ftp' | 'email' | 'other'
  notes?: string
  encrypted: boolean
  lastModified: string
}

interface Repository {
  id: string
  name: string
  url: string
  branch: string
  status: 'connected' | 'syncing' | 'error' | 'disconnected'
  lastSync: string
  type: 'git' | 'svn' | 'mercurial'
  private: boolean
}

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<'env' | 'keys' | 'credentials' | 'repos'>('env')
  const [searchQuery, setSearchQuery] = useState('')
  const [showValues, setShowValues] = useState<{[key: string]: boolean}>({})

  const [envVars] = useState<EnvironmentVariable[]>([
    {
      id: '1',
      key: 'DATABASE_URL',
      value: 'postgresql://user:pass@localhost:5432/db',
      environment: 'development',
      category: 'database',
      encrypted: true,
      lastModified: '2024-01-15',
      description: 'Primary database connection string'
    },
    {
      id: '2',
      key: 'API_SECRET_KEY',
      value: 'sk_live_51H...',
      environment: 'production',
      category: 'api',
      encrypted: true,
      lastModified: '2024-01-14'
    },
    {
      id: '3',
      key: 'NEXTAUTH_SECRET',
      value: 'your-secret-here',
      environment: 'all',
      category: 'auth',
      encrypted: true,
      lastModified: '2024-01-12'
    },
    {
      id: '4',
      key: 'NODE_ENV',
      value: 'development',
      environment: 'development',
      category: 'config',
      encrypted: false,
      lastModified: '2024-01-10'
    }
  ])

  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'OpenAI API Key',
      key: 'sk-proj-...',
      service: 'OpenAI',
      permissions: ['read', 'write'],
      expiresAt: '2024-12-31',
      lastUsed: '2 hours ago',
      active: true,
      environment: 'production'
    },
    {
      id: '2',
      name: 'Stripe API Key',
      key: 'sk_live_...',
      service: 'Stripe',
      permissions: ['read', 'write', 'delete'],
      lastUsed: '1 day ago',
      active: true,
      environment: 'production'
    },
    {
      id: '3',
      name: 'GitHub Token',
      key: 'ghp_...',
      service: 'GitHub',
      permissions: ['repo', 'user'],
      expiresAt: '2024-06-15',
      lastUsed: '3 hours ago',
      active: true,
      environment: 'development'
    }
  ])

  const [credentials] = useState<Credential[]>([
    {
      id: '1',
      name: 'Production Database',
      username: 'admin',
      password: 'secure_password_123',
      url: 'db.example.com:5432',
      category: 'database',
      notes: 'Primary production database credentials',
      encrypted: true,
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      name: 'AWS Console',
      username: 'tyler@tdstudios.com',
      password: 'aws_password_456',
      url: 'console.aws.amazon.com',
      category: 'service',
      encrypted: true,
      lastModified: '2024-01-12'
    },
    {
      id: '3',
      name: 'Server SSH',
      username: 'root',
      password: 'ssh_key_789',
      url: '192.168.1.100',
      category: 'ssh',
      notes: 'Main application server',
      encrypted: true,
      lastModified: '2024-01-10'
    }
  ])

  const [repositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'td-studios',
      url: 'https://github.com/tylerdiorio/td-studios.git',
      branch: 'main',
      status: 'connected',
      lastSync: '5 minutes ago',
      type: 'git',
      private: true
    },
    {
      id: '2',
      name: 'ai-models',
      url: 'https://github.com/tylerdiorio/ai-models.git',
      branch: 'develop',
      status: 'syncing',
      lastSync: '2 hours ago',
      type: 'git',
      private: true
    },
    {
      id: '3',
      name: 'client-project',
      url: 'https://github.com/company/client-project.git',
      branch: 'feature/new-ui',
      status: 'error',
      lastSync: '1 day ago',
      type: 'git',
      private: false
    }
  ])

  const toggleValueVisibility = (id: string) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'staging': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'development': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'all': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'text-purple-400'
      case 'database': return 'text-blue-400'
      case 'auth': return 'text-green-400'
      case 'service': return 'text-orange-400'
      case 'config': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20'
      case 'syncing': return 'text-blue-400 bg-blue-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      case 'disconnected': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const workspaceStats = {
    envVars: envVars.length,
    apiKeys: apiKeys.length,
    credentials: credentials.length,
    repositories: repositories.length,
    activeKeys: apiKeys.filter(k => k.active).length,
    connectedRepos: repositories.filter(r => r.status === 'connected').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Workspace</h1>
            <p className="text-gray-400 mt-1">Manage environment variables, API keys, and credentials</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-purple-600/30 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add New</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Environment Variables</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.envVars}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">API Keys</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.apiKeys}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Credentials</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.credentials}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Repositories</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.repositories}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Keys</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.activeKeys}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Connected</p>
                <p className="text-2xl font-bold text-white">{workspaceStats.connectedRepos}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-6">
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {[
              { id: 'env', label: 'Environment Variables', icon: Terminal },
              { id: 'keys', label: 'API Keys', icon: Key },
              { id: 'credentials', label: 'Credentials', icon: Shield },
              { id: 'repos', label: 'Repositories', icon: GitBranch }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workspace items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'env' && (
            <motion.div
              key="env"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6"
            >
              <div className="space-y-4">
                {envVars.map((envVar) => (
                  <motion.div
                    key={envVar.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">{envVar.key}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEnvironmentColor(envVar.environment)}`}>
                            {envVar.environment}
                          </span>
                          <div className={`w-4 h-4 ${getCategoryColor(envVar.category)}`}>
                            {envVar.category === 'database' && <Database className="w-4 h-4" />}
                            {envVar.category === 'api' && <Code className="w-4 h-4" />}
                            {envVar.category === 'auth' && <Shield className="w-4 h-4" />}
                            {envVar.category === 'service' && <Server className="w-4 h-4" />}
                            {envVar.category === 'config' && <Settings className="w-4 h-4" />}
                          </div>
                          {envVar.encrypted && (
                            <Lock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="bg-gray-800/50 px-3 py-1 rounded text-sm font-mono text-gray-300 flex-1">
                            {showValues[envVar.id] ? envVar.value : '••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => toggleValueVisibility(envVar.id)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            {showValues[envVar.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {envVar.description && (
                          <p className="text-gray-400 text-sm">{envVar.description}</p>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">Last modified: {envVar.lastModified}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'keys' && (
            <motion.div
              key="keys"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6"
            >
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <motion.div
                    key={apiKey.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">{apiKey.name}</h4>
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                            {apiKey.service}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${apiKey.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="bg-gray-800/50 px-3 py-1 rounded text-sm font-mono text-gray-300">
                            {showValues[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                          </code>
                          <button
                            onClick={() => toggleValueVisibility(apiKey.id)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            {showValues[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <span>Permissions: {apiKey.permissions.join(', ')}</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                          {apiKey.expiresAt && (
                            <span>Expires: {apiKey.expiresAt}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6"
            >
              <div className="space-y-4">
                {credentials.map((credential) => (
                  <motion.div
                    key={credential.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">{credential.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(credential.category)} bg-current bg-opacity-20`}>
                            {credential.category}
                          </span>
                          {credential.encrypted && (
                            <Lock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400 text-sm w-20">Username:</span>
                            <span className="text-white">{credential.username}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400 text-sm w-20">Password:</span>
                            <code className="bg-gray-800/50 px-2 py-1 rounded text-sm font-mono text-gray-300">
                              {showValues[credential.id] ? credential.password : '••••••••••••'}
                            </code>
                            <button
                              onClick={() => toggleValueVisibility(credential.id)}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              {showValues[credential.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          {credential.url && (
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-400 text-sm w-20">URL:</span>
                              <span className="text-blue-400">{credential.url}</span>
                            </div>
                          )}
                        </div>
                        
                        {credential.notes && (
                          <p className="text-gray-400 text-sm mb-2">{credential.notes}</p>
                        )}
                        
                        <p className="text-xs text-gray-500">Last modified: {credential.lastModified}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'repos' && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6"
            >
              <div className="space-y-4">
                {repositories.map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <GitBranch className="w-5 h-5 text-orange-400" />
                          <h4 className="text-white font-semibold">{repo.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(repo.status)}`}>
                            {repo.status}
                          </span>
                          {repo.private && (
                            <Lock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        
                        <div className="space-y-1 mb-2 text-sm">
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span>URL: <span className="text-blue-400">{repo.url}</span></span>
                            <span>Branch: <span className="text-green-400">{repo.branch}</span></span>
                            <span>Type: <span className="text-purple-400">{repo.type}</span></span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500">Last sync: {repo.lastSync}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {repo.status === 'error' && (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}