'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const tabs = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'training', label: 'Model Training', icon: Brain },
  { id: 'automation', label: 'Automation', icon: Zap }
] as const;

type TabId = typeof tabs[number]['id'];

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [selectedModel, setSelectedModel] = useState('claude');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <div>Chat Interface - Coming Soon</div>;
      case 'training':
        return <div>Model Training - Coming Soon</div>;
      case 'automation':
        return <div>Automation Panel - Coming Soon</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Studio</h1>
          <p className="text-muted-foreground">
            Build, train, and deploy AI models
          </p>
        </div>

        <div className="grid gap-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md transition-all
                  ${activeTab === tab.id 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[600px]"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
