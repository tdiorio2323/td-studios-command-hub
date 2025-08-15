'use client'

import { logger } from '@/lib/logger';

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PRICING_PLANS } from '@/lib/stripe'
import { getStripeJs } from '@/lib/stripe'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async (planType: keyof typeof PRICING_PLANS) => {
    setLoading(planType)
    
    try {
      const plan = PRICING_PLANS[planType]
      
      // Get user email (you'll need to implement auth)
      const userEmail = 'user@example.com' // Replace with actual user email
      
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType,
          userEmail,
        }),
      })

      const { sessionId, url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        // Fallback to Stripe.js
        const stripe = await getStripeJs()
        const { error } = await stripe!.redirectToCheckout({ sessionId })
        
        if (error) {
          logger.error('Stripe checkout error:', error)
          alert('Checkout failed. Please try again.')
        }
      }
    } catch (error) {
      logger.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const planIcons = {
    starter: <Zap className="w-8 h-8" />,
    professional: <Star className="w-8 h-8" />,
    enterprise: <Crown className="w-8 h-8" />,
    custom: <Sparkles className="w-8 h-8" />,
  }

  const planColors = {
    starter: 'from-blue-500 to-cyan-500',
    professional: 'from-purple-500 to-pink-500',
    enterprise: 'from-amber-500 to-orange-500',
    custom: 'from-rose-500 to-red-500',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your AI Power Level
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI with our comprehensive business platform. 
            Start with a 7-day free trial on any plan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {Object.entries(PRICING_PLANS).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${planColors[key as keyof typeof planColors]} opacity-10 blur-3xl`} />
              
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 h-full flex flex-col hover:border-gray-700 transition-all">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${planColors[key as keyof typeof planColors]} mb-6 self-start`}>
                  {planIcons[key as keyof typeof planIcons]}
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                  {key === 'starter' && (
                    <p className="text-sm text-green-400 mt-1">7-day free trial</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(key as keyof typeof PRICING_PLANS)}
                  disabled={loading !== null}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    loading === key
                      ? 'bg-gray-700 cursor-wait'
                      : `bg-gradient-to-r ${planColors[key as keyof typeof planColors]} hover:opacity-90`
                  }`}
                >
                  {loading === key ? 'Processing...' : 'Start Free Trial'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400">
            All plans include SSL security, 99.9% uptime SLA, and 24/7 support
          </p>
          <p className="text-gray-500 mt-2">
            No credit card required for trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  )
}