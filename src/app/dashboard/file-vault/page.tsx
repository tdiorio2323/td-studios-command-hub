'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  File,
  Image,
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Folder,
  Edit,
  Check,
  X
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export default function FileVaultPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)

    try {
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          setFiles(prev => [result.data, ...prev])
        } else {
          console.error('Upload failed:', result.error)
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
    }

    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (fileId: string) => {
    // TODO: Implement delete API
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const startRename = (file: FileItem) => {
    setEditingFile(file.id)
    setEditingName(file.name)
  }

  const saveRename = async (fileId: string) => {
    if (!editingName.trim()) return

    try {
      const response = await fetch(`/api/files/rename/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: editingName })
      })

      const result = await response.json()

      if (result.success) {
        // Update the file name in state
        setFiles(prev => prev.map(file =>
          file.id === fileId
            ? { ...file, name: editingName.trim() }
            : file
        ))

        setEditingFile(null)
        setEditingName('')
      } else {
        console.error('Rename failed:', result.error)
        alert('Failed to rename file: ' + result.error)
      }
    } catch (error) {
      console.error('Rename error:', error)
      alert('Failed to rename file. Please try again.')
    }
  }

  const cancelRename = () => {
    setEditingFile(null)
    setEditingName('')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-400" />
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />
    return <File className="w-8 h-8 text-gray-400" />
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
            <p className="text-gray-400 mt-1">Secure file storage and management</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>{isUploading ? 'Uploading...' : 'Upload Files'}</span>
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
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
                  placeholder="Search files..."
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

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Files</p>
                <p className="text-2xl font-bold text-white">{files.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Images</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.type.startsWith('image/')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Documents</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.type.includes('pdf') || f.type.includes('document')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="glass-card p-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No files uploaded yet</h3>
              <p className="text-gray-400 mb-6">Upload your first file to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold flex items-center space-x-2 hover:from-blue-700 hover:to-green-700 transition-all mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Files</span>
              </motion.button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="text-center w-full">
                      {editingFile === file.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveRename(file.id)
                              if (e.key === 'Escape') cancelRename()
                            }}
                            className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <div className="flex justify-center space-x-1">
                            <button
                              onClick={() => saveRename(file.id)}
                              className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={cancelRename}
                              className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-white text-sm font-medium truncate">{file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startRename(file)}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-yellow-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      {editingFile === file.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveRename(file.id)
                              if (e.key === 'Escape') cancelRename()
                            }}
                            className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => saveRename(file.id)}
                            className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-white font-medium">{file.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startRename(file)}
                      className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
