import "../styles/Home.css";
import { useState } from "react";

const EXAMPLES = [
  "https://github.com/facebook/react",
  "https://github.com/vercel/next.js",
  "https://github.com/vuejs/vue",
];

const FEATURES = [
  {
    icon: "🔍",
    title: "Diff tahlil",
    desc: "Qo'shilgan, o'chirilgan va o'zgargan kod bloklarini ko'rsatadi",
  },
  {
    icon: "🤖",
    title: "AI izohi",
    desc: "LLM yordamida nima va nima uchun o'zgarganini tushuntiradi",
  },
  {
    icon: "📊",
    title: "Dashboard",
    desc: "Statistika va grafik ko'rinishida hisobot taqdim etadi",
  },
];

export default function Home({ onAnalyze, onDashboard }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidGitUrl = (val) =>
    val.startsWith("https://github.com/") ||
    val.startsWith("https://gitlab.com/") ||
    val.endsWith(".git");

  // Real Backend integratsiyasi shu funksiyada amalga oshirildi
  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Iltimos, repo URL kiriting");
      return;
    }

    if (!isValidGitUrl(url.trim())) {
      setError("Noto'g'ri URL. GitHub yoki GitLab havolasi kiriting");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Express.js serverimizga real so'rov yuborish
      const response = await fetch("http://localhost:5000/api/git/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: url.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Ma'lumotlarni App.jsx ga uzatamiz (commits ro'yxati va papka nomi)
        onAnalyze(data.commits, data.repoPathName, url.trim());
      } else {
        setError(data.error || "Git omborini tahlil qilishda xatolik yuz berdi.");
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan aloqa o'rnatib bo'lmadi. Backend yoniqligini tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <div className="app">
      <div className="grid-bg" />
      <div className="glow" />
      <div className="glow2" />
      <div className="container">
        <div className="badge">
          <span className="dot" /> Git Diff Analyzer — v1.0
        </div>
        <h1>
          Dasturiy <br />
          <span className="accent">versiyalar</span> <br />
          <span className="accent2">tahlili</span>
        </h1>
        <p className="subtitle">
          GitHub yoki GitLab repo URL'ini kiriting — commit tarixi, kod o'zgarishlari va AI izohlari bir joyda.
        </p>

        {loading && <div className="loading-bar" />}

        <div className="input-group">
          <div className="input-icon">⌥</div>
          <input
            className="url-input"
            type="text"
            placeholder="https://github.com/username/repo"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Klonlanmoqda..." : "Tahlil qilish →"}
          </button>
        </div>

        {error && <p className="error-msg">⚠ {error}</p>}

        <div className="example-label">Misol repo'lar</div>
        <div className="examples">
          {EXAMPLES.map((ex) => (
            <span
              key={ex}
              className="example-pill"
              onClick={() => {
                setUrl(ex);
                setError("");
              }}
            >
              {ex.replace("https://github.com/", "")}
            </span>
          ))}
        </div>

        <div className="divider" />

        <div className="features">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="feature-card"
              onClick={f.title === "Dashboard" ? () => onDashboard(url) : undefined}
              style={f.title === "Dashboard" ? { cursor: "pointer" } : {}}
            >
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
