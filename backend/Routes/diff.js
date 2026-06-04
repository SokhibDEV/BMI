import express from 'express';
// Controller ichidagi funksiyani chaqirib olamiz
import { getCommitDiff } from '../controllers/diff.js';

const router = express.Router();

// Tanlangan commitning kod o'zgarishlarini olish API yo'li: /api/diff/commit
router.get('/commit', getCommitDiff);

export default router;
