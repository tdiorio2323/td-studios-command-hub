'use client';

import { useState } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  Upload,
  Search,
  Star,
  Calendar,
  User,
  Tag,
  Plus,
  Eye,
  Share2,
  Trash2,
  FileImage,
  Book,
  Scroll,
  HardDrive,
  ChevronDown,
  ChevronRight,
  Image,
  Video,
  Music,
  Palette,
  MessageSquare,
  Bot,
  Users,
  Phone,
  Code,
  Triangle,
  Zap,
  Brain,
  Hash,
  Camera,
  Layers,
  Sparkles,
  GitBranch,
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'markdown' | 'ebook' | 'manual' | 'guide' | 'other';
  category: string;
  size: string;
  dateAdded: string;
  author?: string;
  tags: string[];
  description?: string;
  isFavorite: boolean;
  isDownloadable: boolean;
  filePath?: string;
}

const categories = [
  { id: 'all', name: 'All Documents', icon: BookOpen },
  { id: 'pdfs', name: 'PDFs', icon: FileText },
  { id: 'markdowns', name: 'Markdowns', icon: Scroll },
  { id: 'ebooks', name: 'E-Books', icon: Book },
  { id: 'manuals', name: 'Manuals', icon: HardDrive },
  { id: 'guides', name: 'Guides', icon: FileImage },
];

const mediaCategories = [
  {
    id: 'images',
    name: 'Images',
    icon: Image,
    types: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    types: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Music,
    types: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
  },
  {
    id: 'design',
    name: 'Design Files',
    icon: Palette,
    types: ['psd', 'ai', 'sketch', 'fig', 'xd'],
  },
];

const chatLogCategories = [
  {
    id: 'ai-chats',
    name: 'AI Conversations',
    icon: Bot,
    types: ['txt', 'md', 'pdf'],
  },
  {
    id: 'team-chats',
    name: 'Team Chats',
    icon: Users,
    types: ['txt', 'md', 'pdf'],
  },
  {
    id: 'support-chats',
    name: 'Support Logs',
    icon: Phone,
    types: ['txt', 'md', 'pdf'],
  },
  {
    id: 'general-chats',
    name: 'General Chats',
    icon: MessageSquare,
    types: ['txt', 'md', 'pdf'],
  },
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    title: 'TD AI Handbook',
    type: 'pdf',
    category: 'guides',
    size: '2.4 MB',
    dateAdded: '2024-01-15',
    author: 'TD Studios',
    tags: ['AI', 'Handbook', 'Reference'],
    description: 'Comprehensive guide to AI implementation and best practices',
    isFavorite: true,
    isDownloadable: true,
    filePath: '/mnt/data/TD-Assets/Handbooks/TD_AI_Handbook.pdf',
  },
  {
    id: '2',
    title: 'Project Documentation Template',
    type: 'markdown',
    category: 'templates',
    size: '156 KB',
    dateAdded: '2024-01-10',
    tags: ['Template', 'Documentation'],
    description: 'Standard template for project documentation',
    isFavorite: false,
    isDownloadable: true,
  },
  {
    id: '3',
    title: 'API Reference Guide',
    type: 'pdf',
    category: 'manuals',
    size: '1.8 MB',
    dateAdded: '2024-01-08',
    tags: ['API', 'Reference', 'Development'],
    description: 'Complete API documentation and usage examples',
    isFavorite: true,
    isDownloadable: true,
  },
];

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const [isChatLogsExpanded, setIsChatLogsExpanded] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'date':
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log('Upload functionality to be implemented');
  };

  const toggleFavorite = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'markdown':
        return Scroll;
      case 'ebook':
        return Book;
      case 'manual':
        return HardDrive;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-400';
      case 'markdown':
        return 'text-blue-400';
      case 'ebook':
        return 'text-green-400';
      case 'manual':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    // Use a consistent format that works the same on server and client
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  return (
    <div className='min-h-screen'>
      {/* TD Studios CLI Header */}
      <div className='fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10'>
        <div className='px-8 py-4'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>TD</span>
              </div>
              <div>
                <h1 className='text-lg font-bold chrome-text'>TD STUDIOS</h1>
                <p className='text-xs text-gray-400'>CLI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-20 p-8 space-y-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Categories */}
          <div className='lg:w-64 space-y-4'>
            {/* Dashboard Logo Button */}
            <div className='mb-6'>
              <a
                href='/dashboard'
                className='block glass-card p-4 hover:bg-white/5 transition-all duration-200 group'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
                    <span className='text-white font-bold'>TD</span>
                  </div>
                  <div>
                    <h2 className='text-white font-semibold group-hover:text-blue-400 transition-colors'>
                      TD Studios
                    </h2>
                    <p className='text-xs text-gray-400'>Dashboard</p>
                  </div>
                </div>
              </a>
            </div>
            <div className='glass-card p-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>
                Categories
              </h3>
              <nav className='space-y-2'>
                {categories.map(category => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  const count =
                    category.id === 'all'
                      ? documents.length
                      : documents.filter(doc => doc.category === category.id)
                          .length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className='flex items-center space-x-3'>
                        <Icon
                          className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`}
                        />
                        <span className='font-medium'>{category.name}</span>
                      </div>
                      <span className='text-sm'>{count}</span>
                    </button>
                  );
                })}

                {/* Media Section */}
                <div className='border-t border-white/10 pt-4 mt-4'>
                  <button
                    onClick={() => setIsMediaExpanded(!isMediaExpanded)}
                    className='w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5'
                  >
                    <div className='flex items-center space-x-3'>
                      <FileImage className='w-5 h-5' />
                      <span className='font-medium'>Media</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm'>0</span>
                      {isMediaExpanded ? (
                        <ChevronDown className='w-4 h-4' />
                      ) : (
                        <ChevronRight className='w-4 h-4' />
                      )}
                    </div>
                  </button>

                  {isMediaExpanded && (
                    <div className='ml-4 mt-2 space-y-1'>
                      {mediaCategories.map(mediaCategory => {
                        const Icon = mediaCategory.icon;
                        const isActive = selectedCategory === mediaCategory.id;

                        return (
                          <button
                            key={mediaCategory.id}
                            onClick={() =>
                              setSelectedCategory(mediaCategory.id)
                            }
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className='flex items-center space-x-3'>
                              <Icon
                                className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`}
                              />
                              <span className='font-medium'>
                                {mediaCategory.name}
                              </span>
                            </div>
                            <span className='text-xs'>0</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chat Logs Section */}
                <div className='border-t border-white/10 pt-4 mt-4'>
                  <button
                    onClick={() => setIsChatLogsExpanded(!isChatLogsExpanded)}
                    className='w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5'
                  >
                    <div className='flex items-center space-x-3'>
                      <MessageSquare className='w-5 h-5' />
                      <span className='font-medium'>Chat Logs</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm'>0</span>
                      {isChatLogsExpanded ? (
                        <ChevronDown className='w-4 h-4' />
                      ) : (
                        <ChevronRight className='w-4 h-4' />
                      )}
                    </div>
                  </button>

                  {isChatLogsExpanded && (
                    <div className='ml-4 mt-2 space-y-1'>
                      {chatLogCategories.map(chatCategory => {
                        const Icon = chatCategory.icon;
                        const isActive = selectedCategory === chatCategory.id;

                        return (
                          <button
                            key={chatCategory.id}
                            onClick={() => setSelectedCategory(chatCategory.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className='flex items-center space-x-3'>
                              <Icon
                                className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`}
                              />
                              <span className='font-medium'>
                                {chatCategory.name}
                              </span>
                            </div>
                            <span className='text-xs'>0</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 space-y-6'>
            {/* Search and Controls */}
            <div className='glass-card p-6'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'>
                <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      placeholder='Search documents...'
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none w-full sm:w-64'
                    />
                  </div>
                  <button
                    onClick={handleUpload}
                    className='p-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200'
                    title='Upload'
                  >
                    <Upload className='w-5 h-5' />
                  </button>
                </div>
                <div className='flex items-center space-x-3'>
                  {/* Service Icons */}
                  <button
                    className='p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors'
                    title='ChatGPT'
                  >
                    <Zap className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 transition-colors'
                    title='Claude'
                  >
                    <Brain className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors'
                    title='Notion'
                  >
                    <BookOpen className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors'
                    title='Twitter'
                  >
                    <Hash className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-pink-600/20 text-pink-400 hover:bg-pink-600/30 transition-colors'
                    title='Instagram'
                  >
                    <Camera className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors'
                    title='TD Studios NY'
                  >
                    <Star className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors'
                    title='Figma'
                  >
                    <Layers className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition-colors'
                    title='Freepik'
                  >
                    <Sparkles className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 transition-colors'
                    title='GitHub'
                  >
                    <GitBranch className='w-5 h-5' />
                  </button>
                  <button
                    className='p-2 rounded-lg bg-black/40 border border-white/20 text-white hover:bg-black/60 transition-colors'
                    title='Vercel'
                  >
                    <Triangle className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Templates Card */}
              <div className='glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 rounded-lg bg-blue-500/20'>
                    <FileText className='w-6 h-6 text-blue-400' />
                  </div>
                  <span className='text-xs text-gray-400'>Templates</span>
                </div>
                <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                  Templates
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  PRDs, .MD files, documentation templates
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>2 templates</span>
                  <button className='px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-xs'>
                    Browse
                  </button>
                </div>
              </div>

              {/* Most Used Card */}
              <div className='glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 rounded-lg bg-green-500/20'>
                    <Star className='w-6 h-6 text-green-400' />
                  </div>
                  <span className='text-xs text-gray-400'>Most Used</span>
                </div>
                <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors'>
                  Most Used
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  Documents you frequently access
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>3 documents</span>
                  <button className='px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-xs'>
                    View All
                  </button>
                </div>
              </div>

              {/* Recently Card */}
              <div className='glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 rounded-lg bg-purple-500/20'>
                    <Calendar className='w-6 h-6 text-purple-400' />
                  </div>
                  <span className='text-xs text-gray-400'>Recently</span>
                </div>
                <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors'>
                  Recently
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  Recently opened, modified, or created
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>5 documents</span>
                  <button className='px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-xs'>
                    View All
                  </button>
                </div>
              </div>
            </div>

            {/* AI-Powered Tools */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Chat Organizer Card */}
              <div className='glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 rounded-lg bg-orange-500/20'>
                    <MessageSquare className='w-6 h-6 text-orange-400' />
                  </div>
                  <span className='text-xs text-gray-400'>AI Organizer</span>
                </div>
                <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors'>
                  Chat Organizer
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  Upload random docs or chat logs and AI will automatically sort
                  and categorize them
                </p>
                <div className='mb-4'>
                  <div className='border-2 border-dashed border-orange-500/30 rounded-lg p-4 bg-orange-500/5 hover:border-orange-500/50 transition-colors'>
                    <div className='text-center'>
                      <Upload className='w-8 h-8 text-orange-400 mx-auto mb-2' />
                      <p className='text-sm text-orange-300 mb-1'>
                        Drop files here or click to upload
                      </p>
                      <p className='text-xs text-gray-400'>
                        Supports .txt, .md, .pdf, .log files
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>
                    0 files processed
                  </span>
                  <button className='px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors text-xs'>
                    Start Sorting
                  </button>
                </div>
              </div>

              {/* Refactoring Generator Card */}
              <div className='glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 rounded-lg bg-cyan-500/20'>
                    <Code className='w-6 h-6 text-cyan-400' />
                  </div>
                  <span className='text-xs text-gray-400'>Code Cleanup</span>
                </div>
                <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors'>
                  Refactoring Generator
                </h3>
                <p className='text-gray-400 text-sm mb-4'>
                  Clean up code documentation, improve formatting, and optimize
                  structure
                </p>
                <div className='mb-4'>
                  <div className='border-2 border-dashed border-cyan-500/30 rounded-lg p-4 bg-cyan-500/5 hover:border-cyan-500/50 transition-colors'>
                    <div className='text-center'>
                      <FileText className='w-8 h-8 text-cyan-400 mx-auto mb-2' />
                      <p className='text-sm text-cyan-300 mb-1'>
                        Upload code files for cleanup
                      </p>
                      <p className='text-xs text-gray-400'>
                        Supports .js, .ts, .py, .md, .json files
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>
                    0 files refactored
                  </span>
                  <button className='px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-xs'>
                    Clean Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
