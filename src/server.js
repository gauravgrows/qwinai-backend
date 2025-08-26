import 'express-async-errors';
import app from './app.js';
import config from './config/config.js';
import logger from './utils/logger.js';

const PORT = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
    
    // Force close server after 10s
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
    logger.info(`Frontend: http://localhost:${PORT}`);
});

export default server;
