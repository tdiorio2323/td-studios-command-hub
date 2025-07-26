import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Create or update the user
        const { data: user, error: userError } = await supabase
          .from('users')
          .upsert({
            email: session.customer_email,
            stripe_customer_id: session.customer,
          })
          .select()
          .single()

        if (userError) throw userError

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        // Store subscription in database
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            plan_name: subscription.items.data[0].price.nickname || 'Unknown',
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          })

        if (subError) throw subError
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0].price.id,
            plan_name: subscription.items.data[0].price.nickname || 'Unknown',
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Mark subscription as canceled
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        
        // Get user by stripe customer id
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', invoice.customer)
          .single()

        if (userError) throw userError

        // Record payment
        const { error } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            stripe_payment_intent_id: invoice.payment_intent,
            amount_cents: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            description: invoice.description,
          })

        if (error) throw error
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}