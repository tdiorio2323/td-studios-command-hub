import { ensureUniqueInviteCode, ensureUniqueReferralCode } from '@/lib/affiliate/generateCode'
import { sendAffiliateInvite } from '@/lib/email/resend'
import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

interface CreateInviteRequest {
  name: string
  email: string
  instagram?: string
}

export async function POST(request: NextRequest) {
  try {
    // Get current user and verify admin role
    const supabase = supabaseAdmin
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body: CreateInviteRequest = await request.json()
    const { name, email, instagram } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if affiliate already exists with this email
    const { data: existingAffiliate } = await supabase
      .from('affiliates')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'An affiliate with this email already exists' },
        { status: 409 }
      )
    }

    // Generate unique codes
    const inviteCode = await ensureUniqueInviteCode()
    const referralCode = await ensureUniqueReferralCode(name)

    // Create affiliate record
    const { data: affiliate, error: insertError } = await supabase
      .from('affiliates')
      .insert({
        name,
        email,
        instagram: instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : null,
        invite_code: inviteCode,
        referral_code: referralCode,
        created_by: user.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create affiliate invite' },
        { status: 500 }
      )
    }

    // Send invite email
    try {
      await sendAffiliateInvite(affiliate)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails - the invite was created
      console.warn('Affiliate invite created but email failed to send')
    }

    // Return success response
    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${inviteCode}`

    return NextResponse.json({
      success: true,
      inviteCode,
      referralCode,
      inviteUrl,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        instagram: affiliate.instagram,
        status: affiliate.status,
        created_at: affiliate.created_at
      }
    })

  } catch (error) {
    console.error('Create affiliate invite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch all affiliate invites for admin
export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all affiliates with performance data
    const { data: affiliates, error } = await supabase
      .from('affiliate_performance')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch affiliates error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch affiliates' },
        { status: 500 }
      )
    }

    return NextResponse.json({ affiliates })

  } catch (error) {
    console.error('Get affiliates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
