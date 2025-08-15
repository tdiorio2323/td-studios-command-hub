import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { aiEngine, ContentGeneration } from '@/lib/ai-engine'

export async function POST(request: NextRequest) {
  try {
    const { 
      type, 
      prompt, 
      model = 'claude',
      variations = 1,
      options = {}
    } = await request.json()

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Type and prompt are required' },
        { status: 400 }
      )
    }

    const validTypes: ContentGeneration['type'][] = ['blog', 'social', 'email', 'code', 'documentation']
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    let results: ContentGeneration[] = []

    if (variations > 1) {
      // Generate multiple variations
      const variationPrompts = Array(Math.min(variations, 5)).fill(null).map((_, i) => {
        const styles = ['professional', 'creative', 'casual', 'technical', 'conversational']
        return `${prompt}\n\nStyle: ${styles[i % styles.length]}`
      })

      const promises = variationPrompts.map(p => 
        aiEngine.generateContentWithClaude(type, p)
      )

      const responses = await Promise.allSettled(promises)
      results = responses
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<ContentGeneration>).value)

    } else {
      // Single generation
      const content = await aiEngine.generateContentWithClaude(type, prompt)
      results = [content]
    }

    // Add additional processing based on type
    const processedResults = results.map(result => ({
      ...result,
      metadata: {
        ...result.metadata,
        generatedAt: new Date().toISOString(),
        model: model,
        processingOptions: options
      }
    }))

    // Generate SEO insights for blog content
    if (type === 'blog' && processedResults.length > 0) {
      try {
        const seoAnalysis = await aiEngine.chatWithClaude([{
          role: 'user',
          content: `Analyze this blog content for SEO. Provide title suggestions, meta description, and key keywords:

${processedResults[0].content.substring(0, 1000)}...

Return as JSON with: titles (array), meta_description (string), keywords (array)`
        }])

        // Try to extract JSON from response
        const jsonMatch = seoAnalysis.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const seoData = JSON.parse(jsonMatch[0])
          processedResults[0].metadata = {
            ...processedResults[0].metadata,
            seo: seoData
          }
        }
      } catch (error) {
        logger.info('SEO analysis failed:', error)
      }
    }

    // Generate code documentation for code content
    if (type === 'code' && processedResults.length > 0) {
      try {
        const codeAnalysis = await aiEngine.chatWithClaude([{
          role: 'user',
          content: `Analyze this code and provide documentation:

${processedResults[0].content}

Return as JSON with: language (string), complexity (1-10), functions (array), dependencies (array)`
        }])

        const jsonMatch = codeAnalysis.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const codeData = JSON.parse(jsonMatch[0])
          processedResults[0].metadata = {
            ...processedResults[0].metadata,
            codeAnalysis: codeData
          } as any
        }
      } catch (error) {
        logger.info('Code analysis failed:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        results: processedResults,
        count: processedResults.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    logger.error('Content Generation API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/ai/content/generate',
      description: 'AI-powered content generation for multiple formats',
      supportedTypes: [
        'blog - Blog posts and articles',
        'social - Social media content',
        'email - Email campaigns and newsletters', 
        'code - Code generation and snippets',
        'documentation - Technical documentation'
      ],
      usage: {
        method: 'POST',
        body: {
          type: 'blog | social | email | code | documentation',
          prompt: 'Content generation prompt',
          model: 'claude | gpt (optional, defaults to claude)',
          variations: 'number (optional, 1-5)',
          options: 'object (optional, additional parameters)'
        }
      },
      features: [
        'Multiple content types',
        'Style variations',
        'SEO analysis for blogs',
        'Code documentation',
        'Metadata extraction',
        'Word count and tags'
      ]
    }
  })
}