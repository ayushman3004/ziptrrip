import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/todos', todoRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler (unknown routes) ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { name: 'NotFoundError', message: `Route ${req.method} ${req.path} not found` },
  });
});

// ─── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Ziptrrip Todo API running at http://localhost:${PORT}`);
  console.log(`📋  API base: http://localhost:${PORT}/api/todos`);
});
