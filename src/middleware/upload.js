import multer from 'multer';
import config from '../config/config.js';
import { ValidationError } from '../utils/error.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/i;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new ValidationError('Only image files (JPEG, PNG, WebP) are allowed'));
    }
};

// Multer configuration
const upload = multer({
    storage,
    limits: {
        fileSize: config.maxFileSize,
        files: 1
    },
    fileFilter
});

export default upload;