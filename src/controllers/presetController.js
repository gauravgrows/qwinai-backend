import { asyncWrapper } from '../utils/helper.js';

const PRESETS = [
    {
        id: 'face_retouching',
        name: 'Face Retouching',
        description: 'Enhance facial features, smooth skin, improve lighting',
        prompt: 'enhance and retouch the face, improve skin texture, smooth complexion, enhance facial features, professional lighting',
        category: 'portrait',
        tags: ['face', 'beauty', 'enhancement']
    },
    {
        id: 'remove_anything',
        name: 'Remove Anything',
        description: 'Remove unwanted objects, people, or backgrounds',
        prompt: 'remove unwanted objects from the image, clean up the background, seamlessly fill in the removed areas',
        category: 'editing',
        tags: ['removal', 'cleanup', 'background']
    },
    {
        id: 'professional_headshot',
        name: 'Professional Headshot',
        description: 'Transform into professional business portrait',
        prompt: 'transform into a professional business headshot, improve lighting, formal background, business attire if needed',
        category: 'portrait',
        tags: ['professional', 'business', 'headshot']
    },
    {
        id: 'scene_replacement',
        name: 'Scene Replacement',
        description: 'Change background or entire scene setting',
        prompt: 'replace the background with a new scene, change the environment while keeping the subject intact',
        category: 'background',
        tags: ['background', 'scene', 'replacement']
    }
];

export const getPresets = asyncWrapper(async (req, res) => {
    const { category, tag } = req.query;
    
    let filteredPresets = PRESETS;
    
    if (category) {
        filteredPresets = filteredPresets.filter(preset => preset.category === category);
    }
    
    if (tag) {
        filteredPresets = filteredPresets.filter(preset => preset.tags.includes(tag));
    }
    
    res.json({
        presets: filteredPresets,
        total: filteredPresets.length,
        categories: [...new Set(PRESETS.map(p => p.category))],
        tags: [...new Set(PRESETS.flatMap(p => p.tags))]
    });
});

export const getPreset = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const preset = PRESETS.find(p => p.id === id);
    
    if (!preset) {
        return res.status(404).json({
            error: 'Preset not found',
            code: 'PRESET_NOT_FOUND'
        });
    }
    
    res.json(preset);
});