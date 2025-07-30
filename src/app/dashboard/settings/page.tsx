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
    security: true
  })
  const [profile, setProfile] = useState({
    name: 'Tyler DiOrio',
    email: 'tyler@tdstudios.com',
    phone: '3474859935',
    location: 'New York City',
    bio: 'Full-stack developer and AI enthusiast building the future of digital experiences.',
    avatar: null as string | null
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

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarRemove = () => {
    setProfile(prev => ({ ...prev, avatar: null }))
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
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{profile.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{profile.email}</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        Upload Photo
                      </button>
                      <button
                        onClick={handleAvatarRemove}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Integrations</h3>
                      <p className="text-gray-400">Connect your favorite apps and services for seamless workflow.</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/integrations/test')
                          const data = await response.json()
                          console.log('Integration test results:', data)
                          alert(`Integration Test Complete!\n\nConnected: ${data.summary.connected}/${data.summary.total}\nCheck console for details.`)
                        } catch (error) {
                          console.error('Test failed:', error)
                          alert('Integration test failed. Check console for details.')
                        }
                      }}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      Test All Integrations
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* AI Services */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-300 flex items-center">
                      🤖 AI Services <span className="ml-2 text-sm text-gray-400">(6 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* OpenAI */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-green-400 font-bold text-xs">AI</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">OpenAI</h5>
                              <p className="text-gray-400 text-xs">GPT models and API</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 text-xs">Connected</span>
                          </div>
                        </div>
                      </div>

                      {/* Anthropic */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-purple-400 font-bold text-xs">C</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Anthropic</h5>
                              <p className="text-gray-400 text-xs">Claude AI models</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 text-xs">Connected</span>
                          </div>
                        </div>
                      </div>

                      {/* Google AI */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-400 font-bold text-xs">G</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Google AI</h5>
                              <p className="text-gray-400 text-xs">Gemini and Bard</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Cohere */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-orange-400 font-bold text-xs">CO</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Cohere</h5>
                              <p className="text-gray-400 text-xs">NLP and embeddings</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Hugging Face */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-yellow-400 font-bold text-xs">HF</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Hugging Face</h5>
                              <p className="text-gray-400 text-xs">Open source AI</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Replicate */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-pink-400 font-bold text-xs">R</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Replicate</h5>
                              <p className="text-gray-400 text-xs">AI model hosting</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Database & Backend */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-300 flex items-center">
                      💾 Database & Backend <span className="ml-2 text-sm text-gray-400">(7 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Supabase */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-green-400 font-bold text-xs">SB</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Supabase</h5>
                              <p className="text-gray-400 text-xs">Database & auth</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Redis */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-red-400 font-bold text-xs">R</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Redis</h5>
                              <p className="text-gray-400 text-xs">Caching & sessions</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* MongoDB */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-green-500 font-bold text-xs">M</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">MongoDB</h5>
                              <p className="text-gray-400 text-xs">NoSQL database</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* PlanetScale */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-purple-500 font-bold text-xs">PS</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">PlanetScale</h5>
                              <p className="text-gray-400 text-xs">MySQL platform</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Upstash */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-teal-400 font-bold text-xs">UP</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Upstash</h5>
                              <p className="text-gray-400 text-xs">Serverless Redis</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Processing */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-indigo-300 flex items-center">
                      💳 Payment Processing <span className="ml-2 text-sm text-gray-400">(5 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Stripe */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-400 font-bold text-xs">$</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Stripe</h5>
                              <p className="text-gray-400 text-xs">Payment processing</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* PayPal */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-500 font-bold text-xs">PP</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">PayPal</h5>
                              <p className="text-gray-400 text-xs">Online payments</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productivity & Workspace */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-orange-300 flex items-center">
                      🏢 Productivity & Workspace <span className="ml-2 text-sm text-gray-400">(4 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Notion */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-400 font-bold text-xs">N</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Notion</h5>
                              <p className="text-gray-400 text-xs">Workspace & docs</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Airtable */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-yellow-400 font-bold text-xs">AT</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Airtable</h5>
                              <p className="text-gray-400 text-xs">Database platform</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Slack */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-purple-400 font-bold text-xs">SL</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Slack</h5>
                              <p className="text-gray-400 text-xs">Team communication</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Discord */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-400 font-bold text-xs">DC</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Discord</h5>
                              <p className="text-gray-400 text-xs">Community chat</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Development & Code */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-300 flex items-center">
                      💻 Development & Code <span className="ml-2 text-sm text-gray-400">(4 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* GitHub */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 font-bold text-xs">GH</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">GitHub</h5>
                              <p className="text-gray-400 text-xs">Code repositories</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* GitLab */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-orange-500 font-bold text-xs">GL</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">GitLab</h5>
                              <p className="text-gray-400 text-xs">DevOps platform</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Vercel */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-black/40 border border-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">▲</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Vercel</h5>
                              <p className="text-gray-400 text-xs">Deployment platform</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Netlify */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-teal-400 font-bold text-xs">N</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Netlify</h5>
                              <p className="text-gray-400 text-xs">Web hosting</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Communication & Messaging - Show More Categories */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-cyan-300 flex items-center">
                      📧 Communication & Messaging <span className="ml-2 text-sm text-gray-400">(6 integrations)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Gmail */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-red-400 font-bold text-xs">GM</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Gmail</h5>
                              <p className="text-gray-400 text-xs">Email management</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Telegram */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-400 font-bold text-xs">TG</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Telegram</h5>
                              <p className="text-gray-400 text-xs">Bot messaging</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Twilio */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-red-500 font-bold text-xs">TW</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Twilio</h5>
                              <p className="text-gray-400 text-xs">SMS & voice</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* SendGrid */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-700/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-500 font-bold text-xs">SG</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">SendGrid</h5>
                              <p className="text-gray-400 text-xs">Email delivery</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>

                      {/* Resend */}
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-black/40 border border-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">RS</span>
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">Resend</h5>
                              <p className="text-gray-400 text-xs">Developer email</p>
                            </div>
                          </div>
                          <button className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Show Total Count */}
                  <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-blue-300 font-medium mb-1">🚀 Complete Integration Suite</h4>
                        <p className="text-blue-200 text-sm">
                          56 total integrations available across 12 categories. More integrations include Social Media, Analytics, File Storage, Business & CRM, Design Tools, and Project Management.
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-300">56</div>
                        <div className="text-xs text-blue-400">Integrations</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
