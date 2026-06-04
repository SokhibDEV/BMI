import simpleGit from 'simple-git';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

const REPOS_DIR = path.join(process.cwd(), 'cloned_repos');

export const getCommitAIFeedback = async (req, res) => {
    const { repoPathName, sha, message } = req.body;

    if (!repoPathName || !sha) {
        return res.status(400).json({ success: false, error: "Tahlil uchun ma'lumotlar yetarli emas!" });
    }

    try {
        const apiKey = String(process.env.GEMINI_API_KEY).trim();
        const ai = new GoogleGenerativeAI(apiKey);

        const repoPath = path.join(REPOS_DIR, repoPathName);
        const git = simpleGit(repoPath);

        const rawDiff = await git.show([sha]);
        const optimizedDiff = rawDiff.substring(0, 3500);

        const prompt = `
        Siz dasturiy ta'minot versiyalarini tahlil qiluvchi yuqori darajali ekspertsiz.
        Quyidagi Git Commit o'zgarishlarini (Diff) va commit xabarini diqqat bilan o'rganib chiqing.
        
        Commit xabari: "${message || 'Kiritilmagan'}"
        
        Menga ushbu kod o'zgarishlari bo'yicha aniq, tizimli va professional javob qaytaring. Response faqat va faqat o'zbek tilida bo'lishi shart.
        Matnda albatta mana shu ikki savol alohida bo'lim bo'lib yoritilsin:
        1. Ushbu versiyada nima o'zgardi? (Kod va fayllar darajasidagi aniq o'zgarishlar)
        2. Ushbu o'zgarishlar nima uchun amalga oshirildi? (Biznes mantiq, kiberxavfsizlik va dastur barqarorligi jihatidan tushuntirish)
        
        Diff kod matni:
        ${optimizedDiff}
        `;

        console.log(`Gemini AI orqali semantik tahlil boshlandi: SHA - ${sha}`);

        // Eng barqaror va yangi model nomi: "gemini-2.5-flash"
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Google AI SDK talab qiladigan eng tog'ri kontent uzatish formati
        const result = await model.generateContent(prompt);
        const aiResponseText = result.response.text();

        res.json({
            success: true,
            aiAnalysis: aiResponseText
        });

    } catch (error) {
        console.error("AI tahlilida xatolik yuz berdi:", error);
        res.status(500).json({ success: false, error: "Google AI xizmati orqali semantik izoh tayyorlashda xatolik bo'ldi." });
    }
};
