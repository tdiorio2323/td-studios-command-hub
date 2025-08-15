import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { aiEngine } from '@/lib/ai-engine'

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      style = 'realistic',
      size = '1024x1024',
      count = 1,
      enhance_prompt = true
    } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate size parameter
    const validSizes = ['1024x1024', '1792x1024', '1024x1792']
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: `Invalid size. Must be one of: ${validSizes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate count
    if (count < 1 || count > 4) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 4' },
        { status: 400 }
      )
    }

    let enhancedPrompt = prompt

    // Enhance prompt with AI if requested
    if (enhance_prompt) {
      try {
        const enhancement = await aiEngine.chatWithClaude([{
          role: 'user',
          content: `Enhance this image generation prompt for DALL-E 3. Make it more detailed and specific while maintaining the original intent. Focus on visual details, composition, lighting, and style.

Original prompt: "${prompt}"
Desired style: ${style}

Return only the enhanced prompt, no explanation:`
        }])

        enhancedPrompt = enhancement.trim().replace(/^"|"$/g, '') // Remove quotes if present
      } catch (error) {
        logger.info('Prompt enhancement failed, using original:', error)
      }
    }

    // Apply style modifications
    const styleModifiers = {
      realistic: 'photorealistic, high quality, detailed',
      artistic: 'artistic style, creative interpretation, stylized',
      cartoon: 'cartoon style, animated, colorful, fun',
      minimalist: 'minimalist design, clean, simple, elegant',
      vintage: 'vintage style, retro aesthetic, aged look',
      futuristic: 'futuristic design, sci-fi elements, high-tech',
      abstract: 'abstract art, conceptual, non-representational',
      professional: 'professional photography, commercial quality, clean background'
    }

    const finalPrompt = `${enhancedPrompt}, ${styleModifiers[style as keyof typeof styleModifiers] || styleModifiers.realistic}`

    // Generate multiple images if requested
    const results = []
    const errors = []

    for (let i = 0; i < count; i++) {
      try {
        // Add slight variation for multiple images
        const variationPrompt = count > 1 
          ? `${finalPrompt}, variation ${i + 1}`
          : finalPrompt

        const imageUrl = await aiEngine.generateImageWithDALLE(
          variationPrompt,
          size as '1024x1024' | '1792x1024' | '1024x1792'
        )

        if (imageUrl) {
          results.push({
            url: imageUrl,
            prompt: variationPrompt,
            size,
            style,
            index: i + 1
          })
        } else {
          errors.push(`Failed to generate image ${i + 1}`)
        }
      } catch (error) {
        logger.error(`Image generation ${i + 1} failed:`, error)
        errors.push(`Image ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    if (results.length === 0) {
      return NextResponse.json(
        { 
          error: 'All image generations failed',
          details: errors
        },
        { status: 500 }
      )
    }

    // Generate alt text for accessibility
    const altTexts: string[] = []
    if (results.length > 0) {
      try {
        const altTextPrompt = `Generate concise alt text (under 125 characters) for an image with this description: "${prompt}". Focus on the main subject and key visual elements.`
        const altText = await aiEngine.chatWithClaude([{
          role: 'user',
          content: altTextPrompt
        }])
        
        altTexts.push(altText.trim().substring(0, 125))
      } catch (error) {
        logger.info('Alt text generation failed:', error)
        altTexts.push(`Generated image: ${prompt.substring(0, 100)}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        images: results.map((result, index) => ({
          ...result,
          altText: altTexts[index] || altTexts[0] || `Generated image ${index + 1}`
        })),
        originalPrompt: prompt,
        enhancedPrompt: enhancedPrompt,
        finalPrompt,
        metadata: {
          style,
          size,
          requested: count,
          generated: results.length,
          failed: errors.length,
          errors: errors.length > 0 ? errors : undefined,
          timestamp: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    logger.error('Image Generation API Error:', error)
    
    // Handle specific DALL-E errors
    if (error instanceof Error) {
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'Content policy violation', details: 'The prompt violates OpenAI content policy' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', details: 'Too many requests, please try again later' },
          { status: 429 }
        )
      }

      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Service configuration error', details: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate image',
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
      endpoint: '/api/ai/image/generate',
      description: 'AI-powered image generation using DALL-E 3',
      usage: {
        method: 'POST',
        body: {
          prompt: 'Image description (required)',
          style: 'Image style (optional)',
          size: 'Image dimensions (optional)',
          count: 'Number of images 1-4 (optional)',
          enhance_prompt: 'Auto-enhance prompt with AI (optional)'
        }
      },
      parameters: {
        styles: [
          'realistic - Photorealistic images',
          'artistic - Creative and stylized',
          'cartoon - Animated and colorful',
          'minimalist - Clean and simple',
          'vintage - Retro aesthetic',
          'futuristic - Sci-fi and high-tech',
          'abstract - Conceptual art',
          'professional - Commercial quality'
        ],
        sizes: [
          '1024x1024 - Square format',
          '1792x1024 - Landscape format',
          '1024x1792 - Portrait format'
        ]
      },
      features: [
        'DALL-E 3 integration',
        'Prompt enhancement with Claude',
        'Multiple style options',
        'Batch generation (up to 4 images)',
        'Automatic alt text generation',
        'Content policy compliance',
        'Error handling and retries'
      ],
      limits: {
        maxImages: 4,
        rateLimits: '50 requests per hour',
        contentPolicy: 'OpenAI content policy applies'
      }
    }
  })
}