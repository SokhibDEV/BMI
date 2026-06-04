import React, { useState, useEffect } from 'react';
import '../styles/AIAnalysis.css';

export default function AIAnalysis({ commit, repoPathName, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiReport, setAiReport] = useState("");

  const currentCommit = commit || {
    sha: '8f3d1a2c',
    id: '8f3d1a2c',
    message: "feat: integrate LLM API for semantic analysis",
    author: "Yusupov O",
    date: "2025-05-16"
  };

  useEffect(() => {
    const fetchAIFeedback = async () => {
      if (!repoPathName || !currentCommit.sha) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:5000/api/ai/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repoPathName: repoPathName,
            sha: currentCommit.sha,
            message: currentCommit.message
          }),
        });

        const data = await response.json();

        if (data.success) {
          setAiReport(data.aiAnalysis);
        } else {
          setError(data.error || "AI tahlil hisobotini olishda xatolik yuz berdi.");
        }
      } catch (err) {
        console.error(err);
        setError("Server bilan aloqa o'rnatib bo'lmadi. AI moduli ulanmadi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAIFeedback();
  }, [repoPathName, currentCommit.sha, currentCommit.message]);

  return (
    <div className="page">
      <div className="grid-bg" />
      
      <nav className="navbar">
        <span className="navbar-logo" onClick={onBack}>⌥ Git<span>Analyzer</span></span>
        <span className="navbar-repo">AI Semantik Tahlil moduli</span>
        <button className="navbar-back" onClick={onBack}>← Diffga qaytish</button>
      </nav>

      <div className="page-container ai-analysis-page">
        <div>
          <h1 className="section-title">🤖 AI Fikr-mulohazasi</h1>
          <p className="section-sub">
            Commit xabari: <strong>"{currentCommit.message}"</strong> ({currentCommit.id})
          </p>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-bar" style={{ width: '50%', margin: '20px auto' }} />
            <div className="empty-icon">🤖</div>
            Google AI kod o'zgarishlarini semantik tahlil qilmoqda...
          </div>
        ) : error ? (
          <div className="empty-state" style={{ color: '#ff6b6b' }}>
            <div className="empty-icon">⚠</div>
            {error}
          </div>
        ) : (
          <div className="ai-card" style={{ position: 'relative' }}>
            
            {/* ✕ BOSILGANDA TO'G'RIDAN-TO'G'RI DIFF SAHIFASIGA QAYTARUVCHI TUGMA */}
            <button 
              onClick={onBack} // App.jsx dagi ortga qaytish funksiyasi ulandi
              style={{
                position: 'absolute',
                top: '20px',
                right: '25px',
                background: 'transparent',
                border: 'none',
                color: '#ff6b6b',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                padding: '5px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              ✕ Yopish va Orqaga
            </button>

            <div className="ai-header-block">
              <div className="ai-avatar-icon">🧠</div>
              <div>
                <h3 style={{ margin: 0, color: '#fff' }}>Large Language Model (LLM) Hisoboti</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888' }}>Tahlil tili: O'zbek tili (Tabiiy tilda izoh)</p>
              </div>
            </div>

            <div className="ai-response-section">
              <div className="ai-answer-text" style={{ whiteSpace: 'pre-wrap', paddingRight: '40px' }}>
                {aiReport}
              </div>
            </div>
            
            <div className="impact-badge impact-high" style={{ marginTop: '15px' }}>
              Tahlil holati: Muvaffaqiyatli (AI Verified)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
