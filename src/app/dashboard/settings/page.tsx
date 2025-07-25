'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Info,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface SettingSection {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('profile')
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    marketing: false
  })
  const [profile, setProfile] = useState({
    name: 'Tyler DiOrio',
    email: 'tyler@tdstudios.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer and AI enthusiast building the future of digital experiences.',
    avatar: ''
  })

  const settingSections: SettingSection[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      description: 'Manage your personal information'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Configure alert preferences'
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="w-5 h-5" />,
      description: 'Password and security settings'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      description: 'Customize the interface'
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: <Database className="w-5 h-5" />,
      description: 'Data export and privacy controls'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <Globe className="w-5 h-5" />,
      description: 'Connected apps and services'
    }
  ]

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleProfileChange = (key: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <DashboardLayout>
      <div className="flex space-x-6 h-[calc(100vh-8rem)]">
        {/* Settings Navigation */}
        <div className="w-80 glass-card">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <p className="text-gray-400 text-sm mt-1">Customize your TD Studios experience</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {settingSections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className={`transition-colors ${
                    activeSection === section.id ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{section.label}</p>
                    <p className="text-xs text-gray-400 truncate">{section.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-card">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Profile Information</h3>
                  <p className="text-gray-400">Update your personal details and profile settings.</p>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{profile.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{profile.email}</p>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                        Upload Photo
                      </button>
                      <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
                  <button className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
                  <p className="text-gray-400">Choose how you want to be notified about updates and activities.</p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      key: 'email',
                      title: 'Email Notifications',
                      description: 'Receive notifications via email about important updates',
                      icon: <Mail className="w-5 h-5 text-blue-400" />
                    },
                    {
                      key: 'push',
                      title: 'Push Notifications',
                      description: 'Get real-time notifications in your browser',
                      icon: <Bell className="w-5 h-5 text-green-400" />
                    },
                    {
                      key: 'desktop',
                      title: 'Desktop Notifications',
                      description: 'Show desktop notifications for important events',
                      icon: <Monitor className="w-5 h-5 text-purple-400" />
                    },
                    {
                      key: 'marketing',
                      title: 'Marketing Communications',
                      description: 'Receive updates about new features and promotions',
                      icon: <Info className="w-5 h-5 text-orange-400" />
                    }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          {setting.icon}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{setting.title}</h4>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleNotificationChange(setting.key, !notifications[setting.key as keyof typeof notifications])}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[setting.key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          animate={{
                            x: notifications[setting.key as keyof typeof notifications] ? 24 : 2
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-300 font-medium mb-1">Notification Settings</h4>
                      <p className="text-blue-200 text-sm">
                        You can always change these settings later. Critical security notifications will always be sent regardless of these preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Security Settings</h3>
                  <p className="text-gray-400">Manage your password and security preferences.</p>
                </div>

                <div className="space-y-6">
                  {/* Password Section */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="text-white font-medium">Password</h4>
                          <p className="text-gray-400 text-sm">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                          <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">Disabled</span>
                        <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="text-white font-medium">Active Sessions</h4>
                          <p className="text-gray-400 text-sm">Manage your active login sessions</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                        Sign Out All
                      </button>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      {[
                        { device: 'MacBook Pro', location: 'San Francisco, CA', current: true },
                        { device: 'iPhone 15', location: 'San Francisco, CA', current: false },
                        { device: 'Chrome Browser', location: 'New York, NY', current: false }
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Monitor className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-white text-sm font-medium">{session.device}</p>
                              <p className="text-gray-400 text-xs">{session.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.current && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Current</span>
                            )}
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Appearance</h3>
                  <p className="text-gray-400">Customize the look and feel of your dashboard.</p>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'dark', name: 'Dark', icon: Moon, active: true },
                        { id: 'light', name: 'Light', icon: Sun, active: false },
                        { id: 'auto', name: 'Auto', icon: Monitor, active: false }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          className={`p-4 rounded-xl border transition-all ${
                            theme.active
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <theme.icon className={`w-6 h-6 mx-auto mb-2 ${
                            theme.active ? 'text-blue-400' : 'text-gray-400'
                          }`} />
                          <p className={`text-sm ${theme.active ? 'text-white' : 'text-gray-400'}`}>
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Accent Color</h4>
                    <div className="flex space-x-3">
                      {[
                        'from-blue-500 to-purple-500',
                        'from-green-500 to-blue-500',
                        'from-red-500 to-pink-500',
                        'from-yellow-500 to-orange-500',
                        'from-purple-500 to-pink-500',
                        'from-indigo-500 to-blue-500'
                      ].map((gradient, index) => (
                        <button
                          key={index}
                          className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} border-2 ${
                            index === 0 ? 'border-white' : 'border-transparent hover:border-white/50'
                          } transition-all`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Settings */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Sidebar</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Collapsed by default</span>
                        <button className="relative w-12 h-6 bg-gray-600 rounded-full">
                          <motion.div
                            animate={{ x: 2 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Show navigation icons</span>
                        <button className="relative w-12 h-6 bg-blue-500 rounded-full">
                          <motion.div
                            animate={{ x: 24 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Animation Settings */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Animations</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Reduce motion</span>
                        <button className="relative w-12 h-6 bg-gray-600 rounded-full">
                          <motion.div
                            animate={{ x: 2 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Page transitions</span>
                        <button className="relative w-12 h-6 bg-blue-500 rounded-full">
                          <motion.div
                            animate={{ x: 24 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Data & Privacy</h3>
                  <p className="text-gray-400">Manage your data and privacy settings.</p>
                </div>

                <div className="space-y-6">
                  {/* Data Export */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="text-white font-medium">Export Data</h4>
                          <p className="text-gray-400 text-sm">Download a copy of your data</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Request Export
                      </button>
                    </div>
                  </div>

                  {/* Data Usage */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Storage Usage</h4>
                    <div className="space-y-3">
                      {[
                        { type: 'Files', used: '2.4 GB', total: '5 GB', percentage: 48 },
                        { type: 'Messages', used: '156 MB', total: '1 GB', percentage: 15 },
                        { type: 'Database', used: '89 MB', total: '500 MB', percentage: 18 }
                      ].map((item) => (
                        <div key={item.type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.type}</span>
                            <span className="text-white">{item.used} / {item.total}</span>
                          </div>
                          <div className="bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Controls */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-white font-medium mb-4">Privacy Controls</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Analytics tracking</span>
                        <button className="relative w-12 h-6 bg-blue-500 rounded-full">
                          <motion.div
                            animate={{ x: 24 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Usage telemetry</span>
                        <button className="relative w-12 h-6 bg-blue-500 rounded-full">
                          <motion.div
                            animate={{ x: 24 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Crash reporting</span>
                        <button className="relative w-12 h-6 bg-gray-600 rounded-full">
                          <motion.div
                            animate={{ x: 2 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-red-300 font-medium mb-2">Danger Zone</h4>
                        <p className="text-red-200 text-sm mb-4">
                          These actions are irreversible. Please be certain before proceeding.
                        </p>
                        <div className="space-y-3">
                          <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                            Clear All Data
                          </button>
                          <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Integrations</h3>
                  <p className="text-gray-400">Connect your favorite apps and services.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'GitHub',
                      description: 'Connect your repositories and track commits',
                      connected: true,
                      icon: '🐙'
                    },
                    {
                      name: 'OpenAI',
                      description: 'AI model integration and API access',
                      connected: true,
                      icon: '🤖'
                    },
                    {
                      name: 'Stripe',
                      description: 'Payment processing and subscription management',
                      connected: false,
                      icon: '💳'
                    },
                    {
                      name: 'Discord',
                      description: 'Team communication and notifications',
                      connected: false,
                      icon: '🎮'
                    },
                    {
                      name: 'Slack',
                      description: 'Workspace collaboration and alerts',
                      connected: false,
                      icon: '💬'
                    },
                    {
                      name: 'AWS',
                      description: 'Cloud infrastructure and services',
                      connected: true,
                      icon: '☁️'
                    }
                  ].map((integration) => (
                    <div key={integration.name} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h4 className="text-white font-medium">{integration.name}</h4>
                            <p className="text-gray-400 text-sm">{integration.description}</p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          integration.connected ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          integration.connected
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {integration.connected ? 'Connected' : 'Not Connected'}
                        </span>
                        
                        <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          integration.connected
                            ? 'bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30'
                            : 'bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30'
                        }`}>
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}