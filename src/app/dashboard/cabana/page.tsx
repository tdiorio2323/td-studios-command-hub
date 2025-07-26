'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Users, 
  Send, 
  Download, 
  Filter, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  name: string
  subscribed: Date
  status: 'active' | 'unsubscribed' | 'bounced'
  tags: string[]
}

export default function CabanaMailingListPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      email: 'user1@example.com',
      name: 'John Doe',
      subscribed: new Date('2024-01-15'),
      status: 'active',
      tags: ['Premium', 'Early Adopter']
    },
    {
      id: '2',
      email: 'user2@example.com', 
      name: 'Jane Smith',
      subscribed: new Date('2024-02-20'),
      status: 'active',
      tags: ['Newsletter']
    },
    {
      id: '3',
      email: 'user3@example.com',
      name: 'Bob Johnson', 
      subscribed: new Date('2024-03-10'),
      status: 'unsubscribed',
      tags: ['Trial']
    }
  ])

  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    bounced: subscribers.filter(s => s.status === 'bounced').length
  }

  const handleAddSubscriber = () => {
    if (newEmail && newName) {
      const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        email: newEmail,
        name: newName,
        subscribed: new Date(),
        status: 'active',
        tags: ['New']
      }
      setSubscribers([...subscribers, newSubscriber])
      setNewEmail('')
      setNewName('')
      setShowAddForm(false)
    }
  }

  const handleRemoveSubscriber = (id: string) => {
    setSubscribers(subscribers.filter(s => s.id !== id))
  }

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Cabana Mailing List
              </h1>
              <p className="text-gray-400">
                Manage your subscriber base and email campaigns
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subscriber</span>
              </button>
              
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Subscribers</p>
                <p className="text-2xl font-bold text-white">{stats.totalSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-white">{stats.activeSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unsubscribed</p>
                <p className="text-2xl font-bold text-white">{stats.unsubscribed}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bounced</p>
                <p className="text-2xl font-bold text-white">{stats.bounced}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Subscriber Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Subscriber</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleAddSubscriber}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Add Subscriber
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscribers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white">Subscribers</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subscriber
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredSubscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{subscriber.name}</div>
                          <div className="text-sm text-gray-400">{subscriber.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscriber.status === 'unsubscribed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {subscriber.subscribed.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {subscriber.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRemoveSubscriber(subscriber.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}