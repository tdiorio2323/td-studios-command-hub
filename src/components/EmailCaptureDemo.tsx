'use client'

import React from 'react'
import EmailCaptureCard from './EmailCaptureCard'

export default function EmailCaptureDemo() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }

      // Handle successful login
      console.log('Login successful:', data.user)
      // You can redirect or update state here
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const handleSignup = async (email: string, name?: string) => {
    try {
      const response = await fetch('/api/mailing-list/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          name,
          source: 'tdstudiosdigital.com'
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Signup failed')
      }

      console.log('Signup successful:', data.data)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const handleCreateLinkPage = async () => {
    try {
      // Show a simple prompt for email if not already provided
      const email = prompt('Enter your email to request a creator link page:')
      const name = prompt('Enter your name (optional):')
      
      if (!email) return

      const response = await fetch('/api/creator-links/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          name,
          requestedUsername: email.split('@')[0] // suggest username based on email
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Request failed')
      }

      alert('Creator link page request submitted successfully! We\'ll be in touch soon.')
      console.log('Creator request successful:', data.data)
    } catch (error) {
      console.error('Creator request error:', error)
      alert('Failed to submit request. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <EmailCaptureCard
        onLogin={handleLogin}
        onSignup={handleSignup}
        onCreateLinkPage={handleCreateLinkPage}
        className="w-full max-w-md"
      />
    </div>
  )
}