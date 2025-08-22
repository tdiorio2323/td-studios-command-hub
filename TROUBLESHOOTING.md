# 🔧 TD Studios Command Hub - Troubleshooting Guide

## 🚨 Common Issues & Quick Fixes

### **Build Errors**

#### "next: not found"
```bash
npm install --legacy-peer-deps
```

#### "Google Fonts fetch failed"
✅ **Already fixed!** Updated to use system fonts for better compatibility.

#### "supabaseUrl is required"
✅ **Already fixed!** Added placeholder environment variables.

### **Development Server Issues**

#### Server won't start
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

#### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### **Login Issues**

#### Can't access dashboard
**Use these passwords:**
- `tdstudios2024`
- `commandhub`

#### Interface not loading
Check that you're visiting: `http://localhost:3000`

### **API/Feature Issues**

#### AI features not working
**Expected behavior**: Basic functionality works with placeholders. For full AI power:
1. Get API keys from Anthropic (Claude) and OpenAI
2. Add to `.env.local` file
3. Restart server

#### Database errors
**Expected behavior**: Some database features show placeholder content without real Supabase setup.

### **Environment Setup**

#### Missing .env.local file
✅ **Already created!** Basic `.env.local` with placeholders is included.

#### Need real API keys?
See `API_SETUP_GUIDE.md` for step-by-step API setup.

### **Deployment Issues**

#### Vercel deployment fails
1. Check environment variables in Vercel dashboard
2. See `vercel-deploy-guide.md` for complete instructions

#### Static export issues
The app is configured for server-side features. For static export, some API routes need modification.

## 🆘 Still Stuck?

### **Check These Files:**
1. `WHAT_TO_DO_HERE.md` - Complete guidance
2. `API_SETUP_GUIDE.md` - API configuration
3. `PRODUCTION_ENV_SETUP.md` - Environment setup

### **Quick Diagnostic:**
```bash
# Test build
npm run build

# Test APIs (if configured)
node test-apis.js

# Check environment
npm run dev
```

### **Reset Everything:**
```bash
# Nuclear option - fresh start
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
npm run build
npm run dev
```

## ✅ Success Checklist

- [ ] `npm install --legacy-peer-deps` runs without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` starts server on port 3000
- [ ] Can access dashboard with login password
- [ ] Main navigation works
- [ ] Dashboard sections load (even with placeholder content)

**If all checkboxes pass, your setup is working correctly!**

---

*Most "issues" are actually expected behavior when running without full API configuration.*