'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Folder,
  File,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Share,
  Edit,
  Trash2,
  Star,
  Grid3X3,
  List,
  Upload,
  FolderOpen,
  Clock,
  User
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface WorkspaceItem {
  id: string
  name: string
  type: 'folder' | 'file'
  size?: string
  modified: string
  owner: string
  starred: boolean
  shared: boolean
}

export default function WorkspacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Sample workspace data - replace with real data from your backend
  const [workspaceItems] = useState<WorkspaceItem[]>([
    {
      id: '1',
      name: 'TD Studios Brand Assets',
      type: 'folder',
      modified: '2 hours ago',
      owner: 'Tyler DiOrio',
      starred: true,
      shared: false
    },
    {
      id: '2',
      name: 'Project Documentation',
      type: 'folder',
      modified: '1 day ago',
      owner: 'Tyler DiOrio',
      starred: false,
      shared: true
    },
    {
      id: '3',
      name: 'Command Hub Designs.fig',
      type: 'file',
      size: '2.4 MB',
      modified: '3 hours ago',
      owner: 'Tyler DiOrio',
      starred: true,
      shared: false
    },
    {
      id: '4',
      name: 'AI Integration Guide.pdf',
      type: 'file',
      size: '1.2 MB',
      modified: '5 hours ago',
      owner: 'Tyler DiOrio',
      starred: false,
      shared: true
    },
    {
      id: '5',
      name: 'Client Presentations',
      type: 'folder',
      modified: '2 days ago',
      owner: 'Tyler DiOrio',
      starred: false,
      shared: false
    },
    {
      id: '6',
      name: 'Meeting Notes.md',
      type: 'file',
      size: '45 KB',
      modified: '1 day ago',
      owner: 'Tyler DiOrio',
      starred: false,
      shared: false
    }
  ])

  const filteredItems = workspaceItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleStar = async (itemId: string) => {
    // TODO: Implement API call to toggle starred status
    console.log('Toggle star for item:', itemId)
  }

  const shareItem = async (itemId: string) => {
    // TODO: Implement sharing functionality
    console.log('Share item:', itemId)
  }

  const deleteItem = async (itemId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', itemId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Workspace</h1>
            <p className="text-gray-400 mt-1">Organize and manage your files and projects</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 glass-button text-gray-300 font-semibold flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Folder</span>
            </motion.button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files and folders..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Folders</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Shared</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Share className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">2.4 GB</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* File/Folder Grid */}
        <div className="glass-card p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      {item.type === 'folder' ? (
                        <FolderOpen className="w-8 h-8 text-blue-400" />
                      ) : (
                        <File className="w-8 h-8 text-gray-400" />
                      )}
                      {item.starred && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" fill="currentColor" />
                        </div>
                      )}
                      {item.shared && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Share className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-center space-x-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{item.modified}</span>
                      </div>
                      {item.size && (
                        <p className="text-gray-500 text-xs">{item.size}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Show context menu
                      }}
                      className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {item.type === 'folder' ? (
                        <FolderOpen className="w-6 h-6 text-blue-400" />
                      ) : (
                        <File className="w-6 h-6 text-gray-400" />
                      )}
                      {item.starred && (
                        <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" fill="currentColor" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Modified {item.modified}</span>
                        <span>by {item.owner}</span>
                        {item.size && <span>{item.size}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.shared && (
                      <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
                        Shared
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(item.id)
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star className="w-4 h-4" fill={item.starred ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Show context menu
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
