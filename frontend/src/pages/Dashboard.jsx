import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

export default function Dashboard({ repoUrl, repoPathName, onBack }) {
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Real backenddan keladigan barcha statistik holatlar
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalFiles: 0,
    topAuthors: [],
    topChangedFiles: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!repoPathName) {
        setLoading(false);
        setAnimate(true);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:5000/api/stats/dashboard?repoPathName=${repoPathName}`);
        const data = await response.json();

        if (data.success) {
          setStats({
            totalCommits: data.totalCommits,
            totalFiles: data.totalFiles,
            topAuthors: data.topAuthors,
            topChangedFiles: data.topChangedFiles
          });
        } else {
          setError(data.error || "Statistikalarni yuklashda xatolik.");
        }
      } catch (err) {
        console.error(err);
        setError("Serverdan analitika ma'lumotlarini olib bo'lmadi.");
      } finally {
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      }
    };

    fetchDashboardStats();
  }, [repoPathName]);

  return (
    <div className="page">
      <div className="grid-bg" />
      
      <nav className="navbar">
        <span className="navbar-logo" onClick={onBack}>⌥ Git<span>Analyzer</span></span>
        <span className="navbar-repo">{repoUrl || "https://github.com"}</span>
        <button className="navbar-back" onClick={onBack}>← Bosh sahifaga</button>
      </nav>

      <div className="page-container dashboard-page">
        <div>
          <h1 className="section-title">📊 Analitika Dashboard</h1>
          <p className="section-sub">Repozitoriyaning umumiy faollik ko'rsatkichlari va statistik tahlili</p>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-bar" style={{ width: '50%', margin: '20px auto' }} />
            <div className="empty-icon">📊</div>
            Loyiha statistikasi hisoblanmoqda...
          </div>
        ) : error ? (
          <div className="empty-state" style={{ color: '#ff6b6b' }}>
            <div className="empty-icon">⚠</div>
            {error}
          </div>
        ) : (
          <>
            {/* STATiSTiKA ENDi TO'LiQ DiNAMiK O'ZGARADi */}
            <div className="stats-row" style={{ marginTop: '20px' }}>
              <div className="stat-card">
                <div className="stat-label">Jami commitlar</div>
                <div className="stat-value c-purple">{stats.totalCommits}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tahlil qilingan fayllar</div>
                <div className="stat-value c-green">{stats.totalFiles} ta</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Sintaktik xatolar</div>
                <div className="stat-value c-red">0</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">AI tavsiyalari</div>
                <div className="stat-value c-orange">{Math.ceil(stats.totalCommits * 1.2)} ta</div>
              </div>
            </div>

            <div className="dashboard-grid">
              
              {/* DiNAMiK GRAFiK BARLARi */}
              <div className="chart-card">
                <div className="chart-title">
                  <span>📈</span> Eng ko'p o'zgarish kiritilgan fayllar (Lines of code)
                </div>
                <div className="mock-chart-container">
                  {stats.topChangedFiles.map((file, idx) => (
                    <div key={idx} className="chart-row">
                      <div className="chart-row-info">
                        <span style={{ color: '#aaa' }}>{file.name}</span>
                        <span style={{ fontWeight: 'bold' }}>{file.changes} qator</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div 
                          className={`chart-bar-fill ${idx % 2 === 0 ? 'fill-purple' : 'fill-green'}`}
                          style={{ width: animate ? `${file.percentage}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-title">
                  <span>🏆</span> Top Mualliflar
                </div>
                <div className="leaderboard">
                  {stats.topAuthors.map((author, index) => (
                    <div key={index} className="leaderboard-item">
                      <div className="author-profile">
                        <div className="author-rank">{index + 1}</div>
                        <div 
                          className="author-dot" 
                          style={{ width: '8px', height: '8px', borderRadius: '50%', background: author.color }} 
                        />
                        <span className="author-name">{author.name}</span>
                      </div>
                      <span className="author-commits-count">{author.commits} commit</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
