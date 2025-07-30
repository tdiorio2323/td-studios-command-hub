import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { logger } from './logger'

// AI clients initialized with environment variables
let claude: Anthropic | null = null
let openai: OpenAI | null = null

// Initialize AI clients with environment variables
async function initializeClients() {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (anthropicKey) {
      claude = new Anthropic({
        apiKey: anthropicKey
      })
      logger.ai.info('Claude client initialized')
    } else {
      logger.ai.warn('Anthropic API key not available')
    }

    if (openaiKey) {
      openai = new OpenAI({
        apiKey: openaiKey
      })
      logger.ai.info('OpenAI client initialized')
    } else {
      logger.ai.warn('OpenAI API key not available')
    }
  } catch (error) {
    logger.ai.error('ai-engine', error as Error)
  }
}

// Initialize clients on module load
initializeClients()

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

export interface PredictiveAnalytics {
  prediction: any
  confidence: number
  factors: string[]
  recommendation: string
  timeframe: string
  dataPoints: number
}

export interface TrendAnalysis {
  trend: 'upward' | 'downward' | 'stable' | 'volatile'
  strength: number
  factors: string[]
  prediction: string
  recommendations: string[]
  dataRange: {
    start: string
    end: string
    points: number
  }
}

export interface BusinessIntelligence {
  insights: string[]
  metrics: Record<string, number>
  recommendations: string[]
  risks: string[]
  opportunities: string[]
  nextActions: string[]
}

export interface AutomationWorkflow {
  id: string
  name: string
  trigger: string
  actions: Array<{
    type: string
    config: any
    order: number
  }>
  status: 'active' | 'paused' | 'error'
  lastRun?: string
  successRate: number
}

export class AIEngine {
  private modelSelector: Map<string, string> = new Map([
    ['analysis', 'claude-3-5-sonnet-20241022'],
    ['creative', 'gpt-4'],
    ['code', 'claude-3-5-sonnet-20241022'],
    ['quick', 'gpt-3.5-turbo'],
    ['vision', 'gpt-4-vision-preview'],
    ['prediction', 'claude-3-5-sonnet-20241022']
  ])

  // AI Model Orchestration
  async selectOptimalModel(taskType: string, complexity: 'low' | 'medium' | 'high'): Promise<{model: string, provider: 'claude' | 'openai'}> {
    const baseModel = this.modelSelector.get(taskType) || 'claude-3-5-sonnet-20241022'

    // Complexity-based model selection
    if (complexity === 'high' && taskType === 'analysis') {
      return { model: 'claude-3-5-sonnet-20241022', provider: 'claude' }
    }

    if (complexity === 'low' && taskType === 'creative') {
      return { model: 'gpt-3.5-turbo', provider: 'openai' }
    }

    return baseModel.includes('claude')
      ? { model: baseModel, provider: 'claude' }
      : { model: baseModel, provider: 'openai' }
  }

  async processWithOptimalAI(prompt: string, taskType: string, complexity: 'low' | 'medium' | 'high' = 'medium'): Promise<{
    response: string,
    model: string,
    provider: string,
    processingTime: number
  }> {
    const startTime = Date.now()
    const { model, provider } = await this.selectOptimalModel(taskType, complexity)

    try {
      let response: string
      if (provider === 'claude') {
        response = await this.chatWithClaude([{ role: 'user', content: prompt }], model)
      } else {
        response = await this.chatWithGPT([{ role: 'user', content: prompt }], model)
      }

      return {
        response,
        model,
        provider,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      // Fallback to alternative provider
      const fallbackProvider = provider === 'claude' ? 'openai' : 'claude'
      const fallbackResponse = fallbackProvider === 'claude'
        ? await this.chatWithClaude([{ role: 'user', content: prompt }])
        : await this.chatWithGPT([{ role: 'user', content: prompt }])

      return {
        response: fallbackResponse,
        model: `fallback-${fallbackProvider}`,
        provider: fallbackProvider,
        processingTime: Date.now() - startTime
      }
    }
  }

  // Predictive Analytics Engine
  async generatePredictiveAnalytics(data: any[], metricType: string): Promise<PredictiveAnalytics> {
    const prompt = `Analyze this ${metricType} data and provide predictive insights:

Data Points: ${JSON.stringify(data.slice(-20))} // Last 20 points

Provide analysis in this JSON format:
{
  "prediction": "predicted_value_or_trend",
  "confidence": 0.85,
  "factors": ["factor1", "factor2"],
  "recommendation": "specific recommendation",
  "timeframe": "next 30 days",
  "dataPoints": ${data.length}
}`

    try {
      const result = await this.processWithOptimalAI(prompt, 'prediction', 'high')
      const analysis = JSON.parse(result.response.match(/\{[\s\S]*\}/)?.[0] || '{}')

      return {
        prediction: analysis.prediction || 'Insufficient data',
        confidence: analysis.confidence || 0.5,
        factors: analysis.factors || ['Data quality', 'Historical trends'],
        recommendation: analysis.recommendation || 'Continue monitoring',
        timeframe: analysis.timeframe || 'next 30 days',
        dataPoints: data.length
      }
    } catch (error) {
      logger.ai.error('claude', error as Error)
      return {
        prediction: 'Analysis unavailable',
        confidence: 0,
        factors: ['System error'],
        recommendation: 'Retry analysis',
        timeframe: 'unknown',
        dataPoints: data.length
      }
    }
  }

  // Trend Analysis AI
  async analyzeTrends(data: number[], timeLabels: string[]): Promise<TrendAnalysis> {
    const prompt = `Analyze these time-series data points for trends:

Data: ${JSON.stringify(data)}
Time Labels: ${JSON.stringify(timeLabels)}

Determine:
1. Overall trend direction (upward/downward/stable/volatile)
2. Trend strength (0-1)
3. Key influencing factors
4. Future prediction
5. Actionable recommendations

Return JSON format:
{
  "trend": "upward",
  "strength": 0.8,
  "factors": ["seasonal growth", "market expansion"],
  "prediction": "continued growth expected",
  "recommendations": ["invest in scaling", "monitor capacity"]
}`

    try {
      const result = await this.processWithOptimalAI(prompt, 'analysis', 'high')
      const analysis = JSON.parse(result.response.match(/\{[\s\S]*\}/)?.[0] || '{}')

      return {
        trend: analysis.trend || 'stable',
        strength: analysis.strength || 0.5,
        factors: analysis.factors || ['Insufficient data'],
        prediction: analysis.prediction || 'Trend unclear',
        recommendations: analysis.recommendations || ['Collect more data'],
        dataRange: {
          start: timeLabels[0] || 'unknown',
          end: timeLabels[timeLabels.length - 1] || 'unknown',
          points: data.length
        }
      }
    } catch (error) {
      logger.ai.error('claude', error as Error)
      return {
        trend: 'stable',
        strength: 0,
        factors: ['Analysis error'],
        prediction: 'Unable to determine trend',
        recommendations: ['Check data quality'],
        dataRange: {
          start: 'unknown',
          end: 'unknown',
          points: data.length
        }
      }
    }
  }

  // Business Intelligence Engine
  async generateBusinessIntelligence(businessData: {
    revenue: number[]
    customers: number[]
    engagement: number[]
    costs: number[]
    timeframe: string[]
  }): Promise<BusinessIntelligence> {
    const prompt = `Analyze this business data and provide strategic insights:

Revenue: ${businessData.revenue.slice(-10)}
Customers: ${businessData.customers.slice(-10)}
Engagement: ${businessData.engagement.slice(-10)}
Costs: ${businessData.costs.slice(-10)}
Timeframe: ${businessData.timeframe.slice(-10)}

Provide comprehensive business intelligence in JSON:
{
  "insights": ["key insight 1", "key insight 2"],
  "metrics": {"growth_rate": 0.15, "customer_acquisition_cost": 45},
  "recommendations": ["recommendation 1", "recommendation 2"],
  "risks": ["risk 1", "risk 2"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "nextActions": ["action 1", "action 2"]
}`

    try {
      const result = await this.processWithOptimalAI(prompt, 'analysis', 'high')
      const intelligence = JSON.parse(result.response.match(/\{[\s\S]*\}/)?.[0] || '{}')

      return {
        insights: intelligence.insights || ['Business analysis in progress'],
        metrics: intelligence.metrics || {},
        recommendations: intelligence.recommendations || ['Continue monitoring performance'],
        risks: intelligence.risks || ['Market volatility'],
        opportunities: intelligence.opportunities || ['Market expansion potential'],
        nextActions: intelligence.nextActions || ['Review quarterly performance']
      }
    } catch (error) {
      logger.ai.error('claude', error as Error)
      return {
        insights: ['Analysis system temporarily unavailable'],
        metrics: {},
        recommendations: ['Retry analysis when system is available'],
        risks: ['Data analysis limitations'],
        opportunities: ['Improve data collection'],
        nextActions: ['Check system status']
      }
    }
  }

  // Advanced Document Processing
  async processDocument(content: string, processingType: 'summarize' | 'extract' | 'analyze' | 'categorize'): Promise<{
    result: any
    confidence: number
    processingTime: number
    metadata: any
  }> {
    const startTime = Date.now()

    const prompts = {
      summarize: `Summarize this document in 3-5 key points:\n\n${content}`,
      extract: `Extract key entities, dates, and important information from:\n\n${content}`,
      analyze: `Analyze the sentiment, topics, and key themes in:\n\n${content}`,
      categorize: `Categorize this document and assign relevant tags:\n\n${content}`
    }

    try {
      const result = await this.processWithOptimalAI(prompts[processingType], 'analysis', 'medium')

      return {
        result: result.response,
        confidence: 0.85,
        processingTime: Date.now() - startTime,
        metadata: {
          wordCount: content.split(' ').length,
          model: result.model,
          provider: result.provider
        }
      }
    } catch (error) {
      logger.ai.error('claude', error as Error)
      throw new Error('Failed to process document')
    }
  }

  // Smart Email Campaign Generation
  async generateEmailCampaign(campaignData: {
    audience: string
    goal: string
    tone: string
    brandVoice: string
  }): Promise<{
    subject: string
    content: string
    cta: string
    metadata: any
  }> {
    const prompt = `Generate a high-converting email campaign:

Audience: ${campaignData.audience}
Goal: ${campaignData.goal}
Tone: ${campaignData.tone}
Brand Voice: ${campaignData.brandVoice}

Create:
1. Compelling subject line
2. Email content with personalization
3. Strong call-to-action
4. A/B test variations

Format as JSON:
{
  "subject": "subject line",
  "content": "email body",
  "cta": "call to action",
  "variations": ["alt subject 1", "alt subject 2"]
}`

    try {
      const result = await this.processWithOptimalAI(prompt, 'creative', 'high')
      const campaign = JSON.parse(result.response.match(/\{[\s\S]*\}/)?.[0] || '{}')

      return {
        subject: campaign.subject || 'Your Subject Here',
        content: campaign.content || 'Email content unavailable',
        cta: campaign.cta || 'Take Action',
        metadata: {
          variations: campaign.variations || [],
          model: result.model,
          generatedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      logger.ai.error('claude', error as Error)
      throw new Error('Failed to generate email campaign')
    }
  }

  // Claude API Methods
  async chatWithClaude(messages: AIMessage[], model: string = 'claude-3-5-sonnet-20241022'): Promise<string> {
    if (!claude) {
      await initializeClients()
      if (!claude) {
        throw new Error('Claude client not initialized - API key not available')
      }
    }

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
      logger.ai.error('claude', error as Error)
      throw new Error('Failed to communicate with Claude')
    }
  }

  async prioritizeTasksWithClaude(tasks: string[]): Promise<TaskPriority[]> {
    if (!claude) {
      await initializeClients()
      if (!claude) {
        throw new Error('Claude client not initialized - API key not available')
      }
    }

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
      return tasks.map((task) => ({
        task,
        priority: Math.floor(Math.random() * 10) + 1,
        reasoning: 'AI prioritization unavailable - using fallback',
        urgency: 'medium' as const
      }))
    }
  }

  async generateContentWithClaude(type: ContentGeneration['type'], prompt: string): Promise<ContentGeneration> {
    if (!claude) {
      await initializeClients()
      if (!claude) {
        throw new Error('Claude client not initialized - API key not available')
      }
    }

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
    if (!claude) {
      await initializeClients()
      if (!claude) {
        throw new Error('Claude client not initialized - API key not available')
      }
    }

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
    if (!openai) {
      await initializeClients()
      if (!openai) {
        throw new Error('OpenAI client not initialized - API key not available')
      }
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
    if (!openai) {
      await initializeClients()
      if (!openai) {
        throw new Error('OpenAI client not initialized - API key not available')
      }
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
    if (!openai) {
      await initializeClients()
      if (!openai) {
        throw new Error('OpenAI client not initialized - API key not available')
      }
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
    if (!openai) {
      await initializeClients()
      if (!openai) {
        throw new Error('OpenAI client not initialized - API key not available')
      }
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
        claude ? this.chatWithClaude([{ role: 'user', content: 'Hello' }]) : Promise.reject('Claude not initialized'),
        openai ? this.chatWithGPT([{ role: 'user', content: 'Hello' }]) : Promise.reject('OpenAI not initialized')
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
