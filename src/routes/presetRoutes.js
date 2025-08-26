import express from 'express';
import { getPresets, getPreset } from '../controllers/presetController.js';

const router = express.Router();

router.get('/', getPresets);
router.get('/:id', getPreset);

export default router;