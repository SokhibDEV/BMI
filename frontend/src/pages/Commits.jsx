import { useState } from "react";
import '../styles/Commits.css'

const COLORS = ["#a89bff", "#00d296", "#ffaa5c", "#ff6b6b", "#5cb8ff"];
const getColor = (author) => COLORS[author ? author.charCodeAt(0) % COLORS.length : 0];
const getInitials = (author) => author ? author.split(" ").map(w => w[0]).join("").toUpperCase() : "Git";

const PAGE_SIZE = 5;

// App.jsx dan kelayotgan real "commits" propini qabul qilamiz
export default function Commits({ repoUrl, commits = [], onBack, onSelectCommit }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Agar backenddan hali ma'lumot kelmagan bo'lsa, bo'sh massiv bilan ishlaydi
  const currentCommits = commits;

  const filtered = currentCommits
    .filter(c => 
      c.message.toLowerCase().includes(search.toLowerCase()) || 
      c.author.toLowerCase().includes(search.toLowerCase()) || 
      c.id.includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      return (b.added + b.removed) - (a.added + a.removed);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Statistikani real kelgan commitlar asosida dinamik hisoblaymiz
  const totalAdded = currentCommits.reduce((s, c) => s + (c.added || 0), 0);
  const totalRemoved = currentCommits.reduce((s, c) => s + (c.removed || 0), 0);
  const authors = [...new Set(currentCommits.map(c => c.author))].length;

  return (
    <div className="page">
      <div className="grid-bg" />
      <nav className="navbar">
        <span className="navbar-logo" onClick={onBack}>⌥ Git<span>Analyzer</span></span>
        <span className="navbar-repo">{repoUrl || "https://github.com"}</span>
        <button className="navbar-back" onClick={onBack}>← Orqaga</button>
      </nav>

      <div className="page-container">
        <div className="commits-header">
          <div>
            <h1 className="section-title">Commit tarixi</h1>
            <p className="commits-count">{filtered.length} ta commit topildi</p>
          </div>

          <div className="filter-bar">
            <input 
              className="filter-input" 
              placeholder="Qidirish..." 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
            />
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Yangi avval</option>
              <option value="oldest">Eski avval</option>
              <option value="most-changes">Ko'p o'zgarish</option>
            </select>
          </div>
        </div>

        {/* Dinamik Statistik Kartochkalar qatori */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Jami commitlar</div>
            <div className="stat-value c-purple">{currentCommits.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Qo'shilgan qatorlar</div>
            <div className="stat-value c-green">+{totalAdded}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">O'chirilgan qatorlar</div>
            <div className="stat-value c-red">-{totalRemoved}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mualliflar</div>
            <div className="stat-value c-orange">{authors}</div>
          </div>
        </div>

        {/* Jonli Commitlar Ro'yxati */}
        <div className="commit-list">
          {paginated.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              Hech narsa topilmadi
            </div>
          ) : (
            paginated.map(commit => (
              <div key={commit.sha} className="commit-item" onClick={() => onSelectCommit && onSelectCommit(commit)}>
                <div className="commit-avatar" style={{ background: `${getColor(commit.author)}22`, color: getColor(commit.author) }}>
                  {getInitials(commit.author)}
                </div>
                <div className="commit-main">
                  <div className="commit-message">{commit.message}</div>
                  <div className="commit-meta">
                    <span>{commit.author}</span>
                    <span>{commit.date}</span>
                  </div>
                </div>
                <div className="commit-changes">
                  <span className="tag-added">+{commit.added}</span>
                  <span className="tag-removed">-{commit.removed}</span>
                </div>
                <span className="commit-hash">{commit.id}</span>
                <span className="commit-arrow">›</span>
              </div>
            ))
          )}
        </div>

          {/* Pagination bo'limi */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Oldingi</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Keyingi →</button>
          </div>
        )}
      </div>
    </div>
  );
}
