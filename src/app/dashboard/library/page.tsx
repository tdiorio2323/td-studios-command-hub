'use client';

import { useState } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List,
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
  Palette
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
  { id: 'guides', name: 'Guides', icon: FileImage }
];

const mediaCategories = [
  { id: 'images', name: 'Images', icon: Image, types: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
  { id: 'videos', name: 'Videos', icon: Video, types: ['mp4', 'mov', 'avi', 'mkv', 'webm'] },
  { id: 'audio', name: 'Audio', icon: Music, types: ['mp3', 'wav', 'flac', 'aac', 'm4a'] },
  { id: 'design', name: 'Design Files', icon: Palette, types: ['psd', 'ai', 'sketch', 'fig', 'xd'] }
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
    filePath: '/mnt/data/TD-Assets/Handbooks/TD_AI_Handbook.pdf'
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
    isDownloadable: true
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
    isDownloadable: true
  }
];

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
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
    setDocuments(docs => docs.map(doc => 
      doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'markdown': return Scroll;
      case 'ebook': return Book;
      case 'manual': return HardDrive;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-400';
      case 'markdown': return 'text-blue-400';
      case 'ebook': return 'text-green-400';
      case 'manual': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-8 space-y-8">


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-64 space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  const count = category.id === 'all'
                    ? documents.length
                    : documents.filter(doc => doc.category === category.id).length;

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
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm">{count}</span>
                    </button>
                  );
                })}

                {/* Media Section */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <button
                    onClick={() => setIsMediaExpanded(!isMediaExpanded)}
                    className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <div className="flex items-center space-x-3">
                      <FileImage className="w-5 h-5" />
                      <span className="font-medium">Media</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">0</span>
                      {isMediaExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isMediaExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {mediaCategories.map(mediaCategory => {
                        const Icon = mediaCategory.icon;
                        const isActive = selectedCategory === mediaCategory.id;

                        return (
                          <button
                            key={mediaCategory.id}
                            onClick={() => setSelectedCategory(mediaCategory.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-white border border-blue-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                              <span className="font-medium">{mediaCategory.name}</span>
                            </div>
                            <span className="text-xs">0</span>
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
          <div className="flex-1 space-y-6">
            {/* Search and Controls */}
            <div className="glass-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                    className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                  </select>
                  <button
                    onClick={handleUpload}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                {selectedCategory === 'all' ? 'All Documents' : 
                 categories.find(cat => cat.id === selectedCategory)?.name || 'Documents'}
                <span className="text-gray-400 text-base ml-2">({sortedDocuments.length})</span>
              </h3>

              {sortedDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No documents found</h4>
                  <p className="text-gray-400 mb-6">Try adjusting your search or upload new documents</p>
                  <button
                    onClick={handleUpload}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Your First Document
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {sortedDocuments.map(doc => {
                    const TypeIcon = getTypeIcon(doc.type);
                    const typeColor = getTypeColor(doc.type);

                    if (viewMode === 'grid') {
                      return (
                        <div key={doc.id} className="glass-card p-6 hover:bg-white/5 transition-all duration-200 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-black/20 ${typeColor}`}>
                              <TypeIcon className="w-6 h-6" />
                            </div>
                            <button
                              onClick={() => toggleFavorite(doc.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                doc.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${doc.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {doc.title}
                          </h4>
                          
                          {doc.description && (
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{doc.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {doc.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>{doc.size}</span>
                            <span>{new Date(doc.dateAdded).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            {doc.isDownloadable && (
                              <button className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={doc.id} className="flex items-center space-x-4 p-4 glass-card hover:bg-white/5 transition-all duration-200">
                          <div className={`p-3 rounded-lg bg-black/20 ${typeColor}`}>
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-white truncate">{doc.title}</h4>
                              {doc.isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                            </div>
                            <p className="text-gray-400 text-sm truncate">{doc.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                              <span>{doc.size}</span>
                              <span>{new Date(doc.dateAdded).toLocaleDateString()}</span>
                              {doc.author && <span>by {doc.author}</span>}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleFavorite(doc.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                doc.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            {doc.isDownloadable && (
                              <button className="p-2 text-green-400 hover:bg-green-600/20 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-gray-400 hover:bg-gray-600/20 rounded-lg transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
