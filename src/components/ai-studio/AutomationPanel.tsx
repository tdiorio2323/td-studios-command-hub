'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Zap, Settings, Plus } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  action: string;
}

export function AutomationPanel() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Auto-respond to emails',
      enabled: false,
      trigger: 'New email received',
      action: 'Generate AI response'
    },
    {
      id: '2',
      name: 'Content scheduling',
      enabled: true,
      trigger: 'Daily at 9 AM',
      action: 'Post to social media'
    }
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto =>
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Automations
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {automations.map(auto => (
          <div
            key={auto.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium">{auto.name}</div>
              <div className="text-sm text-gray-500">
                {auto.trigger} → {auto.action}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
              <Switch
                checked={auto.enabled}
                onCheckedChange={() => toggleAutomation(auto.id)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}