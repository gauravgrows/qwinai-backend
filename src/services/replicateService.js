import fetch from 'node-fetch';
import config from '../config/config.js';
import logger from '../utils/logger.js';
import { ReplicateError, ConfigError } from '../utils/error.js';

class ReplicateService {
    constructor() {
        this.baseUrl = config.replicate.baseUrl;
        this.apiToken = config.replicate.apiToken;
        this.modelVersion = config.replicate.modelVersion;
        
        if (!this.apiToken) {
            throw new ConfigError('Replicate API token is required');
        }
    }

    async createPrediction(imageDataURL, prompt, options = {}) {
        const payload = {
            version: this.modelVersion,
            input: {
                image: imageDataURL,
                prompt: prompt.trim(),
                guidance_scale: options.guidanceScale || 7.5,
                num_inference_steps: options.inferenceSteps || 20,
                strength: options.strength || 0.8,
                ...(options.seed && { seed: parseInt(options.seed) })
            }
        };

        logger.info('Creating Replicate prediction', { prompt: prompt.substring(0, 50) });

        try {
            const response = await fetch(`${this.baseUrl}/predictions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                logger.error('Replicate API error:', errorData);
                throw new ReplicateError(
                    'Failed to create prediction',
                    errorData.detail || 'Unknown error'
                );
            }

            const prediction = await response.json();
            logger.info('Prediction created successfully', { id: prediction.id });
            
            return prediction;
        } catch (error) {
            if (error instanceof ReplicateError) throw error;
            
            logger.error('Network error calling Replicate API:', error);
            throw new ReplicateError('Network error occurred while creating prediction');
        }
    }

    async getPrediction(predictionId) {
        try {
            const response = await fetch(`${this.baseUrl}/predictions/${predictionId}`, {
                headers: {
                    'Authorization': `Token ${this.apiToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                logger.error('Failed to get prediction status:', errorData);
                throw new ReplicateError(
                    'Failed to get prediction status',
                    errorData.detail || 'Unknown error'
                );
            }

            const prediction = await response.json();
            return prediction;
        } catch (error) {
            if (error instanceof ReplicateError) throw error;
            
            logger.error('Network error getting prediction:', error);
            throw new ReplicateError('Network error occurred while checking prediction');
        }
    }
}

export default new ReplicateService();