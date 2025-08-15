'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Brain, Zap, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
}

function StatCard({ title, value, icon, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  const stats = [
    {
      title: 'Messages Today',
      value: '1,234',
      icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
      change: '+20.1% from yesterday'
    },
    {
      title: 'AI Models Used',
      value: '3',
      icon: <Brain className="h-4 w-4 text-muted-foreground" />,
      change: 'Claude, GPT-4, Custom'
    },
    {
      title: 'Automations Active',
      value: '12',
      icon: <Zap className="h-4 w-4 text-muted-foreground" />,
      change: '2 running now'
    },
    {
      title: 'Success Rate',
      value: '98.2%',
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      change: '+2.1% this week'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
        />
      ))}
    </div>
  );
}