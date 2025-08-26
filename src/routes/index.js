import express from 'express';
import imageRoutes from './imageRoutes.js';
import healthRoutes from './healthRoutes.js';
import presetRoutes from './presetRoutes.js';

const router = express.Router();

router.use('/', healthRoutes);
router.use('/', imageRoutes);
router.use('/presets', presetRoutes);

export default router;
