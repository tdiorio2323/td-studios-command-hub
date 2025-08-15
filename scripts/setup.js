#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const SETUP_MODES = {
  all: 'Complete setup (Database, APIs, Integrations)',
  db: 'Database setup only',
  api: 'API keys configuration',
  integrations: 'Third-party integrations',
  affiliate: 'Affiliate system setup'
};

async function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExample = `
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=http://localhost:3000

# AI APIs
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Redis Cache
REDIS_URL=
`.trim();

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Created .env.local file');
  }
}

async function setupDatabase() {
  console.log('\n📦 Setting up database...');
  try {
    execSync('npm run db:generate', { stdio: 'inherit' });
    execSync('npm run db:push', { stdio: 'inherit' });
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

async function setupAPIs() {
  console.log('\n🔑 Configuring API keys...');
  
  const apis = {
    OPENAI_API_KEY: await question('OpenAI API Key (or press Enter to skip): '),
    ANTHROPIC_API_KEY: await question('Anthropic API Key (or press Enter to skip): '),
    STRIPE_SECRET_KEY: await question('Stripe Secret Key (or press Enter to skip): '),
    RESEND_API_KEY: await question('Resend API Key (or press Enter to skip): ')
  };

  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf-8');
  
  for (const [key, value] of Object.entries(apis)) {
    if (value) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    }
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ API keys configured');
}

async function setupIntegrations() {
  console.log('\n🔗 Setting up integrations...');
  
  // Create necessary directories
  const dirs = ['public/uploads', 'logs', 'temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created ${dir} directory`);
    }
  });

  // Install dependencies if needed
  console.log('📦 Checking dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

async function setupAffiliate() {
  console.log('\n💰 Setting up affiliate system...');
  
  const config = {
    commission_rate: 0.2,
    cookie_duration: 30,
    minimum_payout: 50,
    payment_methods: ['stripe', 'paypal']
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'config/affiliate.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('✅ Affiliate system configured');
}

function generateSecret() {
  return Buffer.from(Math.random().toString(36).substring(2) + Date.now()).toString('base64');
}

async function main() {
  console.log('🚀 TD Studios Command Hub Setup\n');
  console.log('Available setup modes:');
  
  Object.entries(SETUP_MODES).forEach(([key, desc]) => {
    console.log(`  ${key}: ${desc}`);
  });
  
  const mode = await question('\nSelect setup mode (all/db/api/integrations/affiliate): ');
  
  await setupEnvironment();
  
  switch(mode) {
    case 'all':
      await setupDatabase();
      await setupAPIs();
      await setupIntegrations();
      await setupAffiliate();
      break;
    case 'db':
      await setupDatabase();
      break;
    case 'api':
      await setupAPIs();
      break;
    case 'integrations':
      await setupIntegrations();
      break;
    case 'affiliate':
      await setupAffiliate();
      break;
    default:
      console.log('Invalid mode selected');
  }
  
  console.log('\n✅ Setup complete!');
  console.log('Run `npm run dev` to start the development server');
  
  rl.close();
}

main().catch(console.error);