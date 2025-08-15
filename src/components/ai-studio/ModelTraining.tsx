'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Upload, Play, Pause } from 'lucide-react';

interface TrainingJob {
  id: string;
  name: string;
  status: 'idle' | 'training' | 'completed' | 'failed';
  progress: number;
  model: string;
}

export function ModelTraining() {
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<File | null>(null);

  const startTraining = async () => {
    if (!selectedDataset) return;

    const newJob: TrainingJob = {
      id: Date.now().toString(),
      name: `Training_${selectedDataset.name}`,
      status: 'training',
      progress: 0,
      model: 'custom-model'
    };

    setJobs(prev => [...prev, newJob]);

    // Simulate training progress
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => 
        job.id === newJob.id
          ? { ...job, progress: Math.min(job.progress + 10, 100) }
          : job
      ));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setJobs(prev => prev.map(job =>
        job.id === newJob.id
          ? { ...job, status: 'completed', progress: 100 }
          : job
      ));
    }, 10000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Model Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            type="file"
            id="dataset-upload"
            className="hidden"
            accept=".csv,.json,.txt"
            onChange={(e) => setSelectedDataset(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="dataset-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedDataset ? selectedDataset.name : 'Upload training dataset'}
            </span>
          </label>
        </div>

        <Button 
          onClick={startTraining} 
          disabled={!selectedDataset}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Training
        </Button>

        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{job.name}</span>
                <span className="text-xs text-gray-500">{job.status}</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}