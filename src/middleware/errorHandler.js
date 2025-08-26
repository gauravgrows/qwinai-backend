import logger from '../utils/logger.js';
import { MulterError } from 'multer';

const errorHandler = (err, req, res, next) => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // Multer errors
    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large. Maximum size is 10MB.',
                code: 'FILE_TOO_LARGE'
            });
        }
        
        return res.status(400).json({
            error: 'File upload error',
            code: 'UPLOAD_ERROR',
            details: err.message
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: err.details || err.message
        });
    }

    // Default error response
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;