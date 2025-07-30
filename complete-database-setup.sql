
-- TD Studios Complete Database Setup
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/xsfiadcympwrpqluwqua/sql/new

-- =============================================
-- Step 1: Profiles Table (Required for RLS)
-- =============================================

-- Profiles table for user roles and extended user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'creator_partner')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Step 2: Core TD Studios Tables
-- =============================================

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

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
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

-- =============================================
-- Step 3: Affiliate System Tables
-- =============================================

-- TD Studios Affiliate System Database Schema
-- Run this in Supabase SQL Editor

-- Affiliates Table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  instagram VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id) NOT NULL
);

-- Optimize with indexes
CREATE INDEX IF NOT EXISTS idx_invite_code ON affiliates(invite_code);
CREATE INDEX IF NOT EXISTS idx_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_email ON affiliates(email);
CREATE INDEX IF NOT EXISTS idx_status ON affiliates(status);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
  referred_user_id UUID REFERENCES public.profiles(id) NOT NULL,
  referral_code VARCHAR(20) NOT NULL,
  signup_date TIMESTAMP DEFAULT NOW(),
  first_payment_date TIMESTAMP,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'churned')),
  UNIQUE(referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_affiliate_referrals ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referred_user ON referrals(referred_user_id);

-- Commission Payments Table
CREATE TABLE IF NOT EXISTS commission_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
  referral_id UUID REFERENCES referrals(id) NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(3,2) DEFAULT 0.50,
  commission_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  payment_date TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_affiliate_payments ON commission_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON commission_payments(payment_date);

-- Row Level Security
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;

-- Policies for affiliates table
DROP POLICY IF EXISTS "Admins manage affiliates" ON affiliates;
CREATE POLICY "Admins manage affiliates" ON affiliates
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Affiliates view own data" ON affiliates;
CREATE POLICY "Affiliates view own data" ON affiliates
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Validate invite codes" ON affiliates;
CREATE POLICY "Validate invite codes" ON affiliates
  FOR SELECT USING (status = 'pending' AND expires_at > NOW());

-- Policies for referrals table
DROP POLICY IF EXISTS "Affiliates view own referrals" ON referrals;
CREATE POLICY "Affiliates view own referrals" ON referrals
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins view all referrals" ON referrals;
CREATE POLICY "Admins view all referrals" ON referrals
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policies for commission_payments table
DROP POLICY IF EXISTS "Affiliates view own commissions" ON commission_payments;
CREATE POLICY "Affiliates view own commissions" ON commission_payments
  FOR SELECT USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage commissions" ON commission_payments;
CREATE POLICY "Admins manage commissions" ON commission_payments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Helper functions
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
  WHILE EXISTS (SELECT 1 FROM affiliates WHERE referral_code = final_code) LOOP
    final_code := base_code || counter::TEXT;
    counter := counter + 1;
  END LOOP;

  RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Create affiliate performance view
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
FROM affiliates a
LEFT JOIN (
  SELECT
    r.affiliate_id,
    COUNT(*) as total_referrals,
    SUM(r.total_revenue) as total_revenue,
    SUM(r.total_commission) as total_commission,
    COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals
  FROM referrals r
  GROUP BY r.affiliate_id
) stats ON a.id = stats.affiliate_id
WHERE a.status = 'accepted';


-- =============================================
-- Step 4: Admin Utility Functions
-- =============================================

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = user_email;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'admin_users', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
    'creator_partners', (SELECT COUNT(*) FROM public.profiles WHERE role = 'creator_partner'),
    'active_subscriptions', (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active'),
    'total_affiliates', (SELECT COUNT(*) FROM public.affiliates WHERE status = 'accepted'),
    'total_referrals', (SELECT COUNT(*) FROM public.referrals),
    'total_revenue_cents', (SELECT COALESCE(SUM(amount_cents), 0) FROM public.payments WHERE status = 'succeeded'),
    'total_commissions_cents', (SELECT COALESCE(SUM(commission_amount * 100), 0) FROM public.commission_payments WHERE processed = true)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Step 5: Sample Data (Optional)
-- =============================================

-- Create a welcome usage log entry for new users
CREATE OR REPLACE FUNCTION create_welcome_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usage_logs (
    user_id,
    service,
    endpoint,
    tokens_used,
    cost_cents,
    metadata
  ) VALUES (
    NEW.id,
    'platform',
    'welcome',
    0,
    0,
    '{"action": "user_created", "welcome": true}'::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create welcome log
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_welcome_log();

-- =============================================
-- Setup Complete!
-- =============================================

-- To make yourself an admin, run:
-- SELECT promote_to_admin('your-email@example.com');

-- To check platform stats, run:
-- SELECT get_platform_stats();
