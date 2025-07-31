import { sendCommissionNotification } from '@/lib/email/resend'
import { supabaseAdmin } from '@/lib/supabase'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// This should be imported from your Stripe configuration
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object, supabase)
        break

      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any, supabase: any) {
  try {
    // Get customer and user information from metadata
    const customerId = paymentIntent.customer
    const userId = paymentIntent.metadata?.user_id

    if (!userId) {
      console.log('No user ID in payment metadata, skipping commission tracking')
      return
    }

    // Check if this user was referred by an affiliate
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select(`
        *,
        affiliates (
          id,
          name,
          email,
          referral_code,
          user_id
        )
      `)
      .eq('referred_user_id', userId)
      .single()

    if (referralError || !referral) {
      console.log('No referral found for user:', userId)
      return
    }

    const paymentAmount = paymentIntent.amount / 100 // Convert from cents
    const commissionAmount = paymentAmount * 0.50 // 50% commission

    // Record the commission payment
    const { error: commissionError } = await supabase
      .from('commission_payments')
      .insert({
        affiliate_id: referral.affiliate_id,
        referral_id: referral.id,
        payment_amount: paymentAmount,
        commission_rate: 0.50,
        commission_amount: commissionAmount,
        stripe_payment_intent_id: paymentIntent.id,
        processed: true
      })

    if (commissionError) {
      console.error('Failed to record commission payment:', commissionError)
      return
    }

    // Update referral totals
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        total_revenue: referral.total_revenue + paymentAmount,
        total_commission: referral.total_commission + commissionAmount,
        first_payment_date: referral.first_payment_date || new Date().toISOString()
      })
      .eq('id', referral.id)

    if (updateError) {
      console.error('Failed to update referral totals:', updateError)
    }

    // Get referred user details for notification
    const { data: referredUser } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single()

    // Calculate total earnings for this affiliate
    const { data: totalCommissions } = await supabase
      .from('commission_payments')
      .select('commission_amount')
      .eq('affiliate_id', referral.affiliate_id)

    const totalEarnings = totalCommissions?.reduce((sum, payment) => sum + payment.commission_amount, 0) || 0

    // Send commission notification email
    try {
      await sendCommissionNotification({
        affiliate: referral.affiliates,
        amount: commissionAmount,
        referralName: referredUser?.name || 'New Customer',
        totalEarnings: totalEarnings
      })
    } catch (emailError) {
      console.error('Failed to send commission notification:', emailError)
    }

    console.log(`Commission processed: $${commissionAmount} for affiliate ${referral.affiliates.name}`)

  } catch (error) {
    console.error('Error processing payment success:', error)
  }
}

async function handleSubscriptionPayment(invoice: any, supabase: any) {
  // Handle recurring subscription payments the same way
  const paymentIntent = {
    amount: invoice.amount_paid,
    customer: invoice.customer,
    metadata: invoice.metadata,
    id: invoice.payment_intent
  }

  await handlePaymentSuccess(paymentIntent, supabase)
}

// Utility function to validate webhook signature (for additional security)
function validateWebhookSignature(payload: string, signature: string): boolean {
  try {
    stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET
    )
    return true
  } catch (error) {
    return false
  }
}
