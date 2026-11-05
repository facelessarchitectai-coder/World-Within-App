import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  handleValidateKeyRoute,
  handleReviewAnswerRoute,
  handleAnalyzeSystemRoute,
} from './src/server/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // API endpoints with strict session and key validation
  app.post('/api/validate-key', handleValidateKeyRoute);
  app.post('/api/review-answer', handleReviewAnswerRoute);
  app.post('/api/analyze-system', handleAnalyzeSystemRoute);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'world-within-engine' });
  });

  if (!isProd) {
    // In development: mount Vite middlewares with HTTP server attached for proper WebSocket handling
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`World Within Engine running on http://0.0.0.0:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
