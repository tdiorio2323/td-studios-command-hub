'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Mail, User, Instagram, Copy, Check, AlertCircle, ExternalLink } from 'lucide-react'

interface AffiliateInvite {
  inviteCode: string
  referralCode: string
  inviteUrl: string
  affiliate: {
    id: string
    name: string
    email: string
    instagram?: string
    status: string
    created_at: string
  }
}

export function CreateAffiliateInvite() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<AffiliateInvite | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/create-affiliate-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data)
        setFormData({ name: '', email: '', instagram: '' })
      } else {
        setError(data.error || 'Failed to create invite')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSuccess(null)
    setError('')
    setFormData({ name: '', email: '', instagram: '' })
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        <span>Invite Creator Partner</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {success ? (
                // Success State
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">Invite Created! 🎉</h2>
                  <p className="text-gray-300 mb-6">
                    {success.affiliate.name} has been invited to join TD Studios as a creator partner.
                  </p>

                  {/* Invite Details */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
                    <h3 className="text-lg font-semibold text-white mb-3">Invite Details</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Invite Code</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-white/10 px-3 py-2 rounded text-white font-mono text-sm flex-1">
                            {success.inviteCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(success.inviteCode)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Referral Code</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="bg-white/10 px-3 py-2 rounded text-white font-mono text-sm flex-1">
                            {success.referralCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(success.referralCode)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Invite Link</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <input
                            type="text"
                            value={success.inviteUrl}
                            readOnly
                            className="bg-white/10 px-3 py-2 rounded text-white text-sm flex-1 truncate"
                          />
                          <button
                            onClick={() => copyToClipboard(success.inviteUrl)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <a
                            href={success.inviteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded text-gray-400 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commission Info */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                    <h4 className="text-green-400 font-semibold mb-2">💰 Commission Structure</h4>
                    <ul className="text-green-300 text-sm space-y-1 text-left">
                      <li>• 50% commission on all referral revenue</li>
                      <li>• Recurring monthly payments</li>
                      <li>• Real-time tracking in dashboard</li>
                      <li>• Automatic payouts via Stripe</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSuccess(null)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Another
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Form State
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Invite Creator Partner</h2>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                        <User className="w-4 h-4" />
                        <span>Creator Name</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Sarah Johnson"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="sarah@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                        <Instagram className="w-4 h-4" />
                        <span>Instagram Handle (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="@sarahcreates"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Commission Preview */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">🎯 What they'll get:</h4>
                      <ul className="text-blue-300 text-sm space-y-1">
                        <li>• Personal referral code for sharing</li>
                        <li>• 50% commission on all referral revenue</li>
                        <li>• Real-time earnings dashboard</li>
                        <li>• Professional email from tyler@tdstudiosny.com</li>
                      </ul>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        {loading ? 'Creating...' : 'Generate Invite'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
