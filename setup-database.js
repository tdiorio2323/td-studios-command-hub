#!/usr/bin/env node

/**
 * TD Studios - Complete Database Setup
 * Creates the SQL file to run in Supabase dashboard
 */

const fs = require('fs');
const path = require('path');

console.log('🗄️ TD Studios - Database Setup\n');

// Read the schema files
const coreSchemaPath = path.join(__dirname, 'src/lib/db/schema.sql');
const affiliateSchemaPath = path.join(__dirname, 'src/lib/db/affiliate-schema.sql');

if (!fs.existsSync(coreSchemaPath) || !fs.existsSync(affiliateSchemaPath)) {
  console.error('❌ Schema files not found!');
  console.log('Looking for:');
  console.log('- src/lib/db/schema.sql');
  console.log('- src/lib/db/affiliate-schema.sql');
  process.exit(1);
}

const coreSchema = fs.readFileSync(coreSchemaPath, 'utf8');
const affiliateSchema = fs.readFileSync(affiliateSchemaPath, 'utf8');

// Create comprehensive setup SQL
const completeSetupSQL = `
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

${coreSchema}

-- =============================================
-- Step 3: Affiliate System Tables
-- =============================================

${affiliateSchema.replace(/auth\.users\(id\)/g, 'public.profiles(id)')}

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
`;

// Write the complete setup file
const outputPath = path.join(__dirname, 'complete-database-setup.sql');
fs.writeFileSync(outputPath, completeSetupSQL);

console.log('✅ Complete database setup SQL generated!');
console.log(`📁 Saved to: ${outputPath}`);
console.log('\n📋 Next Steps:');
console.log('1. Copy the SQL from complete-database-setup.sql');
console.log('2. Go to: https://app.supabase.com/project/xsfiadcympwrpqluwqua/sql/new');
console.log('3. Paste and run the SQL');
console.log('4. Promote yourself to admin with your email');
console.log('\n🚀 Your database will be fully set up!');
