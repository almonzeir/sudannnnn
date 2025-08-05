import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'connected', // We'll enhance this later
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
    }
  };

  res.status(200).json(healthCheck);
});

// Detailed health check for monitoring
router.get('/detailed', async (req, res) => {
  const { supabase, logger } = req.app.locals;
  
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    const dbStatus = error ? 'error' : 'connected';
    
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: {
          status: dbStatus,
          error: error?.message || null
        },
        gemini: {
          status: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
        }
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

export default router;