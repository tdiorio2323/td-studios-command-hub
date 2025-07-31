'use client'

import { Book, FileText, Image, Music, Video, Download, Eye, Star } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Content Library</h1>
          <p className="text-gray-400 text-lg">Manage your digital assets and resources.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">TOTAL FILES</p>
            <p className="text-3xl font-bold text-white mt-1">1,247</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">STORAGE USED</p>
            <p className="text-3xl font-bold text-white mt-1">2.4GB</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">FAVORITES</p>
            <p className="text-3xl font-bold text-white mt-1">89</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 text-sm">DOWNLOADS</p>
            <p className="text-3xl font-bold text-white mt-1">3,456</p>
          </div>
        </div>

        {/* Content Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Documents</h3>
            </div>
            <p className="text-gray-400 mb-4">PDFs, presentations, and text files</p>
            <div className="text-2xl font-bold text-white mb-2">432 files</div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              Browse Documents
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <Image className="h-8 w-8 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Images</h3>
            </div>
            <p className="text-gray-400 mb-4">Photos, graphics, and design assets</p>
            <div className="text-2xl font-bold text-white mb-2">789 files</div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
              Browse Images
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <Video className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Videos</h3>
            </div>
            <p className="text-gray-400 mb-4">Recordings, tutorials, and media</p>
            <div className="text-2xl font-bold text-white mb-2">26 files</div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
              Browse Videos
            </button>
          </div>
        </div>

        {/* Recent Files */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Files</h2>
          <div className="space-y-4">
            {[
              { name: "Project Proposal.pdf", type: "document", size: "2.4 MB", date: "2 hours ago" },
              { name: "Brand Assets.zip", type: "archive", size: "45.2 MB", date: "1 day ago" },
              { name: "Client Presentation.pptx", type: "presentation", size: "8.7 MB", date: "3 days ago" },
              { name: "Logo Design.ai", type: "design", size: "1.2 MB", date: "1 week ago" },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-400 mr-3" />
                  <div>
                    <h3 className="text-white font-medium">{file.name}</h3>
                    <p className="text-gray-400 text-sm">{file.size} • {file.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Star className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}