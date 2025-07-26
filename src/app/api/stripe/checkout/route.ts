import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRICING_PLANS } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { priceId, planType, userEmail } = await req.json()

    if (!priceId || !planType || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        planType,
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          planType,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}