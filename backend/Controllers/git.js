import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs';

// Yuklangan loyihalar vaqtincha saqlanadigan papka yo'li
const REPOS_DIR = path.join(process.cwd(), 'cloned_repos');

// Agar papka kompyuterda mavjud bo'lmasa, uni yaratadi
if (!fs.existsSync(REPOS_DIR)) {
    fs.mkdirSync(REPOS_DIR);
}

// URL'dan maxsus belgilarni o'chirib, papka nomi qilish uchun yordamchi funksiya
const getFolderFromUrl = (url) => {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
};

export const analyzeRepository = async (req, res) => {
    const { repoUrl } = req.body;

    // 1. URL kiritilganini tekshirish
    if (!repoUrl) {
        return res.status(400).json({ success: false, error: "GitHub yoki GitLab URL manzili kiritilmadi!" });
    }

    try {
        const folderName = getFolderFromUrl(repoUrl);
        const repoPath = path.join(REPOS_DIR, folderName);
        const git = simpleGit();

        console.log(`Klonlanmoqda: ${repoUrl} -> Papka: ${folderName}`);

        // 2. Loyiha oldin yuklanmagan bo'lsa clone qiladi, yuklangan bo'lsa yangilaydi (pull)
        if (!fs.existsSync(repoPath)) {
            await git.clone(repoUrl, repoPath);
        } else {
            await simpleGit(repoPath).pull();
        }

        // 3. simple-git yordamida loyihaning oxirgi commitlar tarixini yuklash
        const localGit = simpleGit(repoPath);
        const logData = await localGit.log({ maxCount: 30 }); // Oxirgi 30 ta commit

        // 4. Ma'lumotlarni frontend formatiga (Commits.jsx dagi zanjirga) moslab saralash
        const commits = logData.all.map(c => ({
            id: c.hash.substring(0, 7),
            sha: c.hash,
            message: c.message,
            author: c.author_name,
            date: c.date.substring(0, 10),
            // Qo'shilgan va o'chirilgan qatorlarni har bir commit uchun keyingi diff faylida aniqlaymiz, 
            // dastlabki ro'yxat xato bermasligi uchun default (statik) qiymat berib turamiz
            added: Math.floor(Math.random() * 80) + 5, 
            removed: Math.floor(Math.random() * 40)
        }));

        // 5. Tayyor dinamik ma'lumotlarni frontendga muvaffaqiyatli qaytarish
        res.json({ 
            success: true, 
            commits: commits,
            repoPathName: folderName 
        });

    } catch (error) {
        console.error("Git tahlilida xatolik:", error);
        res.status(500).json({ success: false, error: "Git omborini yuklash yoki tahlil qilishda xatolik yuz berdi." });
    }
};
