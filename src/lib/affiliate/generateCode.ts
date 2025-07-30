import { supabaseAdmin } from '@/lib/supabase'

export function generateUniqueCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateReferralCode(name: string): string {
  // Clean name and take first 6 characters + current year
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const year = new Date().getFullYear().toString()
  return cleanName.substring(0, 6) + year.substring(2)
}

export async function ensureUniqueInviteCode(): Promise<string> {
  const supabase = supabaseAdmin
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const code = `TD${generateUniqueCode(6)}`

    const { data } = await supabase
      .from('affiliates')
      .select('invite_code')
      .eq('invite_code', code)
      .single()

    if (!data) {
      return code
    }

    attempts++
  }

  throw new Error('Failed to generate unique invite code after maximum attempts')
}

export async function ensureUniqueReferralCode(name: string): Promise<string> {
  const supabase = supabaseAdmin
  let attempts = 0
  const maxAttempts = 10
  const baseCode = generateReferralCode(name)

  while (attempts < maxAttempts) {
    const code = attempts === 0 ? baseCode : `${baseCode}${attempts}`

    const { data } = await supabase
      .from('affiliates')
      .select('referral_code')
      .eq('referral_code', code)
      .single()

    if (!data) {
      return code
    }

    attempts++
  }

  throw new Error('Failed to generate unique referral code after maximum attempts')
}
