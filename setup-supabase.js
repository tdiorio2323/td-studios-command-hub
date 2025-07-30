#!/usr/bin/env node

/**
 * TD Studios HQ - Supabase Setup Script
 * This script helps you configure your Supabase connection
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TD Studios HQ - Supabase Setup');
console.log('=====================================\n');

console.log('✅ Your Supabase project: xsfiadcympwrpqluwqua TD STUDIOS HQ');
console.log('📍 Project URL: https://xsfiadcympwrpqluwqua.supabase.co\n');

console.log('📋 SETUP INSTRUCTIONS:');
console.log('======================\n');

console.log('1. 🔑 Get your Supabase keys from: https://app.supabase.com/project/xsfiadcympwrpqluwqua/settings/api');
console.log('   - ANON (public) key');
console.log('   - SERVICE_ROLE (secret) key\n');

console.log('2. 📊 Set up the database tables:');
console.log('   - Go to: https://app.supabase.com/project/xsfiadcympwrpqluwqua/sql/new');
console.log('   - Copy and run the SQL from: src/lib/db/schema.sql\n');

console.log('3. 🔧 Add to your .env.local file:');
console.log(`
NEXT_PUBLIC_SUPABASE_URL="https://xsfiadcympwrpqluwqua.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."  # Your anon key
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."      # Your service role key
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xsfiadcympwrpqluwqua.supabase.co:5432/postgres"
`);

console.log('4. 🧪 Test the connection:');
console.log('   npm run dev');
console.log('   Visit: http://localhost:3000/api/test\n');

console.log('5. 📈 Initialize sample data (optional):');
console.log('   - Users table will be populated when you first sign up');
console.log('   - Usage logs will start tracking automatically');
console.log('   - Analytics will begin collecting data\n');

console.log('🔧 NEXT STEPS AFTER SETUP:');
console.log('==========================');
console.log('• Enable Row Level Security (RLS) policies');
console.log('• Set up authentication providers (Google, GitHub, etc.)');
console.log('• Configure real-time subscriptions');
console.log('• Set up backup and monitoring\n');

console.log('💡 Pro Tips:');
console.log('• Keep your SERVICE_ROLE key secret - it has admin access');
console.log('• The ANON key is safe to use in your frontend');
console.log('• Use environment variables for all sensitive data\n');

console.log('🆘 Need help?');
console.log('• Supabase Docs: https://supabase.com/docs');
console.log('• TD Studios Support: Create an issue in the repo\n');

// Check if schema file exists
const schemaPath = path.join(__dirname, 'src/lib/db/schema.sql');
if (fs.existsSync(schemaPath)) {
  console.log('✅ Database schema found at: src/lib/db/schema.sql');
} else {
  console.log('❌ Database schema not found. Please check src/lib/db/schema.sql');
}

// Check if Supabase client exists
const clientPath = path.join(__dirname, 'src/lib/supabase.ts');
if (fs.existsSync(clientPath)) {
  console.log('✅ Supabase client configured at: src/lib/supabase.ts');
} else {
  console.log('❌ Supabase client not found. Please check src/lib/supabase.ts');
}

console.log('\n🎉 Ready to connect TD Studios to your Supabase database!');
console.log('   Run this script again after setup to verify configuration.\n');
