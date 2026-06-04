import express from 'express';
// Controller ichidagi asosiy tahlil funksiyasini chaqiramiz
import { analyzeRepository } from '../controllers/git.js';

const router = express.Router();

// Bosh sahifadan URL kelganda ishlaydigan API yo'nalishi
router.post('/analyze', analyzeRepository);

export default router;
