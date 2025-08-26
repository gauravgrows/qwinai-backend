export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

export class ReplicateError extends AppError {
    constructor(message, details = null) {
        super(message, 502, 'REPLICATE_ERROR');
        this.details = details;
    }
}

export class ConfigError extends AppError {
    constructor(message) {
        super(message, 500, 'CONFIG_ERROR');
    }
}
