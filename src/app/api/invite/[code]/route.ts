import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface InviteParams {
  code: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: InviteParams }
) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Fetch invite details
    const { data: invite, error } = await supabase
      .from('affiliates')
      .select('id, name, email, instagram, invite_code, referral_code, status, expires_at, created_by')
      .eq('invite_code', code)
      .single()

    if (error || !invite) {
      return NextResponse.json(
        { valid: false, error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Check if invite is still valid
    const now = new Date()
    const expiresAt = new Date(invite.expires_at)

    if (invite.status !== 'pending') {
      return NextResponse.json(
        {
          valid: false,
          error: invite.status === 'accepted' ? 'Invite has already been used' : 'Invite has been revoked'
        },
        { status: 410 }
      )
    }

    if (now > expiresAt) {
      return NextResponse.json(
        { valid: false, error: 'Invite has expired' },
        { status: 410 }
      )
    }

    // Get creator info (who sent the invite)
    const { data: creator } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', invite.created_by)
      .single()

    // Return valid invite details
    return NextResponse.json({
      valid: true,
      invite: {
        id: invite.id,
        name: invite.name,
        email: invite.email,
        instagram: invite.instagram,
        inviteCode: invite.invite_code,
        referralCode: invite.referral_code,
        createdBy: creator?.name || 'TD Studios',
        expiresAt: invite.expires_at
      }
    })

  } catch (error) {
    logger.error('Validate invite error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
