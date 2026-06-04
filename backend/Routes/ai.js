import express from 'express';
// Controller ichidagi AI tahlil funksiyasini chaqiramiz
import { getCommitAIFeedback } from '../controllers/ai.js';

const router = express.Router();

// Tanlangan commit bo'yicha AI izohini olish API yo'li: /api/ai/analyze
router.post('/analyze', getCommitAIFeedback);

export default router;
