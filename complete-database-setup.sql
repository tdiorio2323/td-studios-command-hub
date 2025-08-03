-- TD STUDIOS ULTIMATE - COMPLETE DATABASE SETUP
-- Copy and paste this into Supabase SQL Editor and run it

-- ===========================================
-- STEP 1: MAIN APPLICATION SCHEMA
-- ===========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL, -- active, canceled, past_due, etc
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL, -- claude, gpt, dalle, etc
  endpoint TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment history table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- STEP 2: PROFILES TABLE FOR ADMIN ROLES
-- ===========================================

-- Profiles table for role management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'affiliate')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- STEP 3: AFFILIATE SYSTEM SCHEMA
-- ===========================================

-- Affiliates Table
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  instagram VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) NOT NULL,
  referral_code VARCHAR(20) NOT NULL,
  signup_date TIMESTAMP DEFAULT NOW(),
  first_payment_date TIMESTAMP,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'churned')),
  UNIQUE(referred_user_id)
);

-- Commission Payments Table
CREATE TABLE IF NOT EXISTS public.commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  referral_id UUID REFERENCES public.referrals(id) NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(3,2) DEFAULT 0.50,
  commission_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  payment_date TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

-- ===========================================
-- STEP 4: INDEXES FOR PERFORMANCE
-- ===========================================

-- Main schema indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- Affiliate schema indexes
CREATE INDEX IF NOT EXISTS idx_invite_code ON public.affiliates(invite_code);
CREATE INDEX IF NOT EXISTS idx_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_email ON public.affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_status ON public.affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referred_user ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payments ON public.commission_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON public.commission_payments(payment_date);

-- ===========================================
-- STEP 5: ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_payments ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- STEP 6: SECURITY POLICIES
-- ===========================================

-- Main schema policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Affiliate policies
CREATE POLICY "Admins manage affiliates" ON public.affiliates
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Affiliates view own data" ON public.affiliates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Validate invite codes" ON public.affiliates
  FOR SELECT USING (status = 'pending' AND expires_at > NOW());

-- Referrals policies
CREATE POLICY "Affiliates view own referrals" ON public.referrals
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins view all referrals" ON public.referrals
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Commission policies
CREATE POLICY "Affiliates view own commissions" ON public.commission_payments
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM public.affiliates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage commissions" ON public.commission_payments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- ===========================================
-- STEP 7: HELPER FUNCTIONS
-- ===========================================

-- Generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(creator_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  final_code TEXT;
  counter INT := 1;
BEGIN
  -- Create base code from name + year
  base_code := UPPER(LEFT(REGEXP_REPLACE(creator_name, '[^a-zA-Z]', '', 'g'), 6)) || EXTRACT(YEAR FROM NOW())::TEXT;
  final_code := base_code;

  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.affiliates WHERE referral_code = final_code) LOOP
    final_code := base_code || counter::TEXT;
    counter := counter + 1;
  END LOOP;

  RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- STEP 8: PERFORMANCE VIEWS
-- ===========================================

-- Affiliate performance view
CREATE OR REPLACE VIEW affiliate_performance AS
SELECT
  a.id,
  a.name,
  a.email,
  a.referral_code,
  a.created_at,
  COALESCE(stats.total_referrals, 0) as total_referrals,
  COALESCE(stats.total_revenue, 0) as total_revenue,
  COALESCE(stats.total_commission, 0) as total_commission,
  COALESCE(stats.active_referrals, 0) as active_referrals
FROM public.affiliates a
LEFT JOIN (
  SELECT
    r.affiliate_id,
    COUNT(*) as total_referrals,
    SUM(r.total_revenue) as total_revenue,
    SUM(r.total_commission) as total_commission,
    COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals
  FROM public.referrals r
  GROUP BY r.affiliate_id
) stats ON a.id = stats.affiliate_id
WHERE a.status = 'accepted';

-- ===========================================
-- STEP 9: SETUP COMPLETE MESSAGE
-- ===========================================

-- Insert a test admin user (you'll need to replace with your actual user ID)
-- Run this separately after you have a user account
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (auth.uid(), 'your-email@domain.com', 'Your Name', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Success message
SELECT 'TD Studios Ultimate Database Setup Complete! 🚀' as setup_status;
