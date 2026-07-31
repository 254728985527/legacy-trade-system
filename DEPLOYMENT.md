# Deployment Guide

## Quick Deploy to Vercel

The easiest way to deploy this Next.js application is to use Vercel directly from your GitHub repository.

### Option 1: Deploy via Vercel (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git remote add origin https://github.com/yourusername/deriv-last-digit.git
   git push -u origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New..." → "Project"**

4. **Select your GitHub repository**

5. **Configure (optional)**:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Environment Variables: None required for basic operation

6. **Click "Deploy"**

Your app will be live at `https://your-project-name.vercel.app` within 1-2 minutes!

### Option 2: Deploy Locally

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Access at http://localhost:3000
```

### Option 3: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project directory)
vercel

# For production
vercel --prod
```

## Performance Considerations

- **Next.js Optimization**: Turbopack enabled for ultra-fast builds
- **WebSocket Connection**: Real-time ticks stream directly from Deriv
- **Code Splitting**: All components are code-split by Next.js automatically
- **Static Generation**: Main page is prerendered for instant loads

## Environment Variables

No environment variables are required by default. The app uses public Deriv endpoints.

Optional configuration (not needed for basic operation):
- Deriv App ID can be configured in Settings modal (default: 1089)
- WebSocket server can be changed in Settings (default: ws.derivws.com)

## Monitoring

After deployment, monitor:

1. **Vercel Dashboard** - Build logs, deployments, analytics
2. **Core Web Vitals** - Check Performance tab in Vercel
3. **Real-time Metrics** - Visit `/` and open browser DevTools → Performance

## Troubleshooting

### WebSocket Connection Issues

If ticks aren't showing after deployment:

1. Check browser console (DevTools → Console)
2. Verify Deriv API is accessible (ws.derivws.com)
3. Check firewall/proxy settings
4. Try different Volatility Index in Settings

### Build Failures

If build fails on Vercel:

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are listed in package.json
3. Try local build: `pnpm build`
4. Check TypeScript errors: `pnpm tsc --noEmit`

### Slow Performance

1. Clear browser cache
2. Check Core Web Vitals in DevTools
3. Monitor WebSocket connection quality
4. Consider using CDN for static assets

## Scalability

For production with heavy traffic:

1. **Vercel Pro** - Recommended for dedicated instances
2. **Edge Functions** - For API middleware if needed
3. **Database** - Could add Supabase for historical data logging
4. **Caching** - Redis via Upstash for rate limiting

## Security

The app is secure by design:
- WebSocket connection uses standard Deriv API
- No sensitive data stored locally
- No backend API endpoints exposed
- All data is read-only from Deriv
- HTTPS enforced by Vercel

## Support

For issues or questions:
1. Check the README.md for feature overview
2. Review browser console for errors
3. Test with different symbols in Settings
4. Contact Deriv support for API issues

---

**Deployed? Celebrate!** 🎉 Your live trading dashboard is ready.
