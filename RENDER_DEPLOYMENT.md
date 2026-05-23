# Nova Mart - Deployment Guide for Render

## Prerequisites
- GitHub account with this repo pushed
- Render.com account (free tier available)
- A custom domain (optional)

## Step-by-Step Deployment

### Part 1: Deploy Backend API (Express Server)

1. **Go to [render.com](https://render.com)** and sign in with GitHub
2. **Create New → Web Service**
3. **Connect Your Repository**
   - Select the GitHub repo containing Nova Mart
   - Authorize Render to access your repo
4. **Configure Backend Service**
   - **Name:** `nova-mart-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (sufficient for testing)

5. **Add Environment Variables** (click "Add Secret File" or "Environment")
   - `ADMIN_PIN` = `1406` (change to a unique PIN for production)
   - `JWT_SECRET` = Generate a strong random string using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
     Example output: `a3f8c2e1d9b4f6a7c8e9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9`
   - `PORT` = `4000`

6. **Click "Create Web Service"**
   - Wait for deployment (usually 2-3 minutes)
   - Note the URL (e.g., `https://nova-mart-api.onrender.com`)

### Part 2: Deploy Frontend (React App)

1. **Back in Render Dashboard → Create New → Web Service**
2. **Connect Same Repository**
3. **Configure Frontend Service**
   - **Name:** `nova-mart-web`
   - **Root Directory:** `.` (leave blank / root)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - **Instance Type:** Free

4. **Add Environment Variable**
   - `VITE_API_URL` = `https://nova-mart-api.onrender.com` (use your backend URL from Part 1)

5. **Click "Create Web Service"**
   - Wait for deployment
   - Once live, you'll get a URL like `https://nova-mart-web.onrender.com`

### Part 3: Environment Variable Notes

- The frontend now reads the backend URL from `VITE_API_URL`.
- Backend `ADMIN_PIN` should be changed from default `1406` in production.
- Backend `JWT_SECRET` must be a strong random string.
- Frontend and backend should be deployed to separate Render services.

### Part 3: Update Frontend API Endpoint

After deployment, the frontend still uses `http://localhost:4000`. Update it:

**In `src/utils/geolocation.ts`:**
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';
const endpoint = `${API_URL}/api/locations`;
```

**In `src/pages/AdminDashboard.tsx`:**
```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';
// Then use: `${API_URL}/api/locations` and `${API_URL}/api/messages`
```

Or create a centralized config file `src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
```

Then import and use it throughout the app.

### Part 4: Verify Deployment

1. **Test Frontend**: Open https://nova-mart-web.onrender.com
2. **Test Registration**: Create a new account with phone number
3. **Test Buyer Dashboard**: Navigate to /buyer after login
4. **Test Password Recovery**: Use forgot-password flow
5. **Test Admin Access**: Try admin PIN login (PIN: 1406)

## Production Security Checklist

- [ ] Changed `ADMIN_PIN` from default `1406` to unique value
- [ ] Generated strong `JWT_SECRET` (32+ random characters)
- [ ] Updated `VITE_API_URL` to backend service URL
- [ ] HTTPS enabled (Render provides free SSL)
- [ ] CORS configured for frontend domain (optional: update in `server/index.js`)
- [ ] Tested all critical flows in production

## Custom Domain Setup (Optional)

1. **In Render Dashboard** → Select web service → Settings
2. **Custom Domain** → Add your domain (e.g., nova-mart.com)
3. **Configure DNS** records with your domain registrar (instructions in Render)
4. **Update Frontend Environment Variable** to use custom domain API URL

## Troubleshooting

### "Cannot POST /api/admin/login"
- Ensure backend service is deployed and running
- Check `VITE_API_URL` environment variable is set correctly
- Verify backend logs for errors

### "CORS error"
- Backend must have CORS enabled (already configured in `server/index.js`)
- Ensure frontend domain is allowed by CORS policy

### Build Fails
- Check build logs in Render dashboard
- Ensure `npm run build` succeeds locally first: `npm run build`
- Verify all dependencies are in `package.json`

## Monitor Deployed Services

**In Render Dashboard:**
1. Click each service to view logs
2. Watch for errors during startup
3. Check resource usage (should be minimal on free tier)

## Scale for Production

When ready for production traffic:
1. Upgrade from **Free** to **Standard** instance ($7/month)
2. Enable **Auto-deploy on push** to main branch
3. Set up database (PostgreSQL on Render)
4. Enable backups for user data
5. Configure CDN for static assets (optional)

## Estimated Costs
- **Free Tier**: $0 (demo/testing)
- **Small Production**: ~$14/month (2x Standard instances + database)
- **Professional**: $30+/month (auto-scaling, monitoring, etc.)

---

**You're live!** 🎉 Share your production URL with users and start taking orders on Nova Mart!
