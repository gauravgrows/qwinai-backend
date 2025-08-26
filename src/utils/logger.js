import winston from 'winston';
import config from '../config/config.js';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

// Custom format for development
const developmentFormat = combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    simple()
);

// Production format
const productionFormat = combine(
    timestamp(),
    errors({ stack: true }),
    json()
);

const logger = winston.createLogger({
    level: config.logging.level,
    format: config.nodeEnv === 'production' ? productionFormat : developmentFormat,
    transports: [
        new winston.transports.Console(),
        ...(config.nodeEnv === 'production' ? [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ] : [])
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

export default logger;
