# 🚀 TD Studios Integration Setup - COMPLETE GUIDE

## ✅ **Current Status**

### Connected Integrations:
- 🤖 **OpenAI (ChatGPT)** - ✅ ACTIVE & WORKING
- 🧠 **Anthropic (Claude)** - ✅ ACTIVE & WORKING

### Ready to Connect:
- 📝 **Notion** - API ready, needs your token
- 📊 **Airtable** - API ready, needs your token
- 💬 **Slack** - API ready, needs your bot token
- 🐙 **GitHub** - API ready, needs your personal access token
- 💳 **Stripe** - API ready, needs your secret key
- 🗄️ **Supabase** - Database ready, needs your keys

---

## 🎯 **What You Need to Do**

### 1. Run the Setup Script
```bash
node setup-integrations.js
```

### 2. Get Your API Keys

#### 📝 **Notion Integration**
1. Go to: https://www.notion.so/my-integrations
2. Create new integration
3. Copy the "Internal Integration Token"
4. Share your databases with this integration
5. Add to .env.local: `NOTION_API_KEY=your_token`

#### 📊 **Airtable Integration**
1. Go to: https://airtable.com/create/tokens
2. Create personal access token
3. Select scopes: `data.records:read`, `data.records:write`
4. Add to .env.local: `AIRTABLE_API_KEY=your_token`

#### 💬 **Slack Integration**
1. Go to: https://api.slack.com/apps
2. Create new app or select existing
3. Go to "OAuth & Permissions"
4. Add scopes: `chat:write`, `users:read`
5. Install app to workspace
6. Copy "Bot User OAuth Token" (starts with "xoxb-")
7. Add to .env.local: `SLACK_BOT_TOKEN=your_token`

#### 🐙 **GitHub Integration**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `user`, `admin:org`
4. Add to .env.local: `GITHUB_TOKEN=your_token`

#### 💳 **Stripe Integration**
1. Go to: https://dashboard.stripe.com/apikeys
2. Copy the "Secret key" (starts with "sk_")
3. Add to .env.local: `STRIPE_SECRET_KEY=your_key`
4. Also add: `STRIPE_PUBLISHABLE_KEY=your_publishable_key`

#### 🗄️ **Supabase Integration**
1. Go to: https://app.supabase.com/project/xsfiadcympwrpqluwqua/settings/api
2. Copy the URL and keys
3. Add to .env.local:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xsfiadcympwrpqluwqua.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

### 3. Test Your Setup
```bash
# Restart server
npm run dev

# Test all integrations
curl http://localhost:3000/api/integrations/test

# Or use the UI
# Go to: http://localhost:3000/dashboard/settings
# Click "Test All Integrations"
```

---

## 🔥 **What This Gets You**

### **No More Manual Logins!**
Once configured, your TD Studios Command Hub will have seamless access to:

- **AI Models**: Instant access to GPT and Claude without browser logins
- **Notion**: Read/write your databases programmatically
- **Airtable**: Manage bases and records automatically
- **Slack**: Send notifications and messages from your hub
- **GitHub**: Track repositories, commits, and manage code
- **Stripe**: Process payments and manage subscriptions
- **Supabase**: Full database and auth backend integration

### **Automated Workflows**
- AI responses can trigger Slack notifications
- GitHub commits can update Notion databases
- File uploads can sync to multiple platforms
- Payment events can update Airtable records
- Everything connected in one seamless hub!

---

## 🧪 **Testing & Monitoring**

### Built-in Testing Tools:
1. **API Endpoint**: `GET /api/integrations/test`
2. **Setup Guide**: `GET /api/integrations/setup`
3. **Settings UI**: Dashboard → Settings → Integrations
4. **CLI Script**: `node setup-integrations.js`

### Real-time Status:
- ✅ Connected integrations show green status
- ❌ Missing keys show setup instructions
- 🔄 Failed connections show error details
- 📊 Summary dashboard shows overview

---

## 🔒 **Security Notes**

### API Key Safety:
- All keys stored in `.env.local` (never committed to git)
- Environment variables only accessible server-side
- No keys exposed to client/browser
- Each service uses least-privilege access scopes

### Best Practices:
- Rotate keys regularly
- Use separate keys for development vs production
- Monitor usage and rate limits
- Revoke unused tokens

---

## 🎉 **You're Almost There!**

**Current Status**: 2/8 integrations connected (25%)
**Next Steps**: Add 6 more API keys to reach 100% integration
**Time Needed**: ~15 minutes to get all keys
**Result**: Complete platform automation without manual logins!

Once all integrations are connected, your TD Studios Command Hub will be a fully automated, AI-powered platform that seamlessly integrates with all your favorite tools. No more switching between apps or manual logins - everything happens automatically in the background!

🚀 **Ready to complete your setup? Run `node setup-integrations.js` and follow the links!**
