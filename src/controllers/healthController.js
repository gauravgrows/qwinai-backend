import { asyncWrapper } from '../utils/helper.js';
import config from '../config/config.js';

export const healthCheck = asyncWrapper(async (req, res) => {
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        version: process.env.npm_package_version || '1.0.0',
        memory: process.memoryUsage(),
        services: {
            replicate: !!config.replicate.apiToken
        }
    };

    res.json(healthData);
});
