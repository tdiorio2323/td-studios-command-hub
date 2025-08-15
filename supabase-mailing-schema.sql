-- Supabase Schema for TD Studios Email Capture & Mailing List
-- Run this in your Supabase SQL editor: https://app.supabase.com/project/xsfiadcympwrpqluwqua/sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create mailing_list_subscribers table
CREATE TABLE IF NOT EXISTS mailing_list_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  source VARCHAR(100) DEFAULT 'tdstudiosdigital.com',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'pending')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_link_requests table
CREATE TABLE IF NOT EXISTS creator_link_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  requested_username VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mailing_list_email ON mailing_list_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_mailing_list_status ON mailing_list_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_mailing_list_source ON mailing_list_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_mailing_list_subscribed_at ON mailing_list_subscribers(subscribed_at);

CREATE INDEX IF NOT EXISTS idx_creator_requests_email ON creator_link_requests(email);
CREATE INDEX IF NOT EXISTS idx_creator_requests_status ON creator_link_requests(status);
CREATE INDEX IF NOT EXISTS idx_creator_requests_requested_at ON creator_link_requests(requested_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_mailing_list_subscribers_updated_at
  BEFORE UPDATE ON mailing_list_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_link_requests_updated_at
  BEFORE UPDATE ON creator_link_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE mailing_list_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_link_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert for new subscriptions
CREATE POLICY "Allow public insert for mailing list"
  ON mailing_list_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public insert for creator requests
CREATE POLICY "Allow public insert for creator requests"
  ON creator_link_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view their own mailing list data"
  ON mailing_list_subscribers
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Policy: Users can view their own creator requests
CREATE POLICY "Users can view their own creator requests"
  ON creator_link_requests
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Policy: Allow service role full access (for backend operations)
CREATE POLICY "Service role full access mailing list"
  ON mailing_list_subscribers
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access creator requests"
  ON creator_link_requests
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a view for mailing list statistics
CREATE OR REPLACE VIEW mailing_list_stats AS
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(*) FILTER (WHERE status = 'active') as active_subscribers,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE subscribed_at >= NOW() - INTERVAL '30 days') as new_this_month,
  COUNT(*) FILTER (WHERE subscribed_at >= NOW() - INTERVAL '7 days') as new_this_week,
  COUNT(DISTINCT source) as unique_sources
FROM mailing_list_subscribers;

-- Create a view for creator request statistics
CREATE OR REPLACE VIEW creator_request_stats AS
SELECT 
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
  COUNT(*) FILTER (WHERE requested_at >= NOW() - INTERVAL '30 days') as new_this_month
FROM creator_link_requests;

-- Insert some sample data for testing (optional)
INSERT INTO mailing_list_subscribers (email, name, source, status) VALUES
  ('tyler.diorio@gmail.com', 'Tyler DiOrio', 'tdstudiosdigital.com', 'active'),
  ('demo@tdstudios.com', 'Demo User', 'tdstudiosdigital.com', 'active')
ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON mailing_list_subscribers TO anon, authenticated;
GRANT SELECT, INSERT ON creator_link_requests TO anon, authenticated;
GRANT SELECT ON mailing_list_stats TO authenticated;
GRANT SELECT ON creator_request_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE mailing_list_subscribers IS 'Stores email subscribers for TD Studios mailing list';
COMMENT ON TABLE creator_link_requests IS 'Stores requests for creator link pages';
COMMENT ON COLUMN mailing_list_subscribers.source IS 'Source where the user subscribed from (e.g., tdstudiosdigital.com, cabana, etc.)';
COMMENT ON COLUMN mailing_list_subscribers.metadata IS 'Additional data like IP, user agent, etc.';
COMMENT ON COLUMN creator_link_requests.requested_username IS 'Preferred username for their creator link page';

-- Success message
SELECT 'TD Studios Mailing List Schema Created Successfully!' as message;