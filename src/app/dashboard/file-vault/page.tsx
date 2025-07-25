'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  File, 
  Folder, 
  Image, 
  Video, 
  Music,
  Code,
  Archive,
  Download,
  Share,
  Trash2,
  MoreHorizontal,
  Lock,
  Unlock,
  Eye,
  Star
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive'
  size?: string
  modified: string
  encrypted: boolean
  starred: boolean
  thumbnail?: string
}

export default function FileVaultPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const [files] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project Assets',
      type: 'folder',
      modified: '2 hours ago',
      encrypted: false,
      starred: true
    },
    {
      id: '2',
      name: 'TD Studios Brand Kit.zip',
      type: 'file',
      fileType: 'archive',
      size: '24.8 MB',
      modified: '1 day ago',
      encrypted: true,
      starred: false
    },
    {
      id: '3',
      name: 'ai-model-training.py',
      type: 'file',
      fileType: 'code',
      size: '156 KB',
      modified: '3 hours ago',
      encrypted: false,
      starred: true
    },
    {
      id: '4',
      name: 'Dashboard Mockup.fig',
      type: 'file',
      fileType: 'document',
      size: '2.1 MB',
      modified: '5 hours ago',
      encrypted: false,
      starred: false
    },
    {
      id: '5',
      name: 'Neural Network Demo.mp4',
      type: 'file',
      fileType: 'video',
      size: '45.2 MB',
      modified: '1 week ago',
      encrypted: true,
      starred: false
    },
    {
      id: '6',
      name: 'Logo Variations',
      type: 'folder',
      modified: '3 days ago',
      encrypted: false,
      starred: false
    }
  ])

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-400" />
    }
    
    switch (item.fileType) {
      case 'image':
        return <Image className="w-8 h-8 text-green-400" />
      case 'video':
        return <Video className="w-8 h-8 text-red-400" />
      case 'audio':
        return <Music className="w-8 h-8 text-purple-400" />
      case 'code':
        return <Code className="w-8 h-8 text-yellow-400" />
      case 'archive':
        return <Archive className="w-8 h-8 text-orange-400" />
      default:
        return <File className="w-8 h-8 text-gray-400" />
    }
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">File Vault</h1>
            <p className="text-gray-400 mt-1">Secure cloud storage with encryption</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </motion.button>
        </div>

        {/* Controls */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">2.4 GB</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Archive className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Encrypted</p>
                <p className="text-2xl font-bold text-white">346</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Shared</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Share className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="glass-card p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group ${
                    selectedItems.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleItemSelection(file.id)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      {getFileIcon(file)}
                      {file.encrypted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <Lock className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {file.starred && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center w-full">
                      <p className="text-white text-sm font-medium truncate">{file.name}</p>
                      <p className="text-gray-400 text-xs mt-1">{file.modified}</p>
                      {file.size && (
                        <p className="text-gray-500 text-xs">{file.size}</p>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer ${
                    selectedItems.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleItemSelection(file.id)}
                >
                  <div className="relative">
                    {getFileIcon(file)}
                    {file.encrypted && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                        <Lock className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      {file.starred && <Star className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <p className="text-gray-400 text-sm">{file.modified}</p>
                  </div>
                  
                  {file.size && (
                    <p className="text-gray-400 text-sm">{file.size}</p>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Items Actions */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card p-4 border border-white/20"
          >
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                {selectedItems.length} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                  <Share className="w-4 h-4" />
                </button>
                <button className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
                  <Lock className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}