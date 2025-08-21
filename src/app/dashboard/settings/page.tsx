'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
  Save,
  Mail,
  Phone,
  MapPin,
  Camera,
  Info,
  Lock,
  X,
  AlertTriangle
} from 'lucide-react';

interface SettingSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    security: true
  });
  const [profile, setProfile] = useState({
    name: 'Tyler DiOrio',
    email: 'tyler@tdstudios.com',
    phone: '3474859935',
    location: 'New York City',
    bio: 'Full-stack developer and AI enthusiast building the future of digital experiences.',
    avatar: null as string | null
  });

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
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setProfile(prev => ({ ...prev, avatar: null }));
  };

  return (
    <DashboardLayout>
      <div className="flex space-x-6 min-h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)]">
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
        <div className="flex-1 glass-card overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="p-6 space-y-6">
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
                className="flex-1 overflow-y-auto"
              >
                <div className="p-6 space-y-6">
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
                        key: 'security',
                        title: 'Security Alerts',
                        description: 'Important security notifications and alerts',
                        icon: <Shield className="w-5 h-5 text-red-400" />
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
                className="flex-1 overflow-y-auto"
              >
                <div className="p-6 space-y-6">
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
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other sections can be added here in a similar pattern */}
            {(activeSection === 'appearance' || activeSection === 'data' || activeSection === 'integrations') && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="p-6 space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {settingSections.find(s => s.id === activeSection)?.label || 'Settings'}
                    </h3>
                    <p className="text-gray-400">
                      {settingSections.find(s => s.id === activeSection)?.description || 'Configure your settings.'}
                    </p>
                  </div>

                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Coming Soon</h4>
                    <p className="text-gray-400">This section is under development and will be available soon.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
