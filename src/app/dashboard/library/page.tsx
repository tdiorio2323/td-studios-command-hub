'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Library Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Library</h1>
          <p className="text-gray-400 text-lg">Your knowledge base and resources</p>
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Documents</h3>
            <p className="text-gray-400">Manage your document library and templates.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Templates</h3>
            <p className="text-gray-400">Pre-built templates for common tasks.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Resources</h3>
            <p className="text-gray-400">Links and references for your projects.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Knowledge Base</h3>
            <p className="text-gray-400">Your personal knowledge management system.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Bookmarks</h3>
            <p className="text-gray-400">Save important links and references.</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">Archive</h3>
            <p className="text-gray-400">Access archived content and older versions.</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Library Features</h3>
            <p className="text-gray-400 mb-4">Advanced library management coming soon</p>
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