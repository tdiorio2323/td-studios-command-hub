'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { CreateAffiliateInvite } from '@/components/admin/CreateAffiliateInvite'
import { motion } from 'framer-motion'
import { Users, DollarSign, TrendingUp, UserCheck, Loader2, AlertCircle } from 'lucide-react'

interface Affiliate {
  id: string
  name: string
  email: string
  instagram?: string
  invite_code: string
  referral_code: string
  status: 'pending' | 'accepted' | 'revoked'
  created_at: string
  total_referrals: number
  total_revenue: number
  total_commission: number
  active_referrals: number
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAffiliates()
  }, [])

  const fetchAffiliates = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/create-affiliate-invite') // Using the GET endpoint of this route
      const data = await response.json()

      if (response.ok) {
        setAffiliates(data.affiliates)
      } else {
        setError(data.error || 'Failed to fetch affiliates')
      }
    } catch (err) {
      console.error('Error fetching affiliates:', err)
      setError('Network error or failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  const totalPartners = affiliates.length
  const totalRevenue = affiliates.reduce((sum, a) => sum + a.total_revenue, 0)
  const totalCommission = affiliates.reduce((sum, a) => sum + a.total_commission, 0)
  const activePartners = affiliates.filter(a => a.status === 'accepted').length

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div>
              <motion.h1
                className="text-4xl font-luxury chrome-text mb-1"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                Affiliate Partners
              </motion.h1>
              <p className="text-gray-400 text-lg">Manage your creator network and track commissions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CreateAffiliateInvite />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="glass-card p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Partners</p>
              <h3 className="text-2xl font-bold text-white">{totalPartners}</h3>
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-green-500/20 rounded-full">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue Generated</p>
              <h3 className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-3 bg-purple-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Commission Paid</p>
              <h3 className="text-2xl font-bold text-white">${totalCommission.toFixed(2)}</h3>
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-6 flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <UserCheck className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Partners</p>
              <h3 className="text-2xl font-bold text-white">{activePartners}</h3>
            </div>
          </motion.div>
        </div>

        {/* Affiliate List */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">All Affiliate Partners</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <p className="text-gray-400 ml-3">Loading affiliates...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          ) : affiliates.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No affiliate partners found. Invite your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Referral Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Total Referrals</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Total Revenue</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Total Commission</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {affiliates.map((affiliate) => (
                    <motion.tr
                      key={affiliate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/5"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-white">{affiliate.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">{affiliate.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-blue-300 font-mono">{affiliate.referral_code}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          affiliate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          affiliate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {affiliate.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300">{affiliate.total_referrals}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-green-400">${affiliate.total_revenue.toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-purple-400">${affiliate.total_commission.toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400">{new Date(affiliate.created_at).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
