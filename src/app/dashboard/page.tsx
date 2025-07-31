'use client'

import { Brain, Files, CheckSquare, BarChart3, Zap, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Simple Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Tyler</h1>
          <p className="text-gray-400 text-lg">Your digital command center is ready.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">ACTIVE PROJECTS</p>
            <p className="text-3xl font-bold text-white mt-1">8</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">COMPLETED TASKS</p>
            <p className="text-3xl font-bold text-white mt-1">47</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">AI INTERACTIONS</p>
            <p className="text-3xl font-bold text-white mt-1">235</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">STORAGE USED</p>
            <p className="text-3xl font-bold text-white mt-1">2.40 GB</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">UPTIME</p>
            <p className="text-3xl font-bold text-white mt-1">99.9%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <a href="/dashboard/ai-studio" className="glass-card p-6 text-center hover:bg-white/10">
              <Brain className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">AI Studio</p>
            </a>
            <a href="/dashboard/file-vault" className="glass-card p-6 text-center hover:bg-white/10">
              <Files className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">File Vault</p>
            </a>
            <a href="/dashboard/tasks" className="glass-card p-6 text-center hover:bg-white/10">
              <CheckSquare className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">Task Manager</p>
            </a>
            <a href="/dashboard/analytics" className="glass-card p-6 text-center hover:bg-white/10">
              <BarChart3 className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">Analytics</p>
            </a>
            <a href="/dashboard/workflows" className="glass-card p-6 text-center hover:bg-white/10">
              <Zap className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">Workflows</p>
            </a>
            <a href="/dashboard/messages" className="glass-card p-6 text-center hover:bg-white/10">
              <MessageSquare className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold">Messages</p>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">AI Analysis completed</p>
                <p className="text-gray-400 text-sm">2m ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <div>
                <p className="text-white font-medium">New file uploaded to vault</p>
                <p className="text-gray-400 text-sm">5m ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">Task "Project Review" completed</p>
                <p className="text-gray-400 text-sm">12m ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Status */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Neural Network</h3>
                <p className="text-gray-400">All systems operational • Processing at 94% efficiency</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white font-semibold">Online</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}