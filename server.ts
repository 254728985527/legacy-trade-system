import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Deriv Symbols catalog endpoint
  app.get('/api/deriv/symbols', (_req, res) => {
    res.json({
      symbols: [
        { symbol: '1HZ75V', display_name: 'Vol 75 (1s) Index' },
        { symbol: '1HZ10V', display_name: 'Vol 10 (1s) Index' },
        { symbol: '1HZ25V', display_name: 'Vol 25 (1s) Index' },
        { symbol: '1HZ50V', display_name: 'Vol 50 (1s) Index' },
        { symbol: '1HZ100V', display_name: 'Vol 100 (1s) Index' },
        { symbol: 'R_10', display_name: 'Vol 10 Index' },
        { symbol: 'R_25', display_name: 'Vol 25 Index' },
        { symbol: 'R_50', display_name: 'Vol 50 Index' },
        { symbol: 'R_75', display_name: 'Vol 75 Index' },
        { symbol: 'R_100', display_name: 'Vol 100 Index' },
      ],
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Deriv Analysis Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
