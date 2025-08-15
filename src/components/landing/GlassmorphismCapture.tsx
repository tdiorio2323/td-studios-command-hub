'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Brain, Zap } from "lucide-react"

const GlassmorphismCapture = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        console.log("Email submitted:", email)
        // Redirect to login after successful email capture
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Email capture error:', error)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden flex flex-col justify-center items-center p-4 relative">
      
      {/* Animated background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 30%, #2a2a3a 60%, #1a1a1a 90%, #000000 100%)'
        }}
      />
      
      {/* Matrix background effect */}
      <div className="matrix-bg absolute inset-0 z-1"></div>

      {/* Animated background shapes */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl z-1"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl z-1"
      />

      {/* Main Content */}
      <div className="relative z-10 w-[390px] h-[700px] max-w-[95vw] mx-auto">
        
        {/* Glass Morphism Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="h-full relative backdrop-blur-[20px] bg-white/10 border border-white/20 rounded-3xl shadow-2xl shadow-black/50 p-8 flex flex-col"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 25px 45px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-6 pb-8 flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-2xl glass-card chrome-pulse flex items-center justify-center mb-4"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold chrome-text mb-2">TD Studios</h1>
            <p className="text-gray-300 text-sm text-center">AI-Powered Command Hub</p>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Main CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center px-2 pb-8"
          >
            <div className="w-full max-w-[320px] rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/20 p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-white">Join the Future</h2>
              </div>
              <p className="text-gray-300 text-center text-sm mb-4">
                Access cutting-edge AI tools, automation workflows, and premium features designed for modern creators and businesses.
              </p>
              
              {/* Email Capture Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent backdrop-blur-sm"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-3 rounded-xl shadow-lg border border-white/20 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Early Access
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-xl" />
                </Button>
              </form>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                Already have access? <a href="/login" className="text-blue-400 hover:text-blue-300">Sign in here</a>
              </p>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center space-x-6 pb-6"
          >
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-gray-300">AI Studio</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xs text-gray-300">Automation</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-gray-300">Analytics</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}

export default GlassmorphismCapture