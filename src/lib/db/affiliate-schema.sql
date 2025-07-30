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
  user_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL
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
  referred_user_id UUID REFERENCES auth.users(id) NOT NULL,
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
