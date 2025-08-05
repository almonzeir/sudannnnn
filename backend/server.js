import dotenv from 'dotenv';
import app from './src/app.js';
import { createClient } from '@supabase/supabase-js';
import winston from 'winston';
import { geminiService } from './src/services/gemini.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sudani-dar-meds-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport for development
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Test database connection
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    return false;
  }
}

// Test Gemini API connection
async function testGeminiConnection() {
  try {
    const isValid = await geminiService.validateApiKey();
    if (isValid) {
      logger.info('Gemini API connection successful');
      return true;
    } else {
      logger.error('Gemini API key validation failed');
      return false;
    }
  } catch (error) {
    logger.error('Gemini API connection failed:', error.message);
    return false;
  }
}

// Initialize server
async function startServer() {
  try {
    // Test connections
    const dbConnected = await testDatabaseConnection();
    const geminiConnected = await testGeminiConnection();
    
    if (!dbConnected) {
      logger.error('Cannot start server: Database connection failed');
      process.exit(1);
    }
    
    if (!geminiConnected) {
      logger.warn('Gemini API connection failed - chatbot functionality may be limited');
    }
    
    // Make services available to the app
    app.locals.supabase = supabase;
    app.locals.logger = logger;
    
    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`📱 Health check available at http://localhost:${PORT}/api/health`);
      
      if (NODE_ENV === 'development') {
        logger.info(`🔗 API Documentation: http://localhost:${PORT}/api`);
        logger.info(`💬 Chat endpoint: http://localhost:${PORT}/api/chat/send`);
      }
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Close database connections if needed
        // supabase doesn't require explicit closing
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
      
      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory might already exist
}

// Start the server
startServer();

export default app;