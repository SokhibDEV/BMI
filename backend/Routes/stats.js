import express from 'express';
// Controller ichidagi statistikani hisoblash funksiyasini chaqiramiz
import { getRepoStats } from '../controllers/stats.js';

const router = express.Router();

// Loyiha umumiy statistikasini olish API yo'li: /api/stats/dashboard
router.get('/dashboard', getRepoStats);

export default router;
