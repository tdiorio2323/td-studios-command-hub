import { useState, useCallback } from 'react'

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
  details?: string
}

export interface UseAIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useAI(options: UseAIOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callAPI = useCallback(async (endpoint: string, data: any): Promise<AIResponse> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        options.onSuccess?.(result.data)
        return result
      } else {
        const errorMessage = result.error || 'Unknown error occurred'
        setError(errorMessage)
        options.onError?.(errorMessage)
        return result
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
      options.onError?.(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [options])

  // Specific AI functions
  const chat = useCallback(async (messages: any[], model = 'claude') => {
    return callAPI('/api/ai/chat', { messages, model })
  }, [callAPI])

  const prioritizeTasks = useCallback(async (tasks: string[], context?: string) => {
    return callAPI('/api/ai/tasks/prioritize', { tasks, context })
  }, [callAPI])

  const generateContent = useCallback(async (type: string, prompt: string, options: any = {}) => {
    return callAPI('/api/ai/content/generate', { type, prompt, ...options })
  }, [callAPI])

  const analyzeImage = useCallback(async (imageUrl: string, prompt?: string, analysisType = 'general') => {
    return callAPI('/api/ai/image/analyze', { imageUrl, prompt, analysis_type: analysisType })
  }, [callAPI])

  const generateImage = useCallback(async (prompt: string, options: any = {}) => {
    return callAPI('/api/ai/image/generate', { prompt, ...options })
  }, [callAPI])

  return {
    loading,
    error,
    chat,
    prioritizeTasks,
    generateContent,
    analyzeImage,
    generateImage,
    callAPI
  }
}