import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email/resend'

interface AcceptInviteRequest {
  password: string
  confirmPassword: string
}

interface InviteParams {
  code: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: InviteParams }
) {
  try {
    const { code } = params
    const body: AcceptInviteRequest = await request.json()
    const { password, confirmPassword } = body

    // Validate input
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirmation are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Fetch and validate invite
    const { data: invite, error: inviteError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('invite_code', code)
      .single()

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    // Check invite validity
    const now = new Date()
    const expiresAt = new Date(invite.expires_at)

    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'Invite has already been used or revoked' },
        { status: 410 }
      )
    }

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 410 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser?.users?.find(user => user.email === invite.email)

    if (userExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: invite.email,
      password: password,
      email_confirm: true, // Auto-confirm email since they were invited
      user_metadata: {
        name: invite.name,
        role: 'creator_partner',
        invited_by: invite.created_by,
        referral_code: invite.referral_code
      }
    })

    if (authError || !authData.user) {
      logger.error('Auth user creation error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: invite.name,
        email: invite.email,
        role: 'creator_partner',
        instagram: invite.instagram,
        invited_by: invite.created_by
      })

    if (profileError) {
      logger.error('Profile creation error:', profileError)
      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Update affiliate status and link to user
    const { error: updateError } = await supabase
      .from('affiliates')
      .update({
        status: 'accepted',
        user_id: authData.user.id
      })
      .eq('id', invite.id)

    if (updateError) {
      logger.error('Affiliate update error:', updateError)
      // Continue - this is not critical for the user experience
    }

    // Send welcome email
    try {
      await sendWelcomeEmail({
        id: invite.id,
        name: invite.name,
        email: invite.email,
        instagram: invite.instagram,
        invite_code: invite.invite_code,
        referral_code: invite.referral_code
      })
    } catch (emailError) {
      logger.error('Welcome email error:', emailError)
      // Don't fail the request if email fails
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: invite.name,
        referralCode: invite.referral_code
      },
      redirectUrl: '/dashboard'
    })

  } catch (error) {
    logger.error('Accept invite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
