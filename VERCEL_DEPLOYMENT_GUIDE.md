# 🚀 Deploy to Vercel - Step by Step Guide

## 📋 Prerequisites

Your project is ready to deploy with:
- ✅ `vercel.json` configuration file
- ✅ Next.js application
- ✅ All config files in place
- ✅ Online assets (no local dependencies)

---

## 🛠️ Step 1: Install Vercel CLI

### If not already installed:

```bash
npm install -g vercel
```

### Verify installation:

```bash
vercel --version
```

---

## 🔐 Step 2: Login to Vercel

```bash
vercel login
```

**This will:**
1. Open your browser
2. Ask you to confirm login
3. Link your account to the CLI

---

## 🚀 Step 3: Deploy to Vercel (New Project)

### Navigate to your project:

```bash
cd /Users/ltanwar/repos/planning-proj/wedding-website
```

### Deploy as a NEW project:

```bash
vercel --prod
```

**Important:** When prompted:
- **"Set up and deploy?"** → Press `Y` (Yes)
- **"Which scope?"** → Select your account/team
- **"Link to existing project?"** → Press `N` (No - creates new project)
- **"What's your project's name?"** → Type: `wedding-template-demo` (or any name)
- **"In which directory is your code located?"** → Press Enter (current directory)
- **"Want to override settings?"** → Press `N` (No - use detected settings)

---

## ⚙️ Alternative: Deploy with Custom Settings

If you want more control:

```bash
vercel --prod --name wedding-template-2024 --yes
```

**Flags:**
- `--prod` - Deploy to production
- `--name` - Custom project name
- `--yes` - Skip confirmation prompts

---

## 📝 Step-by-Step Commands

### Option A: Interactive Deployment (Recommended)

```bash
# 1. Navigate to project
cd /Users/ltanwar/repos/planning-proj/wedding-website

# 2. Start deployment
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Link to existing project? N (for new URL)
# - Project name? wedding-template-demo
# - Override settings? N

# Wait for deployment...
# You'll get a URL like: https://wedding-template-demo.vercel.app
```

### Option B: Quick Deploy (Skip prompts)

```bash
# Deploy with custom name
vercel --prod --name my-wedding-template --yes
```

---

## 🌐 After Deployment

You'll receive:
- ✅ **Production URL**: `https://your-project-name.vercel.app`
- ✅ **Dashboard URL**: `https://vercel.com/your-username/your-project`
- ✅ **Deployment ID**: Unique identifier

### Example Output:

```
🔍  Inspect: https://vercel.com/your-username/wedding-template/xxx
✅  Production: https://wedding-template-demo.vercel.app [copied]
```

---

## 🎯 Environment Variables (If Needed)

If you need to add environment variables:

### Via CLI:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste your value when prompted
```

### Via Dashboard:

1. Go to https://vercel.com/your-username/your-project
2. Click **Settings** → **Environment Variables**
3. Add your variables
4. Redeploy: `vercel --prod`

---

## 🔄 Future Deployments

### Redeploy same project:

```bash
# From project directory
vercel --prod
```

### Deploy to different project:

```bash
# Remove .vercel directory first
rm -rf .vercel

# Then deploy
vercel --prod
# Answer "N" to linking existing project
```

---

## 🎨 Custom Domain (Optional)

### Add your own domain:

1. Go to Vercel Dashboard
2. Select your project
3. **Settings** → **Domains**
4. Add your domain: `yourwedding.com`
5. Follow DNS configuration instructions

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] All config files updated (`config/website.config.ts`)
- [ ] Couple names changed from defaults
- [ ] Wedding date set correctly
- [ ] Social URLs configured
- [ ] Instagram/Facebook links updated
- [ ] Contact email updated
- [ ] No local image paths (all online URLs)
- [ ] Test build locally: `npm run build`

---

## 🧪 Test Local Build First

**Recommended:** Test before deploying

```bash
# Build the project
npm run build

# Test the build
npm start

# Visit http://localhost:3000
# Check everything works!
```

---

## 🔧 Troubleshooting

### Build Fails on Vercel?

**Check:**
1. Does it build locally? (`npm run build`)
2. Are all dependencies in `package.json`?
3. Any TypeScript errors? (`npm run type-check`)

### Fix build locally first:

```bash
# Install dependencies
npm install

# Build
npm run build

# Fix any errors before deploying
```

### Still having issues?

```bash
# View build logs
vercel logs
```

---

## 📱 Vercel Dashboard Features

After deployment, you can:

- ✅ View analytics
- ✅ Check deployment logs
- ✅ Roll back to previous versions
- ✅ Add custom domains
- ✅ Configure environment variables
- ✅ Set up webhooks
- ✅ Enable password protection

---

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production (new project)
vercel --prod

# Deploy with custom name
vercel --prod --name my-project --yes

# Check deployment status
vercel ls

# View project info
vercel inspect

# View logs
vercel logs

# Remove project locally (to deploy as new)
rm -rf .vercel
```

---

## 🌟 Pro Tips

### Tip 1: Preview Deployments

```bash
# Deploy to preview URL (not production)
vercel

# This creates a preview: https://wedding-xxx-preview.vercel.app
```

### Tip 2: Alias Your Deployment

```bash
# Create a custom alias
vercel alias set wedding-xxx.vercel.app my-wedding.vercel.app
```

### Tip 3: Environment-specific Configs

```bash
# Add environment variable
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter: https://wedding-template-demo.vercel.app
```

### Tip 4: Auto-deploy on Git Push

1. Connect GitHub repo in Vercel Dashboard
2. Every push to `main` auto-deploys!

---

## 🎊 Success!

Once deployed, you'll have:

✅ **Live URL**: Share with anyone  
✅ **Auto HTTPS**: Secure by default  
✅ **Global CDN**: Fast worldwide  
✅ **Auto scaling**: Handles any traffic  
✅ **Free hosting**: Generous free tier  

---

## 📸 Share Your Website

Your wedding template is now live at:
```
https://your-project-name.vercel.app
```

Share the link:
- 📧 Email clients
- 📱 Social media
- 💼 Portfolio
- 🎉 Show friends!

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **CLI Docs**: https://vercel.com/docs/cli
- **Domains Guide**: https://vercel.com/docs/concepts/projects/domains

---

## 📋 Deployment Workflow

```
1. Update configs → config/website.config.ts
2. Test locally → npm run build && npm start
3. Deploy → vercel --prod
4. Get URL → https://your-project.vercel.app
5. Configure domain (optional)
6. Share! 🎉
```

---

**🚀 Ready to deploy? Run the commands above!**

*Last Updated: December 11, 2025*  
*Status: Ready for deployment*  
*Platform: Vercel*

