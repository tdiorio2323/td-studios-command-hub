#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 TD Studios Affiliate System Setup')
console.log('=====================================')

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the project root directory')
  process.exit(1)
}

console.log('\n📋 Setup Checklist:')
console.log('===================')

console.log('\n1. ✅ Database Schema')
console.log('   Run the SQL schema in your Supabase SQL Editor:')
console.log('   📁 File: src/lib/db/affiliate-schema.sql')
console.log('   🌐 Supabase: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql')

console.log('\n2. 📧 Email Configuration (Resend)')
console.log('   Setup steps:')
console.log('   • Sign up at https://resend.com')
console.log('   • Add your domain: tdstudiosny.com')
console.log('   • Get API key from dashboard')
console.log('   • Update .env.local with:')
console.log('     RESEND_API_KEY=re_your_api_key_here')

console.log('\n3. 💳 Stripe Webhook Configuration')
console.log('   Setup steps:')
console.log('   • Go to Stripe Dashboard → Webhooks')
console.log('   • Create endpoint: https://yourdomain.com/api/webhooks/stripe-commission')
console.log('   • Select events: payment_intent.succeeded, invoice.payment_succeeded')
console.log('   • Copy webhook secret to .env.local:')
console.log('     STRIPE_WEBHOOK_ENDPOINT_SECRET=whsec_your_secret_here')

console.log('\n4. 🌐 Environment Variables')
console.log('   Required in .env.local:')
console.log('   • NEXT_PUBLIC_SITE_URL=https://tdstudiosny.com')
console.log('   • FROM_EMAIL=tyler@tdstudiosny.com')
console.log('   • FROM_NAME=Tyler DiOrio - TD Studios')

console.log('\n5. 🔐 Supabase Policies')
console.log('   Ensure your Supabase project has:')
console.log('   • Row Level Security enabled')
console.log('   • Admin role properly configured in profiles table')
console.log('   • API service role key in environment')

console.log('\n6. 🎯 Testing')
console.log('   After setup, test the system:')
console.log('   • Navigate to /dashboard/affiliates')
console.log('   • Create a test invite')
console.log('   • Check email delivery')
console.log('   • Test invite acceptance flow')

console.log('\n💰 Commission Structure:')
console.log('========================')
console.log('• 50% commission on all referral revenue')
console.log('• Automatic tracking via Stripe webhooks')
console.log('• Real-time dashboard updates')
console.log('• Email notifications for new commissions')

console.log('\n📊 Features Included:')
console.log('=====================')
console.log('• ✅ Admin invite generation')
console.log('• ✅ Creator partner registration')
console.log('• ✅ Unique referral codes')
console.log('• ✅ Commission tracking')
console.log('• ✅ Email notifications')
console.log('• ✅ Performance analytics')
console.log('• ✅ Stripe webhook integration')

console.log('\n🔗 Quick Links:')
console.log('===============')
console.log('• Resend Dashboard: https://resend.com/dashboard')
console.log('• Stripe Webhooks: https://dashboard.stripe.com/webhooks')
console.log('• Supabase SQL Editor: https://supabase.com/dashboard')

console.log('\n✨ Ready to launch your affiliate program!')
console.log('   Questions? Contact: tyler@tdstudiosny.com')
console.log('\n' + '='.repeat(50))

// Check current environment
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')

  console.log('\n🔍 Environment Check:')
  console.log('======================')

  const requiredVars = [
    'RESEND_API_KEY',
    'STRIPE_WEBHOOK_ENDPOINT_SECRET',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName)
    const status = hasVar ? '✅' : '❌'
    console.log(`${status} ${varName}`)
  })

  console.log('\nUpdate missing variables in .env.local before testing!')
}
