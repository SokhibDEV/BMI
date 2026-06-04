import simpleGit from 'simple-git';
import * as diff from 'diff';
import path from 'path';

const REPOS_DIR = path.join(process.cwd(), 'cloned_repos');

export const getCommitDiff = async (req, res) => {
    // Frontenddan so'rov yuborilganda repo papka nomi va commit SHA kodi keladi
    const { repoPathName, sha } = req.query;

    // 1. Ma'lumotlar kelganini tekshirish
    if (!repoPathName || !sha) {
        return res.status(400).json({ success: false, error: "Repo nomi yoki Commit SHA kodi yetarli emas!" });
    }

    try {
        const repoPath = path.join(REPOS_DIR, repoPathName);
        const git = simpleGit(repoPath);

        console.log(`Commit diff olinmoqda: SHA - ${sha}`);

        // 2. simple-git yordamida ushbu commitdagi raw (xom) diff matnini olish
        const rawDiff = await git.show([sha]);

        // 3. jsdiff (diff) kutubxonasi yordamida patch matnini qismlarga ajratish
        const parsedDiffs = diff.parsePatch(rawDiff);

        // 4. Ma'lumotlarni frontend formatiga (MOCK_DIFF strukturasiga) moslab shakllantirish
        const diffData = parsedDiffs.map(fileDiff => {
            const lines = [];
            
            fileDiff.hunks.forEach(hunk => {
                // Info qatori (masalan: @@ -1,8 +1,52 @@)
                lines.push({ 
                    type: 'info', 
                    content: `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@` 
                });

                // Har bir kod qatorini tekshirib chiqish
                hunk.lines.forEach(line => {
                    let type = 'normal';
                    if (line.startsWith('+')) type = 'added';
                    if (line.startsWith('-')) type = 'removed';
                    
                    lines.push({ type, content: line });
                });
            });

            return {
                file: fileDiff.to || fileDiff.from,
                added: lines.filter(l => l.type === 'added').length,
                removed: lines.filter(l => l.type === 'removed').length,
                lines: lines
            };
        });

        // 5. Tayyorlangan dinamik ma'lumotlarni frontendga yuborish
        res.json({
            success: true,
            diffData: diffData
        });

    } catch (error) {
        console.error("Diff tahlilida xatolik:", error);
        res.status(500).json({ success: false, error: "Kod o'zgarishlarini tahlil qilishda xatolik yuz berdi." });
    }
};
