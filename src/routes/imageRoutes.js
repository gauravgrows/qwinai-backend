import express from 'express';
import upload from '../middleware/upload.js';
import {
    processImage,
    getPredictionStatus,
    validateImageProcessing
} from '../controllers/imageController.js';

const router = express.Router();

router.post(
    '/process-image',
    upload.single('image'),
    validateImageProcessing,
    processImage
);

router.get('/prediction/:id', getPredictionStatus);

export default router;
