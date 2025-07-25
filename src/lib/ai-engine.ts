import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// Initialize AI clients
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TaskPriority {
  task: string
  priority: number
  reasoning: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ContentGeneration {
  type: 'blog' | 'social' | 'email' | 'code' | 'documentation'
  content: string
  metadata?: {
    title?: string
    tags?: string[]
    wordCount?: number
    seo?: any
    generatedAt?: string
    model?: string
    processingOptions?: any
    [key: string]: any
  }
}

export class AIEngine {
  
  // Claude API Methods
  async chatWithClaude(messages: AIMessage[], model: string = 'claude-3-5-sonnet-20241022'): Promise<string> {
    try {
      const response = await claude.messages.create({
        model,
        max_tokens: 4000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })

      const content = response.content[0]
      return content.type === 'text' ? content.text : 'Unable to generate response'
    } catch (error) {
      console.error('Claude API Error:', error)
      throw new Error('Failed to communicate with Claude')
    }
  }

  async prioritizeTasksWithClaude(tasks: string[]): Promise<TaskPriority[]> {
    try {
      const prompt = `Analyze and prioritize these tasks. Return a JSON array with priority scores (1-10), urgency levels, and reasoning:

Tasks:
${tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}

Return format:
[
  {
    "task": "task name",
    "priority": 8,
    "reasoning": "explanation",
    "urgency": "high"
  }
]`

      const response = await claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        // Extract JSON from response
        const jsonMatch = content.text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Task prioritization error:', error)
      // Fallback: basic prioritization
      return tasks.map((task, index) => ({
        task,
        priority: Math.floor(Math.random() * 10) + 1,
        reasoning: 'AI prioritization unavailable - using fallback',
        urgency: 'medium' as const
      }))
    }
  }

  async generateContentWithClaude(type: ContentGeneration['type'], prompt: string): Promise<ContentGeneration> {
    try {
      const systemPrompts = {
        blog: 'You are an expert blog writer. Create engaging, SEO-optimized blog content.',
        social: 'You are a social media expert. Create engaging posts optimized for social platforms.',
        email: 'You are an email marketing specialist. Create compelling email content.',
        code: 'You are a senior software developer. Write clean, documented code.',
        documentation: 'You are a technical writer. Create clear, comprehensive documentation.'
      }

      const response = await claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `${systemPrompts[type]}\n\nRequest: ${prompt}`
        }]
      })

      const content = response.content[0]
      const generatedContent = content.type === 'text' ? content.text : 'Unable to generate content'

      return {
        type,
        content: generatedContent,
        metadata: {
          wordCount: generatedContent.split(' ').length,
          tags: this.extractTags(generatedContent)
        }
      }
    } catch (error) {
      console.error('Content generation error:', error)
      throw new Error('Failed to generate content')
    }
  }

  async analyzeImageWithClaude(imageData: string, prompt: string = 'Describe this image in detail'): Promise<string> {
    try {
      const response = await claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }]
      })

      const content = response.content[0]
      return content.type === 'text' ? content.text : 'Unable to analyze image'
    } catch (error) {
      console.error('Image analysis error:', error)
      throw new Error('Failed to analyze image')
    }
  }

  async analyzeImageWithGPT(imageData: string, prompt: string = 'Describe this image in detail'): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }],
        max_tokens: 1000
      })

      return response.choices[0]?.message?.content || 'Unable to analyze image'
    } catch (error) {
      console.error('GPT Vision API Error:', error)
      throw new Error('Failed to analyze image with GPT')
    }
  }

  // OpenAI GPT Methods
  async chatWithGPT(messages: AIMessage[], model: string = 'gpt-4'): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000,
        temperature: 0.7
      })

      return response.choices[0]?.message?.content || 'Unable to generate response'
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to communicate with GPT')
    }
  }

  async generateImageWithDALLE(prompt: string, size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'standard'
      })

      return response.data?.[0]?.url || ''
    } catch (error) {
      console.error('DALL-E API Error:', error)
      throw new Error('Failed to generate image')
    }
  }

  async transcribeAudioWithWhisper(audioBuffer: Buffer): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' }),
        model: 'whisper-1'
      })

      return response.text
    } catch (error) {
      console.error('Whisper API Error:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  // Multi-AI Methods
  async compareAIResponses(prompt: string): Promise<{claude: string, gpt: string}> {
    try {
      const [claudeResponse, gptResponse] = await Promise.allSettled([
        this.chatWithClaude([{ role: 'user', content: prompt }]),
        this.chatWithGPT([{ role: 'user', content: prompt }])
      ])

      return {
        claude: claudeResponse.status === 'fulfilled' ? claudeResponse.value : 'Claude unavailable',
        gpt: gptResponse.status === 'fulfilled' ? gptResponse.value : 'GPT unavailable'
      }
    } catch (error) {
      console.error('AI comparison error:', error)
      throw new Error('Failed to compare AI responses')
    }
  }

  async generateCreativeContent(prompt: string, variations: number = 3): Promise<string[]> {
    const variations_prompts = Array(variations).fill(null).map((_, i) => 
      `${prompt} (Style variation ${i + 1}: ${['professional', 'creative', 'casual'][i % 3]})`
    )

    try {
      const responses = await Promise.allSettled(
        variations_prompts.map(p => this.chatWithClaude([{ role: 'user', content: p }]))
      )

      return responses
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<string>).value)
    } catch (error) {
      console.error('Creative content generation error:', error)
      throw new Error('Failed to generate creative variations')
    }
  }

  // Utility Methods
  private extractTags(content: string): string[] {
    // Simple tag extraction based on keywords
    const commonTags = [
      'AI', 'productivity', 'automation', 'technology', 'business',
      'development', 'design', 'marketing', 'content', 'strategy'
    ]
    
    return commonTags.filter(tag => 
      content.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 5)
  }

  async getModelCapabilities(): Promise<{
    claude: { models: string[], features: string[] },
    openai: { models: string[], features: string[] }
  }> {
    return {
      claude: {
        models: [
          'claude-3-5-sonnet-20241022',
          'claude-3-opus-20240229',
          'claude-3-haiku-20240307'
        ],
        features: [
          'Text generation',
          'Code analysis',
          'Image analysis',
          'Long-form content',
          'Complex reasoning'
        ]
      },
      openai: {
        models: [
          'gpt-4',
          'gpt-4-turbo',
          'gpt-3.5-turbo',
          'dall-e-3',
          'whisper-1'
        ],
        features: [
          'Text generation',
          'Image generation',
          'Audio transcription',
          'Code completion',
          'Function calling'
        ]
      }
    }
  }

  // Health check method
  async healthCheck(): Promise<{
    claude: boolean,
    openai: boolean,
    timestamp: string
  }> {
    const timestamp = new Date().toISOString()
    
    try {
      const [claudeTest, openaiTest] = await Promise.allSettled([
        this.chatWithClaude([{ role: 'user', content: 'Hello' }]),
        process.env.OPENAI_API_KEY ? this.chatWithGPT([{ role: 'user', content: 'Hello' }]) : Promise.reject('No API key')
      ])

      return {
        claude: claudeTest.status === 'fulfilled',
        openai: openaiTest.status === 'fulfilled',
        timestamp
      }
    } catch (error) {
      return {
        claude: false,
        openai: false,
        timestamp
      }
    }
  }
}

// Export singleton instance
export const aiEngine = new AIEngine()