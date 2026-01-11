# 🚀 Deployment Guide

This guide covers deploying the Dataroom Manager to production using Vercel (frontend) and Firebase (authentication).

## Table of Contents

- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Quick Deploy to Vercel

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- Firebase project with Google Auth enabled

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `dataroom` repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Add these for **all environments** (Production, Preview, Development)

### Step 4: Deploy

Click **Deploy** and wait for the build to complete (usually 1-2 minutes).

### Step 5: Update Firebase Authorized Domains

1. Copy your Vercel URL (e.g., `your-app.vercel.app`)
2. Go to [Firebase Console](https://console.firebase.google.com)
3. Select your project
4. Go to **Authentication** → **Settings** → **Authorized domains**
5. Click **Add domain** and paste your Vercel URL
6. Click **Add**

### Step 6: Test

Visit your Vercel URL and test:

- ✅ Sign in with Google (any Gmail account)
- ✅ Create a dataroom
- ✅ Upload a PDF file
- ✅ Create folders
- ✅ Search functionality
- ✅ Rename/delete operations

**🎉 Your app is now live!**

---

## Docker Deployment

### Local Docker Testing

```bash
# Build the Docker image
docker build -t dataroom-manager .

# Run the container
docker run -p 3000:80 dataroom-manager

# Or use docker-compose
docker-compose up -d
```

Access at `http://localhost:3000`

### Deploy to Cloud (Render, Railway, Fly.io)

#### Option A: Render

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Docker
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
5. Add environment variables (see above)
6. Click **Create Web Service**

#### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the Dockerfile
5. Add environment variables in **Variables** tab
6. Deploy automatically starts

#### Option C: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Set environment variables
fly secrets set VITE_FIREBASE_API_KEY=your_key
fly secrets set VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... (repeat for all variables)

# Deploy
fly deploy
```

---

## Environment Variables

### Required Variables

| Variable                            | Description             | Example                  |
| ----------------------------------- | ----------------------- | ------------------------ |
| `VITE_FIREBASE_API_KEY`             | Firebase API key        | `AIzaSyXXXXXXX...`       |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain    | `my-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID     | `my-app-12345`           |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket | `my-app.appspot.com`     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID      | `123456789012`           |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID         | `1:123:web:abc123`       |

### Where to Find Firebase Values

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the **gear icon** (Settings) → **Project settings**
4. Scroll to **Your apps** section
5. Click on your web app (or create one if none exists)
6. Copy the config values from the `firebaseConfig` object

---

## Troubleshooting

### Problem: "Firebase: Error (auth/unauthorized-domain)"

**Solution:** Add your deployment domain to Firebase Authorized domains

1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your domain (e.g., `your-app.vercel.app`)

### Problem: "Pop-up blocked" when signing in

**Solution:**

- Allow pop-ups for your site
- Or use redirect-based auth (requires code change)

### Problem: Environment variables not working

**Solution:**

- Vercel: Make sure variables start with `VITE_` prefix
- Vercel: Add variables for ALL environments
- Redeploy after adding variables

### Problem: 404 on page refresh

**Solution:** Already configured in `vercel.json` - all routes fallback to `index.html`

### Problem: Data not persisting across devices

**This is expected behavior!**

- Data is stored in browser's IndexedDB (local only)
- Each browser/device has its own database
- This is a frontend-only solution (perfect for a frontend role test)
- For multi-device sync, you'd need a backend API (not required for frontend role)

### Problem: Build fails on Vercel

**Check:**

1. All dependencies in `package.json`
2. Node version compatibility (18+)
3. Build logs for specific errors
4. Try building locally first: `npm run build`

---

## Performance Optimization

### Already Implemented

- ✅ SPA routing (no full page reloads)
- ✅ Code splitting with React Router
- ✅ Lazy loading of large components
- ✅ Optimized images and assets
- ✅ Gzip compression (via Vercel/nginx)

### Recommended Additions

- Add `react-query` DevTools (dev only)
- Implement service worker for offline support
- Add analytics (Google Analytics, Plausible, etc.)

---

## Security Checklist

- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Security headers configured (`vercel.json`, `nginx.conf`)
- ✅ Firebase rules restrict auth to approved domains
- ✅ No API keys exposed (client-side Firebase keys are safe)
- ✅ XSS protection via React
- ✅ Input validation with Zod

---

## Monitoring

### Vercel Analytics (Free)

1. Go to your Vercel project
2. Enable **Analytics** in settings
3. View real-time performance metrics

### Firebase Authentication Logs

1. Firebase Console → Authentication
2. View user sign-ins, errors, and activity

---

## Cost Estimate

For a frontend role test task, everything can run on **free tiers**:

| Service       | Free Tier             | Sufficient For       |
| ------------- | --------------------- | -------------------- |
| Vercel        | 100GB bandwidth/month | Demo + small teams   |
| Firebase Auth | 50k MAU               | Testing + evaluation |
| IndexedDB     | ~5GB per browser      | Hundreds of PDFs     |

**Total Monthly Cost: $0** 🎉

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs/auth
- **Vite Docs**: https://vitejs.dev/guide/

---

**Built with ❤️ for frontend excellence**
