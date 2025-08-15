'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Settings Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400 text-lg">Customize your TD Studios experience</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
            <p className="text-gray-400">Manage your account information and preferences.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Notifications</h3>
            <p className="text-gray-400">Configure how you receive alerts and updates.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Security</h3>
            <p className="text-gray-400">Manage passwords and security settings.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Appearance</h3>
            <p className="text-gray-400">Customize themes and display options.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">API Keys</h3>
            <p className="text-gray-400">Manage your API integrations and keys.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Billing</h3>
            <p className="text-gray-400">View billing information and manage subscriptions.</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Advanced Settings</h3>
            <p className="text-gray-400 mb-4">More detailed configuration options coming soon</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white font-semibold">Under Development</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}