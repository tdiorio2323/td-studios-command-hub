import { NextRequest, NextResponse } from 'next/server'
import { aiEngine } from '@/lib/ai-engine'

export interface WorkflowStep {
  id: string
  type: 'text_generation' | 'image_analysis' | 'task_creation' | 'data_processing'
  prompt: string
  input?: any
  output?: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface AIWorkflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: 'draft' | 'running' | 'completed' | 'failed'
  results?: any[]
}

export async function POST(request: NextRequest) {
  try {
    const { workflowId, steps, execute = false } = await request.json()

    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Steps array is required' },
        { status: 400 }
      )
    }

    const workflow: AIWorkflow = {
      id: workflowId || `workflow_${Date.now()}`,
      name: `AI Workflow ${new Date().toLocaleString()}`,
      description: 'Custom AI workflow execution',
      steps: steps.map((step: any, index: number) => ({
        id: step.id || `step_${index}`,
        type: step.type || 'text_generation',
        prompt: step.prompt || '',
        input: step.input,
        status: 'pending' as const
      })),
      status: execute ? 'running' : 'draft'
    }

    if (!execute) {
      return NextResponse.json({
        success: true,
        data: {
          workflow,
          message: 'Workflow created but not executed. Set execute=true to run.'
        }
      })
    }

    // Execute workflow steps
    const results: any[] = []
    let previousOutput: any = null

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i]
      step.status = 'processing'

      try {
        let stepResult: any

        switch (step.type) {
          case 'text_generation':
            stepResult = await aiEngine.chatWithClaude([{
              role: 'user',
              content: step.prompt + (previousOutput ? `\n\nPrevious output: ${JSON.stringify(previousOutput)}` : '')
            }])
            break

          case 'image_analysis':
            if (!step.input?.imageData) {
              throw new Error('Image data required for image analysis step')
            }
            stepResult = await aiEngine.analyzeImageWithClaude(step.input.imageData, step.prompt)
            break

          case 'task_creation':
            const taskPrompt = `Create actionable tasks based on this request: ${step.prompt}
            ${previousOutput ? `Context: ${JSON.stringify(previousOutput)}` : ''}
            
            Return as JSON array: [{"task": "task description", "priority": "high/medium/low", "category": "category"}]`
            
            const taskResponse = await aiEngine.chatWithClaude([{
              role: 'user',
              content: taskPrompt
            }])
            
            // Try to extract JSON
            const jsonMatch = taskResponse.match(/\[[\s\S]*\]/)
            stepResult = jsonMatch ? JSON.parse(jsonMatch[0]) : taskResponse
            break

          case 'data_processing':
            stepResult = await aiEngine.chatWithClaude([{
              role: 'user',
              content: `Process this data according to the instructions: ${step.prompt}
              Data: ${JSON.stringify(step.input || previousOutput)}`
            }])
            break

          default:
            throw new Error(`Unknown step type: ${step.type}`)
        }

        step.output = stepResult
        step.status = 'completed'
        results.push({
          stepId: step.id,
          type: step.type,
          result: stepResult
        })
        
        // Pass output to next step
        previousOutput = stepResult

      } catch (error) {
        step.status = 'failed'
        step.output = { error: error instanceof Error ? error.message : 'Unknown error' }
        
        // Continue with other steps even if one fails
        results.push({
          stepId: step.id,
          type: step.type,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    workflow.status = workflow.steps.every(s => s.status === 'completed') ? 'completed' : 'failed'
    workflow.results = results

    return NextResponse.json({
      success: true,
      data: {
        workflow,
        results,
        summary: {
          totalSteps: workflow.steps.length,
          completedSteps: workflow.steps.filter(s => s.status === 'completed').length,
          failedSteps: workflow.steps.filter(s => s.status === 'failed').length,
          executionTime: `${Date.now() % 1000}ms`
        }
      }
    })

  } catch (error) {
    console.error('Workflow API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to execute workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return workflow templates and documentation
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/ai/workflows',
      description: 'Execute multi-step AI workflows',
      stepTypes: {
        text_generation: 'Generate text content using AI',
        image_analysis: 'Analyze images and extract insights',
        task_creation: 'Create structured task lists',
        data_processing: 'Process and transform data'
      },
      templates: [
        {
          name: 'Content Creation Pipeline',
          description: 'Generate blog post from topic to final content',
          steps: [
            {
              type: 'text_generation',
              prompt: 'Create a detailed outline for a blog post about: [TOPIC]'
            },
            {
              type: 'text_generation',
              prompt: 'Write the full blog post based on this outline'
            },
            {
              type: 'text_generation',
              prompt: 'Create SEO meta description and social media posts for this content'
            }
          ]
        },
        {
          name: 'Project Planning Workflow',
          description: 'Break down project into actionable tasks',
          steps: [
            {
              type: 'text_generation',
              prompt: 'Analyze this project requirement and create a project plan: [PROJECT_DESCRIPTION]'
            },
            {
              type: 'task_creation',
              prompt: 'Create specific tasks from the project plan'
            },
            {
              type: 'data_processing',
              prompt: 'Prioritize and organize tasks by timeline and dependencies'
            }
          ]
        }
      ],
      usage: {
        method: 'POST',
        body: {
          workflowId: 'Optional workflow identifier',
          steps: 'Array of workflow steps',
          execute: 'Boolean to execute immediately or just create'
        }
      }
    }
  })
}