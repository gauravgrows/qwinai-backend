import logger from './logger.js';

export const bufferToDataURL = (buffer, mimetype) => {
    const base64 = buffer.toString('base64');
    return `data:${mimetype};base64,${base64}`;
};

export const asyncWrapper = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const sanitizeFileName = (filename) => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
};

export const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
