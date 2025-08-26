import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config/config.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.replicate.com"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.rateLimit.max,
    message: {
        error: 'Too many requests from this IP',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: config.maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: config.maxFileSize }));

// Request logging
app.use(requestLogger);

// Static files
app.use(express.static(join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve frontend for root path
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: req.originalUrl
    });
});

// Global error handler
app.use(errorHandler);

export default app;