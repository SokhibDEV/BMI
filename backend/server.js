import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import gitRoutes from './routes/git.js';
import diffRoutes from './routes/diff.js';
import aiRoutes from './routes/ai.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/git', gitRoutes);     
app.use('/api/diff', diffRoutes);   
app.use('/api/ai', aiRoutes);       
app.use('/api/stats', statsRoutes); 

app.get('/', (req, res) => {
    res.send('Git Analyzer API server muvaffaqiyatli ishlamoqda!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} portida muvaffaqiyatli ishga tushdi.`);
});
