'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  User,
  Bot,
  Clock,
  Check,
  CheckCheck,
  Circle,
  Settings,
  UserPlus,
  Hash,
  Bell,
  BellOff,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  status?: 'sent' | 'delivered' | 'read';
  isBot?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel' | 'ai';
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online?: boolean;
  isActive?: boolean;
  participants?: number;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'AI Assistant',
      senderId: 'ai-1',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      type: 'text',
      status: 'read',
      isBot: true,
    },
    {
      id: '2',
      content: 'I need help optimizing the dashboard performance',
      sender: 'Tyler DiOrio',
      senderId: 'user-1',
      timestamp: new Date('2024-01-01T12:05:00Z'),
      type: 'text',
      status: 'read',
    },
    {
      id: '3',
      content:
        'I can help you with that! Here are some optimization strategies:\n\n1. Implement code splitting\n2. Optimize bundle size\n3. Use React.memo for expensive components\n4. Implement virtual scrolling for large lists\n\nWould you like me to help implement any of these?',
      sender: 'AI Assistant',
      senderId: 'ai-1',
      timestamp: new Date('2024-01-01T12:08:00Z'),
      type: 'text',
      status: 'delivered',
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'AI Assistant',
      type: 'ai',
      lastMessage:
        'I can help you with your development tasks. What would you like to work on?',
      lastMessageTime: new Date('2024-01-01T12:00:00Z'),
      unreadCount: 0,
      online: true,
      isActive: true,
    },
    {
      id: '2',
      name: 'Development Team',
      type: 'group',
      lastMessage: 'The new feature is ready for testing',
      lastMessageTime: new Date('2024-01-01T11:50:00Z'),
      unreadCount: 5,
      participants: 8,
    },
    {
      id: '3',
      name: 'Client Updates',
      type: 'channel',
      lastMessage: 'Project milestone completed successfully',
      lastMessageTime: new Date('2024-01-01T11:00:00Z'),
      unreadCount: 0,
      participants: 24,
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      type: 'direct',
      lastMessage: 'Thanks for the quick response!',
      lastMessageTime: new Date('2024-01-01T10:00:00Z'),
      unreadCount: 0,
      online: true,
    },
    {
      id: '5',
      name: 'Project Alpha',
      type: 'group',
      lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
      lastMessageTime: new Date('2023-12-31T12:00:00Z'),
      unreadCount: 1,
      participants: 6,
    },
  ]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'Tyler DiOrio',
      senderId: 'user-1',
      timestamp: new Date(),
      type: 'text',
      status: 'sent',
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = messageInput;
    setMessageInput('');
    setIsLoading(true);

    // Only send to AI if AI conversation is selected
    if (selectedConversation === '1') {
      try {
        // Prepare conversation history for AI
        const conversationHistory = [...messages, userMessage].map(msg => ({
          role: msg.isBot ? 'assistant' : 'user',
          content: msg.content,
        }));

        const response = await fetch('/api/ai/simple-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: 'AI Assistant',
            senderId: 'ai-1',
            timestamp: new Date(),
            type: 'text',
            status: 'delivered',
            isBot: true,
          };

          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error(data.error || 'AI response failed');
        }
      } catch (error) {
        console.error('AI chat error:', error);

        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Sorry, I'm having trouble connecting right now. Please check that your AI integrations are properly configured in Settings.",
          sender: 'AI Assistant',
          senderId: 'ai-1',
          timestamp: new Date(),
          type: 'text',
          status: 'delivered',
          isBot: true,
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    }

    setIsLoading(false);
  };

  const getConversationIcon = (conversation: Conversation) => {
    switch (conversation.type) {
      case 'ai':
        return <Bot className='w-6 h-6 text-purple-400' />;
      case 'group':
        return (
          <div className='w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-xs text-white font-bold'>
            {conversation.participants}
          </div>
        );
      case 'channel':
        return <Hash className='w-6 h-6 text-green-400' />;
      default:
        return <User className='w-6 h-6 text-gray-400' />;
    }
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check className='w-4 h-4 text-gray-400' />;
      case 'delivered':
        return <CheckCheck className='w-4 h-4 text-gray-400' />;
      case 'read':
        return <CheckCheck className='w-4 h-4 text-blue-400' />;
      default:
        return <Circle className='w-4 h-4 text-gray-400' />;
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className='flex h-[calc(100vh-8rem)] space-x-6'>
        {/* Conversations List */}
        <div className='w-80 glass-card flex flex-col'>
          {/* Header */}
          <div className='p-6 border-b border-white/10'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-white'>Messages</h2>
              <div className='flex items-center space-x-2'>
                <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                  <Filter className='w-5 h-5' />
                </button>
                <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                  <Plus className='w-5 h-5' />
                </button>
              </div>
            </div>

            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search conversations...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
              />
            </div>
          </div>

          {/* Conversations */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-2'>
              {filteredConversations.map(conversation => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all mb-2 ${
                    selectedConversation === conversation.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='relative'>
                      {getConversationIcon(conversation)}
                      {conversation.online &&
                        conversation.type === 'direct' && (
                          <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900' />
                        )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h3 className='text-white font-medium truncate'>
                          {conversation.name}
                        </h3>
                        <span className='text-xs text-gray-400'>
                          {conversation.lastMessageTime
                            .getHours()
                            .toString()
                            .padStart(2, '0')}
                          :
                          {conversation.lastMessageTime
                            .getMinutes()
                            .toString()
                            .padStart(2, '0')}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <p className='text-gray-400 text-sm truncate'>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className='ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center'>
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className='flex-1 glass-card flex flex-col'>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className='p-6 border-b border-white/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='relative'>
                      {getConversationIcon(selectedConv)}
                      {selectedConv.online &&
                        selectedConv.type === 'direct' && (
                          <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900' />
                        )}
                    </div>
                    <div>
                      <h3 className='text-white font-semibold'>
                        {selectedConv.name}
                      </h3>
                      <p className='text-gray-400 text-sm'>
                        {selectedConv.type === 'ai' && 'AI Assistant'}
                        {selectedConv.type === 'direct' &&
                          selectedConv.online &&
                          'Online'}
                        {selectedConv.type === 'group' &&
                          `${selectedConv.participants} members`}
                        {selectedConv.type === 'channel' &&
                          `${selectedConv.participants} subscribers`}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                      <Phone className='w-5 h-5' />
                    </button>
                    <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                      <Video className='w-5 h-5' />
                    </button>
                    <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                      <Star className='w-5 h-5' />
                    </button>
                    <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                      <MoreHorizontal className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`flex items-end space-x-2 max-w-[70%] ${
                        message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.isBot
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {message.isBot ? (
                          <Bot className='w-4 h-4 text-white' />
                        ) : (
                          <User className='w-4 h-4 text-white' />
                        )}
                      </div>

                      <div
                        className={`p-4 rounded-2xl ${
                          message.isBot
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        }`}
                      >
                        <p className='whitespace-pre-wrap'>{message.content}</p>
                        <div
                          className={`flex items-center justify-end space-x-2 mt-2 ${
                            message.isBot ? 'text-gray-400' : 'text-blue-100'
                          }`}
                        >
                          <span className='text-xs'>
                            {message.timestamp
                              .getHours()
                              .toString()
                              .padStart(2, '0')}
                            :
                            {message.timestamp
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')}
                          </span>
                          {!message.isBot &&
                            getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex justify-start items-end space-x-2 max-w-[70%] flex-row-reverse space-x-reverse'
                  >
                    <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500'>
                      <Bot className='w-4 h-4 text-white' />
                    </div>
                    <div className='p-4 rounded-2xl bg-white/5 border border-white/10'>
                      <p className='whitespace-pre-wrap'>Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Message Input */}
              <div className='p-6 border-t border-white/10'>
                <div className='flex items-center space-x-3'>
                  <button className='p-2 text-gray-400 hover:text-white transition-colors'>
                    <Paperclip className='w-5 h-5' />
                  </button>

                  <div className='flex-1 relative'>
                    <input
                      type='text'
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyPress={e =>
                        e.key === 'Enter' && !e.shiftKey && sendMessage()
                      }
                      placeholder={
                        isLoading ? 'AI is thinking...' : 'Type a message...'
                      }
                      disabled={isLoading}
                      className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50'
                    />
                    <button className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors'>
                      <Smile className='w-5 h-5' />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || isLoading}
                    className='p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                  >
                    {isLoading ? (
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    ) : (
                      <Send className='w-5 h-5' />
                    )}
                  </motion.button>
                </div>

                {isLoading && selectedConversation === '1' && (
                  <div className='mt-3 flex items-center space-x-2 text-gray-400 text-sm'>
                    <div className='w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin' />
                    <span>AI is generating response...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center'>
              <div className='text-center'>
                <MessageSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-white mb-2'>
                  Select a conversation
                </h3>
                <p className='text-gray-400'>
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        {selectedConv && (
          <div className='w-80 glass-card'>
            <div className='p-6 border-b border-white/10'>
              <div className='text-center'>
                <div className='w-16 h-16 mx-auto mb-4'>
                  {getConversationIcon(selectedConv)}
                </div>
                <h3 className='text-lg font-semibold text-white mb-1'>
                  {selectedConv.name}
                </h3>
                <p className='text-gray-400 text-sm'>
                  {selectedConv.type === 'ai' && 'AI Assistant'}
                  {selectedConv.type === 'direct' && 'Direct Message'}
                  {selectedConv.type === 'group' &&
                    `${selectedConv.participants} members`}
                  {selectedConv.type === 'channel' &&
                    `${selectedConv.participants} subscribers`}
                </p>
              </div>
            </div>

            <div className='p-6 space-y-4'>
              {selectedConv.type === 'ai' && (
                <div className='space-y-3'>
                  <h4 className='text-white font-semibold'>AI Capabilities</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center space-x-2 text-gray-300'>
                      <Check className='w-4 h-4 text-green-400' />
                      <span>Code Generation</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-300'>
                      <Check className='w-4 h-4 text-green-400' />
                      <span>Problem Solving</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-300'>
                      <Check className='w-4 h-4 text-green-400' />
                      <span>Documentation</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-300'>
                      <Check className='w-4 h-4 text-green-400' />
                      <span>Task Automation</span>
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-3'>
                <h4 className='text-white font-semibold'>Actions</h4>
                <div className='space-y-2'>
                  <button className='w-full flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300'>
                    <Bell className='w-4 h-4' />
                    <span>Notifications</span>
                  </button>
                  <button className='w-full flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300'>
                    <Archive className='w-4 h-4' />
                    <span>Archive</span>
                  </button>
                  <button className='w-full flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300'>
                    <Settings className='w-4 h-4' />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
