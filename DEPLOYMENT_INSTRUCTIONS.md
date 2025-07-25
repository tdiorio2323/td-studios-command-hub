# 🚀 TD Studios Portal - GoDaddy Deployment Instructions

## 📦 Files Ready for Upload

Your TD Studios portal has been compiled into static files ready for GoDaddy hosting!

### 🗂️ What's Included:
- **Static HTML/CSS/JS files** - Complete portal functionality
- **All dashboard pages** - AI Studio, File Vault, Tasks, CMS, etc.
- **Glass-morphism design** - Modern neural-themed interface
- **Responsive layout** - Works on all devices

## 🌐 GoDaddy cPanel Upload Instructions

### Step 1: Access Your Hosting
1. Log into your **GoDaddy account**
2. Go to **Web Hosting** → **Manage**
3. Click **cPanel** to access your hosting control panel

### Step 2: Choose Your Domain Setup

#### Option A: Main Domain (tdstudios.com)
1. In cPanel, go to **File Manager**
2. Navigate to `public_html/` folder
3. Upload and extract all files from the `out/` folder

#### Option B: Subdomain (portal.tdstudios.com) - **RECOMMENDED**
1. In cPanel, go to **Subdomains**
2. Create subdomain: `portal` → `portal.tdstudios.com`
3. Document root: `/public_html/portal/`
4. Go to **File Manager** → `public_html/portal/`
5. Upload and extract all files from the `out/` folder

### Step 3: Upload Files
1. **Upload the archive:**
   - Upload `td-studios-portal.tar.gz` to your chosen directory
   - OR upload all files from the `out/` folder individually

2. **Extract files:**
   - If uploaded tar.gz: Right-click → Extract
   - Ensure `index.html` is in the root of your domain/subdomain folder

### Step 4: Set Up .htaccess (Important!)
Create a `.htaccess` file in your root directory with this content:

```apache
# TD Studios Portal Configuration
DirectoryIndex index.html

# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
</IfModule>

# Handle client-side routing
ErrorDocument 404 /index.html

# Redirect all requests to index.html for SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## 🔧 DNS Configuration (if using subdomain)

If you chose **portal.tdstudios.com**, ensure your DNS has:
- **Type:** A Record or CNAME
- **Name:** portal
- **Points to:** Your GoDaddy hosting IP (usually handled automatically)

## 🔐 Login Information

Once deployed, you can access your portal at:
- **Main domain:** https://tdstudios.com
- **Subdomain:** https://portal.tdstudios.com

**Login passwords:** 
- `tdstudios2024`
- `aibeast`

## ✅ Test Your Deployment

1. Visit your domain/subdomain
2. You should see the TD Studios login page
3. Enter password to access the dashboard
4. Test all sections: AI Studio, File Vault, Tasks, etc.

## 🆘 Troubleshooting

### If pages show 404 errors:
- Check that `.htaccess` file is uploaded correctly
- Verify `index.html` is in the root directory
- Ensure file permissions are set to 644

### If CSS/styling is missing:
- Check that the `_next/` folder is uploaded completely
- Verify all files in `_next/static/` are present

### If nothing loads:
- Check File Manager to ensure all files are in the correct directory
- Verify your domain points to the right folder
- Check GoDaddy hosting status

## 🎉 Success!

Your TD Studios command hub is now live! You have a professional AI-powered portal with:
- 🤖 AI Studio with chat interface
- 📁 File management system  
- ✅ Task tracker with AI insights
- 📝 Content management system
- 💬 Messaging platform
- 🛠️ Workspace tools
- 📊 Analytics dashboard
- ⚙️ Complete settings panel

Enjoy your new neural command center! 🚀