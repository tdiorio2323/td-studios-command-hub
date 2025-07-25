'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface AnalyticsData {
  visitors: { current: number; previous: number; change: number }
  pageViews: { current: number; previous: number; change: number }
  bounceRate: { current: number; previous: number; change: number }
  avgSession: { current: string; previous: string; change: number }
}

interface ChartData {
  date: string
  visitors: number
  pageViews: number
  sessions: number
}

interface TopPage {
  path: string
  views: number
  change: number
}

interface DeviceData {
  type: string
  percentage: number
  visitors: number
  color: string
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  
  const analyticsData: AnalyticsData = {
    visitors: { current: 12847, previous: 11234, change: 14.4 },
    pageViews: { current: 45672, previous: 38945, change: 17.3 },
    bounceRate: { current: 32.4, previous: 38.7, change: -16.3 },
    avgSession: { current: '4m 32s', previous: '3m 48s', change: 19.3 }
  }

  const chartData: ChartData[] = [
    { date: '2024-01-01', visitors: 1250, pageViews: 3400, sessions: 980 },
    { date: '2024-01-02', visitors: 1180, pageViews: 3200, sessions: 920 },
    { date: '2024-01-03', visitors: 1320, pageViews: 3600, sessions: 1050 },
    { date: '2024-01-04', visitors: 1450, pageViews: 3900, sessions: 1150 },
    { date: '2024-01-05', visitors: 1380, pageViews: 3750, sessions: 1080 },
    { date: '2024-01-06', visitors: 1520, pageViews: 4100, sessions: 1200 },
    { date: '2024-01-07', visitors: 1680, pageViews: 4500, sessions: 1350 }
  ]

  const topPages: TopPage[] = [
    { path: '/dashboard', views: 8429, change: 12.5 },
    { path: '/ai-studio', views: 6734, change: 23.8 },
    { path: '/file-vault', views: 5892, change: -5.2 },
    { path: '/tasks', views: 4567, change: 18.9 },
    { path: '/cms', views: 3421, change: 8.7 },
    { path: '/messages', views: 2986, change: -12.3 },
    { path: '/workspace', views: 2654, change: 34.6 },
    { path: '/analytics', views: 1893, change: 45.2 }
  ]

  const deviceData: DeviceData[] = [
    { type: 'Desktop', percentage: 68.4, visitors: 8789, color: 'from-blue-500 to-purple-500' },
    { type: 'Mobile', percentage: 24.8, visitors: 3186, color: 'from-green-500 to-blue-500' },
    { type: 'Tablet', percentage: 6.8, visitors: 872, color: 'from-orange-500 to-red-500' }
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-400" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400'
    if (change < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Track your platform's performance and user engagement</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white/5 rounded-lg p-1">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-purple-600/30 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              whileHover={{ rotate: 180 }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(analyticsData.visitors.change)}`}>
                {getChangeIcon(analyticsData.visitors.change)}
                <span className="text-sm font-medium">{Math.abs(analyticsData.visitors.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold text-white">{analyticsData.visitors.current.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">vs {analyticsData.visitors.previous.toLocaleString()} last period</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(analyticsData.pageViews.change)}`}>
                {getChangeIcon(analyticsData.pageViews.change)}
                <span className="text-sm font-medium">{Math.abs(analyticsData.pageViews.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-white">{analyticsData.pageViews.current.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">vs {analyticsData.pageViews.previous.toLocaleString()} last period</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-purple-400" />
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(analyticsData.bounceRate.change)}`}>
                {getChangeIcon(analyticsData.bounceRate.change)}
                <span className="text-sm font-medium">{Math.abs(analyticsData.bounceRate.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-white">{analyticsData.bounceRate.current}%</p>
              <p className="text-xs text-gray-500 mt-1">vs {analyticsData.bounceRate.previous}% last period</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className={`flex items-center space-x-1 ${getChangeColor(analyticsData.avgSession.change)}`}>
                {getChangeIcon(analyticsData.avgSession.change)}
                <span className="text-sm font-medium">{Math.abs(analyticsData.avgSession.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-white">{analyticsData.avgSession.current}</p>
              <p className="text-xs text-gray-500 mt-1">vs {analyticsData.avgSession.previous} last period</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Visitors Overview</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => (
                <motion.div
                  key={data.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.visitors / 1700) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-500/20 rounded-t-sm relative group cursor-pointer"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {data.visitors}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              {chartData.map((data) => (
                <span key={data.date}>
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Device Types</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <motion.div
                  key={device.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r bg-white/10 flex items-center justify-center">
                        {device.type === 'Desktop' && <Monitor className="w-4 h-4 text-blue-400" />}
                        {device.type === 'Mobile' && <Smartphone className="w-4 h-4 text-green-400" />}
                        {device.type === 'Tablet' && <Tablet className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{device.type}</p>
                        <p className="text-gray-400 text-sm">{device.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <span className="text-white font-semibold">{device.percentage}%</span>
                  </div>
                  
                  <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-full bg-gradient-to-r ${device.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages & Real-time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Pages */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Top Pages</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View all
              </button>
            </div>
            
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                    <div>
                      <p className="text-white font-medium">{page.path}</p>
                      <p className="text-gray-400 text-sm">{page.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${getChangeColor(page.change)}`}>
                    {getChangeIcon(page.change)}
                    <span className="text-sm font-medium">{Math.abs(page.change)}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Real-time</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">Live</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-2">247</p>
                <p className="text-gray-400 text-sm">Active Users</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Page Views (last hour)</span>
                    <span className="text-white">1,234</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">New Sessions</span>
                    <span className="text-white">89</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Conversions</span>
                    <span className="text-white">12</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white font-medium mb-3">Top Sources</h4>
                <div className="space-y-2">
                  {[
                    { source: 'Direct', percentage: 45 },
                    { source: 'Google', percentage: 32 },
                    { source: 'Social', percentage: 23 }
                  ].map((source) => (
                    <div key={source.source} className="flex justify-between text-sm">
                      <span className="text-gray-400">{source.source}</span>
                      <span className="text-white">{source.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Performance Insights</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Generate Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Strong Growth</p>
                  <p className="text-green-400 text-sm">+24% increase in user engagement</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Peak Hours</p>
                  <p className="text-blue-400 text-sm">Most active: 2-4 PM</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Global Reach</p>
                  <p className="text-purple-400 text-sm">Users from 47 countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}