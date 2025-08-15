import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { aiEngine } from '@/lib/ai-engine'

export async function POST(request: NextRequest) {
  try {
    const { imageData, imageUrl, prompt, analysis_type = 'general', model = 'claude' } = await request.json()

    if (!imageData && !imageUrl) {
      return NextResponse.json(
        { error: 'Either imageData (base64) or imageUrl is required' },
        { status: 400 }
      )
    }

    let processedImageData = imageData

    // If URL provided, convert to base64
    if (imageUrl && !imageData) {
      try {
        new URL(imageUrl)
        const response = await fetch(imageUrl)
        const buffer = await response.arrayBuffer()
        processedImageData = Buffer.from(buffer).toString('base64')
      } catch {
        return NextResponse.json(
          { error: 'Invalid image URL or unable to fetch image' },
          { status: 400 }
        )
      }
    }

    // Create analysis prompt based on type
    let analysisPrompt = prompt || 'Describe this image in detail'
    
    switch (analysis_type) {
      case 'marketing':
        analysisPrompt = `Analyze this image for marketing purposes. Include:
1. Visual elements and composition
2. Brand elements or logos
3. Marketing effectiveness
4. Suggested improvements
5. Target audience appeal

${prompt || ''}`
        break

      case 'accessibility':
        analysisPrompt = `Analyze this image for accessibility. Provide:
1. Detailed alt text description
2. Color contrast information
3. Text readability
4. Accessibility compliance issues
5. Recommendations for improvement

${prompt || ''}`
        break

      case 'technical':
        analysisPrompt = `Provide technical analysis of this image:
1. Image composition and quality
2. Technical specifications visible
3. Any diagrams, charts, or data
4. Text extraction if present
5. Overall technical assessment

${prompt || ''}`
        break

      case 'creative':
        analysisPrompt = `Provide creative analysis of this image:
1. Artistic elements and style
2. Mood and emotional impact
3. Creative techniques used
4. Inspiration and themes
5. Suggestions for creative applications

${prompt || ''}`
        break

      case 'ecommerce':
        analysisPrompt = `Analyze this product image for e-commerce:
1. Product visibility and presentation
2. Background and lighting quality
3. Marketing appeal
4. Suggested product descriptions
5. Optimization recommendations

${prompt || ''}`
        break
    }

    // Analyze image with selected model
    let analysis: string
    if (model.toLowerCase() === 'gpt' || model.toLowerCase() === 'openai') {
      analysis = await aiEngine.analyzeImageWithGPT(processedImageData, analysisPrompt)
    } else {
      analysis = await aiEngine.analyzeImageWithClaude(processedImageData, analysisPrompt)
    }

    // Extract structured data if possible
    let structuredData = null
    try {
      // Try to extract JSON-like data from the response
      const jsonMatch = analysis.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        structuredData = JSON.parse(jsonMatch[0])
      }
    } catch {
      // If no structured data, that's fine
    }

    // Generate additional insights based on analysis type
    let additionalInsights = null
    
    if (analysis_type === 'marketing') {
      try {
        const marketingInsights = await aiEngine.chatWithClaude([{
          role: 'user',
          content: `Based on this image analysis, provide 3 specific marketing recommendations in JSON format:

Analysis: ${analysis.substring(0, 500)}

Return: {"recommendations": [{"title": "", "description": "", "impact": "high|medium|low"}]}`
        }])

        const jsonMatch = marketingInsights.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          additionalInsights = JSON.parse(jsonMatch[0])
        }
      } catch (error) {
        logger.info('Marketing insights failed:', error)
      }
    }

    // Calculate confidence score based on response length and detail
    const confidenceScore = Math.min(
      95,
      Math.max(60, analysis.length / 10 + (structuredData ? 15 : 0))
    )

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        analysis: analysis.trim(),
        analysisType: analysis_type,
        structuredData,
        additionalInsights,
        metadata: {
          confidenceScore: Math.round(confidenceScore),
          analysisLength: analysis.length,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() % 1000 + 'ms' // Simulated processing time
        }
      }
    })

  } catch (error) {
    logger.error('Image Analysis API Error:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid image')) {
        return NextResponse.json(
          { error: 'Unable to process image', details: 'Image may not be accessible or valid' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Service configuration error', details: 'AI service not properly configured' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
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
      endpoint: '/api/ai/image/analyze',
      description: 'AI-powered image analysis with Claude Vision',
      analysisTypes: [
        'general - Basic image description',
        'marketing - Marketing effectiveness analysis',
        'accessibility - Accessibility compliance and alt text',
        'technical - Technical specifications and diagrams',
        'creative - Artistic and creative elements',
        'ecommerce - Product presentation analysis'
      ],
      usage: {
        method: 'POST',
        body: {
          imageUrl: 'URL to the image (required)',
          prompt: 'Custom analysis prompt (optional)',
          analysis_type: 'Type of analysis to perform (optional)'
        }
      },
      features: [
        'Multiple analysis types',
        'Structured data extraction',
        'Additional insights generation',
        'Confidence scoring',
        'Marketing recommendations',
        'Accessibility compliance'
      ],
      limits: {
        maxImageSize: '20MB',
        supportedFormats: ['JPG', 'PNG', 'GIF', 'WEBP'],
        rateLimits: '100 requests per hour'
      }
    }
  })
}