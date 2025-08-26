import { body, validationResult } from 'express-validator';
import replicateService from '../services/replicateService.js';
import { bufferToDataURL, asyncWrapper } from '../utils/helper.js';
import { ValidationError } from '../utils/error.js';
import logger from '../utils/logger.js';

// Validation rules
export const validateImageProcessing = [
    body('prompt')
        .notEmpty()
        .withMessage('Prompt is required')
        .isLength({ min: 5, max: 1000 })
        .withMessage('Prompt must be between 5 and 1000 characters'),
    body('guidance_scale')
        .optional()
        .isFloat({ min: 1, max: 20 })
        .withMessage('Guidance scale must be between 1 and 20'),
    body('inference_steps')
        .optional()
        .isInt({ min: 10, max: 50 })
        .withMessage('Inference steps must be between 10 and 50'),
    body('strength')
        .optional()
        .isFloat({ min: 0.1, max: 1 })
        .withMessage('Strength must be between 0.1 and 1'),
    body('seed')
        .optional()
        .isInt()
        .withMessage('Seed must be an integer')
];

export const processImage = asyncWrapper(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
    }

    // Check if image file exists
    if (!req.file) {
        throw new ValidationError('No image file provided');
    }

    const { prompt, guidance_scale, inference_steps, strength, seed } = req.body;

    // Convert uploaded image to base64 data URL
    const imageDataURL = bufferToDataURL(req.file.buffer, req.file.mimetype);

    // Create prediction
    const prediction = await replicateService.createPrediction(imageDataURL, prompt, {
        guidanceScale: guidance_scale,
        inferenceSteps: inference_steps,
        strength,
        seed
    });

    logger.info('Image processing started', {
        predictionId: prediction.id,
        fileSize: req.file.size,
        prompt: prompt.substring(0, 50)
    });

    res.json({
        predictionId: prediction.id,
        status: prediction.status,
        message: 'Prediction started successfully'
    });
});

export const getPredictionStatus = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ValidationError('Prediction ID is required');
    }

    const prediction = await replicateService.getPrediction(id);

    res.json({
        id: prediction.id,
        status: prediction.status,
        output: prediction.output,
        error: prediction.error,
        logs: prediction.logs,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at
    });
});