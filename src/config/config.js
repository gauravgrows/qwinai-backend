import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

// Configuration schema
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    REPLICATE_API_TOKEN: Joi.string().required(),
    QWIN_MODEL_VERSION: Joi.string().default('qwen/qwen-image-edit'),
    MAX_FILE_SIZE: Joi.number().default(10 * 1024 * 1024),
    RATE_LIMIT_MAX: Joi.number().default(100),
    ALLOWED_ORIGINS: Joi.string().default('*'),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info')
}).unknown();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    nodeEnv: envVars.NODE_ENV,
    port: envVars.PORT,
    replicate: {
        apiToken: envVars.REPLICATE_API_TOKEN,
        modelVersion: envVars.QWIN_MODEL_VERSION,
        baseUrl: 'https://api.replicate.com/v1'
    },
    maxFileSize: envVars.MAX_FILE_SIZE,
    allowedOrigins: envVars.ALLOWED_ORIGINS === '*' ? '*' : envVars.ALLOWED_ORIGINS.split(','),
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: envVars.RATE_LIMIT_MAX
    },
    logging: {
        level: envVars.LOG_LEVEL
    }
};

export default config;