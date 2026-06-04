import React, { useState, useEffect } from 'react';
import '../styles/Diff.css';

export default function Diff({ commit, repoPathName, onBack, onAIAnalysis }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [diffFiles, setDiffFiles] = useState([]);

  // Agar App.jsx dan hali commit tanlanmay kelgan bo'lsa, xato bermasligi uchun default obyekt
  const currentCommit = commit || {
    sha: '8f3d1a2c',
    id: '8f3d1a2c',
    author: 'Amonov Soxibjon',
    message: 'Fix: Bosh sahifadagi URL qidiruv mantiqi to\'g\'rilandi',
    date: '2026-06-03'
  };

  useEffect(() => {
    const fetchDiffData = async () => {
      if (!repoPathName || !currentCommit.sha) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Backenddagi diff API endpointiga so'rov yuborish
        const response = await fetch(
          `http://localhost:5000/api/diff/commit?repoPathName=${repoPathName}&sha=${currentCommit.sha}`
        );
        const data = await response.json();

        if (data.success) {
          setDiffFiles(data.diffData);
        } else {
          setError(data.error || "Kod o'zgarishlarini yuklashda xatolik.");
        }
      } catch (err) {
        console.error(err);
        setError("Serverdan ma'lumot olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiffData();
  }, [repoPathName, currentCommit.sha]);

  // Jami statistikani dinamik hisoblash
  const totalAdded = diffFiles.reduce((s, f) => s + (f.added || 0), 0);
  const totalRemoved = diffFiles.reduce((s, f) => s + (f.removed || 0), 0);

  return (
    <div className="page">
      <div className="grid-bg" />
      
      {/* Navigatsiya paneli */}
      <nav className="navbar">
        <span className="navbar-logo" onClick={onBack}>⌥ Git<span>Analyzer</span></span>
        <span className="navbar-repo">{currentCommit.id} — {currentCommit.message}</span>
        <button className="navbar-back" onClick={onBack}>← Orqaga</button>
      </nav>

      <div className="page-container">
        {/* Sarlavha qismi */}
        <div className="diff-header">
          <div>
            <h1 className="section-title">Diff tahlil</h1>
            <p className="section-sub">{currentCommit.author} · {currentCommit.date}</p>
          </div>
          <button className="ai-btn" onClick={onAIAnalysis} disabled={loading || diffFiles.length === 0}>
            🤖 AI izohi →
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-bar" style={{ width: '50%', margin: '20px auto' }} />
            <div className="empty-icon">🔍</div>
            Kod o'zgarishlari tahlil qilinmoqda...
          </div>
        ) : error ? (
          <div className="empty-state" style={{ color: '#ff6b6b' }}>
            <div className="empty-icon">⚠</div>
            {error}
          </div>
        ) : diffFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            Ushbu commitda hech qanday fayl o'zgarmagan.
          </div>
        ) : (
          <>
            {/* 4 talik Statistika kartochkalari qatori */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">O'zgargan fayllar</div>
                <div className="stat-value c-purple">{diffFiles.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Qo'shilgan</div>
                <div className="stat-value c-green">+{totalAdded}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">O'chirilgan</div>
                <div className="stat-value c-red">-{totalRemoved}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Jami o'zgarish</div>
                <div className="stat-value c-orange">{totalAdded + totalRemoved}</div>
              </div>
            </div>

            {/* Real Kod Diff Bloklari */}
            <div className="diff-files">
              {diffFiles.map((file, i) => (
                <div key={i} className="diff-file">
                  <div className="diff-file-header">
                    <span className="diff-filename">📄 {file.file}</span>
                    <div className="diff-file-stats">
                      <span className="tag-added">+{file.added}</span>
                      <span className="tag-removed">-{file.removed}</span>
                    </div>
                  </div>
                  <div className="diff-body">
                    {file.lines.map((line, j) => (
                      <div key={j} className={`diff-line diff-${line.type}`}>
                        <span className="diff-line-content">{line.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
