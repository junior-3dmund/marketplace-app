# Nova Mart - Environment Variables Guide

## Backend Server (.env for `server/`)

Copy this template to `server/.env` for local development:

```
ADMIN_PIN=1406
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=4000
```

### Production Environment Variables

For deployment on Render, Fly.io, or similar platforms, set:

- **ADMIN_PIN** - The PIN required for admin authentication (default: 1406). Change this in production.
- **JWT_SECRET** - A strong random secret key for signing JWT tokens. Use a strong random string (minimum 32 characters).
- **PORT** - The port the server listens on (default: 4000). Most hosting platforms set this automatically.

### Setting Variables on Render

1. Go to your Render service dashboard
2. Click "Environment" in the left sidebar
3. Add the following keys:
   - `ADMIN_PIN` = your secure PIN (e.g., a random 6-8 digit number)
   - `JWT_SECRET` = a strong random string (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate)
   - `PORT` = 4000 (or let Render auto-set)

### Setting Variables on Fly.io

```bash
# Deploy with secrets
flyctl secrets set ADMIN_PIN=1406 JWT_SECRET=your-strong-secret-key PORT=4000
```

### Frontend (.env for Vite)

The frontend connects to the backend at `http://localhost:4000` by default. For production, update the hardcoded URLs in these files:

- `src/utils/geolocation.ts` - Change `http://localhost:4000` to your production API URL
- `src/pages/AdminDashboard.tsx` - Update API endpoint URLs

Or create a `src/config.ts` to centralize API URLs:

```typescript
export const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';
```

Then use `import { API_URL } from '../config'` in your components.

## Quick Start

### Local Development

```bash
# Terminal 1: Start the React dev server
npm run dev

# Terminal 2: Start the Express backend
cd server
npm install
npm start
```

Then open http://localhost:4173/ in your browser.

### Production Deployment

#### Render (Recommended for simplicity)

1. Push your code to GitHub
2. Create a new Render service:
   - Connect your GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run dev` (for dev) or use a process manager like `pm2` for production
   - Set environment variables in Render dashboard
3. Add the backend as a separate service:
   - Start Command: `cd server && npm install && npm start`
   - Set `ADMIN_PIN`, `JWT_SECRET`, and expose the API endpoint

#### Fly.io

```bash
# Initialize Fly app
flyctl launch

# Set secrets
flyctl secrets set ADMIN_PIN=your-pin JWT_SECRET=your-secret

# Deploy
flyctl deploy
```

#### Manual Deployment (VPS/Self-hosted)

1. Clone the repo on your server
2. Install Node.js and npm
3. Set environment variables: `export ADMIN_PIN=...` or use a `.env` file with `dotenv`
4. Install dependencies: `npm install && cd server && npm install`
5. Build frontend: `npm run build`
6. Start backend: `cd server && npm start`
7. Serve frontend from `dist/` using a web server (Nginx, Apache) or serve with Express

## Security Checklist

- [ ] Change `ADMIN_PIN` from the default `1406`
- [ ] Generate a strong `JWT_SECRET` (32+ characters, random)
- [ ] Use HTTPS/SSL certificates on your domain
- [ ] Set `CORS` origin to your production frontend domain (update `server/index.js`)
- [ ] Use a reverse proxy (Nginx) to cache static files and proxy API requests
- [ ] Enable HTTP/2 and compression
- [ ] Set secure cookie flags if using cookies
- [ ] Monitor server logs for suspicious activity
- [ ] Regularly update dependencies (`npm audit`, `npm update`)

## Testing

### Local Testing

1. Register a new account with phone number
2. Test buyer dashboard features
3. Test password recovery with forgot-password page
4. Add items to cart and checkout
5. Test admin PIN login (PIN: 1406)
6. View locations on admin map

### Production Smoke Tests

After deploying, run these checks:
- [ ] User registration works
- [ ] User login with email/phone/username works
- [ ] Password recovery flow completes
- [ ] Buyer dashboard loads with recommendations
- [ ] Seller listing creation works
- [ ] Admin login with PIN succeeds
- [ ] Locations appear on admin map
