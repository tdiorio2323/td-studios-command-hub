'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  FileText, 
  Image, 
  Layout,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Bookmark,
  Share,
  Copy,
  Settings,
  Code,
  Palette,
  Save,
  Upload
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface ContentItem {
  id: string
  title: string
  type: 'page' | 'post' | 'template' | 'media'
  status: 'published' | 'draft' | 'pending' | 'archived'
  author: string
  created: string
  modified: string
  views?: number
  tags: string[]
  featured?: boolean
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'pages' | 'templates' | 'media'>('content')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'pending'>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const [content] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Getting Started with AI Development',
      type: 'post',
      status: 'published',
      author: 'Tyler DiOrio',
      created: '2024-01-10',
      modified: '2024-01-12',
      views: 1247,
      tags: ['AI', 'Development', 'Tutorial'],
      featured: true
    },
    {
      id: '2',
      title: 'TD Studios Brand Guidelines',
      type: 'page',
      status: 'published',
      author: 'Tyler DiOrio',
      created: '2024-01-08',
      modified: '2024-01-10',
      views: 456,
      tags: ['Brand', 'Guidelines', 'Design']
    },
    {
      id: '3',
      title: 'Modern Dashboard Template',
      type: 'template',
      status: 'draft',
      author: 'Tyler DiOrio',
      created: '2024-01-15',
      modified: '2024-01-15',
      tags: ['Template', 'Dashboard', 'UI']
    },
    {
      id: '4',
      title: 'Neural Network Architecture Deep Dive',
      type: 'post',
      status: 'pending',
      author: 'Tyler DiOrio',
      created: '2024-01-14',
      modified: '2024-01-16',
      tags: ['AI', 'Neural Networks', 'Architecture']
    },
    {
      id: '5',
      title: 'Hero Image Collection',
      type: 'media',
      status: 'published',
      author: 'Tyler DiOrio',
      created: '2024-01-09',
      modified: '2024-01-09',
      tags: ['Images', 'Hero', 'Collection']
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'draft': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'pending': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'archived': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <Globe className="w-5 h-5 text-blue-400" />
      case 'post': return <FileText className="w-5 h-5 text-green-400" />
      case 'template': return <Layout className="w-5 h-5 text-purple-400" />
      case 'media': return <Image className="w-5 h-5 text-orange-400" />
      default: return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = statusFilter === 'all' || item.status === statusFilter
    const matchesTab = activeTab === 'content' || 
                      (activeTab === 'pages' && item.type === 'page') ||
                      (activeTab === 'templates' && item.type === 'template') ||
                      (activeTab === 'media' && item.type === 'media')
    return matchesSearch && matchesFilter && matchesTab
  })

  const contentStats = {
    total: content.length,
    published: content.filter(i => i.status === 'published').length,
    drafts: content.filter(i => i.status === 'draft').length,
    pending: content.filter(i => i.status === 'pending').length,
    totalViews: content.reduce((acc, item) => acc + (item.views || 0), 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Content Management</h1>
            <p className="text-gray-400 mt-1">Create, manage, and publish your content</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-purple-600/30 transition-all"
            >
              <Settings className="w-5 h-5" />
              <span>CMS Settings</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Content</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Content</p>
                <p className="text-2xl font-bold text-white">{contentStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">{contentStats.published}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-white">{contentStats.drafts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{contentStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{contentStats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-6">
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
            {[
              { id: 'content', label: 'All Content', icon: FileText },
              { id: 'pages', label: 'Pages', icon: Globe },
              { id: 'templates', label: 'Templates', icon: Layout },
              { id: 'media', label: 'Media', icon: Image }
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
            {/* Search & Filters */}
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex bg-white/5 rounded-lg p-1">
                {['all', 'published', 'draft', 'pending'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter as any)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors capitalize ${
                      statusFilter === filter
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* View Options */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getTypeIcon(item.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                          {item.featured && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                              <Bookmark className="w-3 h-3 text-yellow-300" />
                              <span className="text-xs text-yellow-300 font-medium">Featured</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{item.author}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created {item.created}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Edit className="w-4 h-4" />
                            <span>Modified {item.modified}</span>
                          </div>
                          
                          {item.views && (
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{item.views} views</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-orange-400 transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No content found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Content</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Template Editor</h3>
                <p className="text-gray-400 text-sm">Create and customize page templates</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Open Editor
            </motion.button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Theme Customizer</h3>
                <p className="text-gray-400 text-sm">Customize site appearance and styling</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              Customize
            </motion.button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Media Library</h3>
                <p className="text-gray-400 text-sm">Manage images, videos, and documents</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Browse Media
            </motion.button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}