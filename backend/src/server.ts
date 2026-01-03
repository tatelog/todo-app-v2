import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database';
import routes from './routes';

// Expressアプリケーション初期化
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Todo API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// データベース初期化とサーバー起動
async function startServer() {
  try {
    // データベース初期化
    await initDatabase();

    // サーバー起動
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 Todo Backend Server Started!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 Server:      http://localhost:${PORT}`);
      console.log(`💚 Health:      http://localhost:${PORT}/health`);
      console.log(`🔗 API:         http://localhost:${PORT}/api/todos`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
