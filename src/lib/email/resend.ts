import { logger } from '@/lib/logger';
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface Affiliate {
  id: string
  name: string
  email: string
  instagram?: string
  invite_code: string
  referral_code: string
}

interface CommissionNotification {
  affiliate: Affiliate
  amount: number
  referralName: string
  totalEarnings: number
}

export async function sendAffiliateInvite(affiliate: Affiliate) {
  if (!resend) {
    console.warn('Resend client not configured')
    return { success: false, error: 'Email service not configured' }
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${affiliate.invite_code}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tyler DiOrio <tyler@tdstudiosny.com>',
      to: [affiliate.email],
      subject: `🚀 You're Invited: Join TD Studios Partner Program (50% Commission!)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>TD Studios Partner Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">TD Studios</h1>
            <p style="color: #64748b; margin: 5px 0;">Creator Partner Program</p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Hey ${affiliate.name}! 👋</h2>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">You've been personally invited to join our exclusive Creator Partner Program</p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">🎯 What You Get:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li><strong>50% Commission</strong> on all referrals (industry-leading rate)</li>
              <li><strong>Personal Referral Code:</strong> ${affiliate.referral_code}</li>
              <li><strong>Real-time Dashboard</strong> to track earnings</li>
              <li><strong>AI-Powered Tools</strong> for content creation</li>
              <li><strong>Priority Support</strong> from our team</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
              Accept Invitation & Set Up Account
            </a>
          </div>

          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #047857; margin: 0 0 10px 0;">💰 Earning Potential:</h4>
            <p style="color: #065f46; margin: 0;">With our average customer value of $297/month, each referral earns you <strong>$148.50 monthly recurring commission</strong>. Just 10 active referrals = $1,485/month passive income!</p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p><strong>Next Steps:</strong></p>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Click the invitation link above</li>
              <li>Set your secure password</li>
              <li>Access your partner dashboard</li>
              <li>Start sharing your referral code: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 3px;">${affiliate.referral_code}</code></li>
            </ol>

            <p style="margin-top: 20px;">
              Questions? Reply to this email or reach out on Instagram ${affiliate.instagram ? `@${affiliate.instagram.replace('@', '')}` : ''}
            </p>

            <p style="margin-top: 20px;">
              Best,<br>
              <strong>Tyler DiOrio</strong><br>
              Founder, TD Studios
            </p>

            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
              This invitation expires in 7 days. If you have any issues, contact us at tyler@tdstudiosny.com
            </p>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      logger.error('Failed to send affiliate invite:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    logger.error('Email service error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(affiliate: Affiliate) {
  if (!resend) {
    console.warn('Resend client not configured')
    return { success: false, error: 'Email service not configured' }
  }

  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/signup?ref=${affiliate.referral_code}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tyler DiOrio <tyler@tdstudiosny.com>',
      to: [affiliate.email],
      subject: `🎉 Welcome to TD Studios! Your Referral Code: ${affiliate.referral_code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome to TD Studios Partners</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🎉 Welcome to TD Studios!</h1>
            <p style="color: #64748b; margin: 5px 0;">Your partner account is now active</p>
          </div>

          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0;">Hi ${affiliate.name}! 🚀</h2>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your TD Studios partner account is ready!</p>
          </div>

          <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">🎯 Your Personal Referral Code</h3>
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <code style="font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 2px;">${affiliate.referral_code}</code>
            </div>
            <p style="color: #92400e; margin: 10px 0 0 0; font-size: 14px;">Share this code to earn 50% commission on every referral!</p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">🔗 Your Referral Links:</h3>
            <div style="margin-bottom: 15px;">
              <strong>Direct Signup Link:</strong><br>
              <a href="${referralUrl}" style="color: #2563eb; word-break: break-all;">${referralUrl}</a>
            </div>
            <div>
              <strong>Share Text:</strong><br>
              <em style="color: #64748b;">"Join TD Studios with my code ${affiliate.referral_code} and get access to powerful AI tools! 🚀"</em>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
              Access Your Partner Dashboard
            </a>
          </div>

          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #047857; margin: 0 0 10px 0;">💰 Commission Structure:</h4>
            <ul style="color: #065f46; margin: 10px 0; padding-left: 20px;">
              <li><strong>50% Commission</strong> on all payments from your referrals</li>
              <li><strong>Recurring Income</strong> - earn every month they stay subscribed</li>
              <li><strong>Real-time Tracking</strong> - see your earnings instantly</li>
              <li><strong>Monthly Payouts</strong> - automatic via Stripe</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p><strong>Pro Tips for Success:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Share your personal experience with TD Studios</li>
              <li>Post on social media with your referral code</li>
              <li>Create content showing the AI tools in action</li>
              <li>Engage with your audience about productivity and AI</li>
            </ul>

            <p style="margin-top: 20px;">
              Need help or have questions? I'm here to support your success!<br>
              Email: tyler@tdstudiosny.com
            </p>

            <p style="margin-top: 20px;">
              Excited to see your success,<br>
              <strong>Tyler DiOrio</strong><br>
              Founder, TD Studios
            </p>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      logger.error('Failed to send welcome email:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    logger.error('Email service error:', error)
    throw error
  }
}

export async function sendCommissionNotification(notification: CommissionNotification) {
  if (!resend) {
    console.warn('Resend client not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tyler DiOrio <tyler@tdstudiosny.com>',
      to: [notification.affiliate.email],
      subject: `💰 New Commission Earned: $${notification.amount.toFixed(2)} from ${notification.referralName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>New Commission Earned</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">💰 Commission Earned!</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">You just earned money from a referral</p>
          </div>

          <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0;">New Commission</h2>
            <div style="font-size: 36px; font-weight: bold; color: #059669; margin: 10px 0;">
              $${notification.amount.toFixed(2)}
            </div>
            <p style="color: #92400e; margin: 0;">From referral: <strong>${notification.referralName}</strong></p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">📊 Your Stats:</h3>
            <div style="display: grid; gap: 15px;">
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                <strong style="color: #059669;">Total Earnings:</strong> $${notification.totalEarnings.toFixed(2)}
              </div>
              <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                <strong style="color: #1d4ed8;">Referral Code:</strong> ${notification.affiliate.referral_code}
              </div>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
              View Full Dashboard
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px; text-align: center;">
            <p>Keep up the great work! 🚀</p>
            <p style="margin-top: 15px;">
              <strong>Tyler DiOrio</strong><br>
              TD Studios
            </p>
          </div>
        </body>
        </html>
      `
    })

    if (error) {
      logger.error('Failed to send commission notification:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    logger.error('Email service error:', error)
    throw error
  }
}
