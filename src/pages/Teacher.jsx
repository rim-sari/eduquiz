import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  LogOut, ClipboardList, Star, BarChart2,
  BookOpen, Download, Plus, Trash2, Eye, X, User
} from "lucide-react";
import quizLogo from "../assets/quizLogo.png";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F4F7F6; font-family: 'Mulish', sans-serif; color: #1C2B30; }

  .top-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center;
    padding: 0 3.5rem; height: 66px;
    background: rgba(253,254,254,0.75);
    backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    border-bottom: 1px solid rgba(42,61,69,0.1);
  }
  .top-nav::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 12px;
    background: linear-gradient(to bottom, transparent, rgba(253,254,254,0.6));
    pointer-events: none;
  }
  .top-nav img { height: 115px; width: auto; display: block; }

  .layout { display: flex; padding-top: 66px; min-height: 100vh; }

  .sidebar {
    width: 240px; min-height: calc(100vh - 66px);
    background: #2A3D45;
    position: fixed; top: 66px; left: 0; bottom: 0;
    display: flex; flex-direction: column; z-index: 100;
  }
  .sidebar-user { padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid rgba(235,245,238,0.1); }
  .sidebar-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(235,245,238,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; color: #EBF5EE; }
  .sidebar-name { font-size: 14px; font-weight: 600; color: #EBF5EE; margin-bottom: 2px; }
  .sidebar-email { font-size: 11px; color: rgba(235,245,238,0.45); }
  .sidebar-role-badge { display: inline-block; margin-top: 8px; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; background: rgba(232,184,109,0.18); color: #E8C87A; border: 1px solid rgba(232,184,109,0.28); }
  .sidebar-nav { flex: 1; padding: 1rem 0; }
  .nav-item { display: flex; align-items: center; gap: 11px; padding: 11px 1.5rem; font-size: 14px; font-weight: 500; color: rgba(235,245,238,0.55); cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; }
  .nav-item:hover { color: #EBF5EE; background: rgba(235,245,238,0.06); }
  .nav-item.active { color: #EBF5EE; border-left-color: #E8C87A; background: rgba(235,245,238,0.09); }
  .sidebar-bottom { padding: 1rem 1.5rem; border-top: 1px solid rgba(235,245,238,0.1); }
  .logout-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 10px 13px; background: rgba(235,245,238,0.07); border: 1px solid rgba(235,245,238,0.12); border-radius: 9px; color: rgba(235,245,238,0.65); font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Mulish', sans-serif; transition: all 0.15s; }
  .logout-btn:hover { background: rgba(235,245,238,0.13); color: #EBF5EE; }

  .main { margin-left: 240px; flex: 1; padding: 2.5rem; }
  .page-header { margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
  .page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #2A3D45; letter-spacing: -0.5px; }
  .page-sub { font-size: 14px; color: #5B7C88; margin-top: 5px; }

  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat-box { background: #fff; border: 1px solid rgba(42,61,69,0.1); border-radius: 14px; padding: 1.25rem 1.5rem; }
  .stat-label { font-size: 11px; color: #5B7C88; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-value { font-size: 30px; font-family: 'Cormorant Garamond', serif; font-weight: 700; color: #2A3D45; }
  .stat-sub { font-size: 12px; color: #A8BFBF; margin-top: 4px; }

  .card { background: #fff; border: 1px solid rgba(42,61,69,0.1); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
  .card-title { font-size: 15px; font-weight: 600; color: #2A3D45; }

  .quiz-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(42,61,69,0.07); }
  .quiz-row:last-child { border-bottom: none; }
  .quiz-name { font-size: 14px; font-weight: 600; color: #2A3D45; margin-bottom: 3px; }
  .quiz-meta { font-size: 12px; color: #5B7C88; }
  .quiz-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-open { background: #EBF5EE; color: #2A7A45; }
  .badge-closed { background: #F1EEE8; color: #7A6040; }
  .badge-high { background: #EBF5EE; color: #2A7A45; }
  .badge-mid { background: #FFF8E6; color: #9A6B00; }
  .badge-low { background: #FAECE7; color: #993C1D; }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Mulish', sans-serif; transition: all 0.15s; }
  .btn-primary { background: #2A3D45; color: #fff; }
  .btn-primary:hover { background: #3E5A64; }
  .btn-sm { padding: 6px 13px; font-size: 12px; }
  .btn-outline { background: transparent; color: #2A3D45; border: 1.5px solid rgba(42,61,69,0.2); }
  .btn-outline:hover { background: #EBF5EE; }
  .btn-icon { padding: 6px 8px; background: transparent; border: 1px solid rgba(42,61,69,0.15); border-radius: 7px; color: #5B7C88; cursor: pointer; display: inline-flex; align-items: center; transition: all 0.15s; font-family: 'Mulish', sans-serif; }
  .btn-icon:hover { background: #EBF5EE; color: #2A3D45; }
  .btn-icon.danger:hover { background: #FAECE7; color: #993C1D; border-color: #E5A090; }

  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #A8BFBF; padding: 8px 12px; border-bottom: 1px solid rgba(42,61,69,0.08); font-weight: 600; }
  .table td { padding: 12px; border-bottom: 1px solid rgba(42,61,69,0.06); }
  .table tr:last-child td { border-bottom: none; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: #fff; border-radius: 18px; padding: 2rem; width: 100%; max-width: 600px; max-height: 85vh; overflow-y: auto; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #2A3D45; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(42,61,69,0.08); }

  .field { margin-bottom: 1.1rem; }
  .field label { display: block; font-size: 11px; font-weight: 700; color: #5B7C88; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .field input, .field select { width: 100%; padding: 10px 13px; background: #F4F7F6; border: 1.5px solid transparent; border-radius: 8px; color: #2A3D45; font-size: 14px; font-family: 'Mulish', sans-serif; outline: none; transition: all 0.2s; }
  .field input:focus, .field select:focus { border-color: #5B7C88; background: #fff; }

  .q-block { border: 1px solid rgba(42,61,69,0.1); border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; background: #F4F7F6; }
  .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 11px; font-weight: 700; color: #A8BFBF; text-transform: uppercase; letter-spacing: 0.06em; }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .option-row { display: flex; align-items: center; gap: 8px; }
  .option-letter { font-size: 11px; font-weight: 700; color: #A8BFBF; width: 16px; }
  .add-q-btn { width: 100%; padding: 10px; border: 1.5px dashed rgba(42,61,69,0.2); border-radius: 8px; background: transparent; font-size: 13px; color: #5B7C88; cursor: pointer; font-family: 'Mulish', sans-serif; margin-top: 0.75rem; transition: all 0.15s; }
  .add-q-btn:hover { border-color: #2A3D45; color: #2A3D45; }
  .empty { text-align: center; padding: 3rem; color: #A8BFBF; font-size: 14px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
`;

const mockQuizzes = [
  { id: 1, title: "Algebra Fundamentals", subject: "Mathematics", questions: 5, status: "open", submissions: 18, avg: 76 },
  { id: 2, title: "The Solar System", subject: "Science", questions: 4, status: "open", submissions: 22, avg: 88 },
  { id: 3, title: "World War II Timeline", subject: "History", questions: 6, status: "closed", submissions: 25, avg: 62 },
];

const mockSubmissions = [
  { student: "Ahmed B.", quiz: "Algebra Fundamentals", score: 4, total: 5, pct: 80, date: "May 19" },
  { student: "Sara M.", quiz: "Algebra Fundamentals", score: 3, total: 5, pct: 60, date: "May 19" },
  { student: "Youssef K.", quiz: "The Solar System", score: 4, total: 4, pct: 100, date: "May 18" },
  { student: "Nadia R.", quiz: "The Solar System", score: 3, total: 4, pct: 75, date: "May 18" },
  { student: "Ahmed B.", quiz: "World War II Timeline", score: 4, total: 6, pct: 67, date: "May 15" },
];

const mockClasses = [
  { id: 1, name: "Math 10-A", students: 24 },
  { id: 2, name: "Science 9-B", students: 19 },
];

function newQ() { return { id: Date.now(), text: "", options: ["", "", "", ""], correct: 0 }; }

export default function Teacher() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState({ name: "", email: "" });
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [showCreate, setShowCreate] = useState(false);
  const [showSubs, setShowSubs] = useState(null);
  const [draft, setDraft] = useState({ title: "", subject: "", questions: [newQ()] });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ name: u.email.split("@")[0], email: u.email });
    });
  }, []);

  async function logout() { await supabase.auth.signOut(); navigate("/login"); }

  function saveQuiz() {
    if (!draft.title.trim()) return;
    setQuizzes(p => [...p, { ...draft, id: Date.now(), status: "open", submissions: 0, avg: 0 }]);
    setShowCreate(false);
    setDraft({ title: "", subject: "", questions: [newQ()] });
  }

  function toggleStatus(id) {
    setQuizzes(p => p.map(q => q.id === id ? { ...q, status: q.status === "open" ? "closed" : "open" } : q));
  }

  const totalSubs = quizzes.reduce((a, q) => a + q.submissions, 0);
  const avgScore = quizzes.length ? Math.round(quizzes.reduce((a, q) => a + q.avg, 0) / quizzes.length) : 0;

  const navItems = [
    { id: "dashboard",   label: "Dashboard",    icon: <BarChart2 size={16} /> },
    { id: "quizzes",     label: "My Quizzes",   icon: <ClipboardList size={16} /> },
    { id: "submissions", label: "Submissions",  icon: <Star size={16} /> },
    { id: "classes",     label: "Classes",      icon: <BookOpen size={16} /> },
  ];

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Mulish:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <nav className="top-nav">
        <img src={quizLogo} alt="EduQuiz" />
      </nav>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-user">
            <div className="sidebar-avatar"><User size={18} /></div>
            <div className="sidebar-name">{user.name}</div>
            <div className="sidebar-email">{user.email}</div>
            <span className="sidebar-role-badge">Teacher</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
                {item.icon} {item.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={logout}><LogOut size={15} /> Se déconnecter</button>
          </div>
        </aside>

        <main className="main">

          {tab === "dashboard" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Welcome, {user.name}</h1>
                  <p className="page-sub">Overview of your classes and quizzes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={15} /> New quiz</button>
              </div>
              <div className="stats-row">
                <div className="stat-box"><div className="stat-label">Active quizzes</div><div className="stat-value">{quizzes.filter(q => q.status === "open").length}</div><div className="stat-sub">Currently open</div></div>
                <div className="stat-box"><div className="stat-label">Total submissions</div><div className="stat-value">{totalSubs}</div><div className="stat-sub">Across all quizzes</div></div>
                <div className="stat-box"><div className="stat-label">Avg. class score</div><div className="stat-value">{avgScore}%</div><div className="stat-sub">All quizzes</div></div>
                <div className="stat-box"><div className="stat-label">Classes</div><div className="stat-value">{mockClasses.length}</div><div className="stat-sub">Assigned to you</div></div>
              </div>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Your quizzes</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}><Plus size={13} /> Create</button>
                </div>
                {quizzes.map(q => (
                  <div className="quiz-row" key={q.id}>
                    <div>
                      <div className="quiz-name">{q.title}</div>
                      <div className="quiz-meta">{q.subject} · {q.questions} questions · {q.submissions} submissions · avg {q.avg}%</div>
                    </div>
                    <div className="quiz-actions">
                      <span className={`badge ${q.status === "open" ? "badge-open" : "badge-closed"}`}>{q.status}</span>
                      <button className="btn-icon" onClick={() => setShowSubs(q)}><Eye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => setQuizzes(p => p.filter(x => x.id !== q.id))}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "quizzes" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">My Quizzes</h1>
                  <p className="page-sub">Create, manage and close your quizzes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={15} /> New quiz</button>
              </div>
              <div className="card">
                {quizzes.map(q => (
                  <div className="quiz-row" key={q.id}>
                    <div>
                      <div className="quiz-name">{q.title}</div>
                      <div className="quiz-meta">{q.subject} · {q.questions} questions · {q.submissions} submissions</div>
                    </div>
                    <div className="quiz-actions">
                      <span className={`badge ${q.status === "open" ? "badge-open" : "badge-closed"}`}>{q.status}</span>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(q.id)}>{q.status === "open" ? "Close" : "Open"}</button>
                      <button className="btn-icon" onClick={() => setShowSubs(q)}><Eye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => setQuizzes(p => p.filter(x => x.id !== q.id))}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "submissions" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Submissions</h1>
                  <p className="page-sub">All student responses to your quizzes.</p>
                </div>
                <button className="btn btn-outline"><Download size={14} /> Export CSV</button>
              </div>
              <div className="card">
                <table className="table">
                  <thead><tr><th>Student</th><th>Quiz</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
                  <tbody>
                    {mockSubmissions.map((s, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{s.student}</td>
                        <td style={{ color: "#5B7C88" }}>{s.quiz}</td>
                        <td>{s.score}/{s.total}</td>
                        <td><span className={`badge ${s.pct >= 80 ? "badge-high" : s.pct >= 50 ? "badge-mid" : "badge-low"}`}>{s.pct}%</span></td>
                        <td style={{ color: "#A8BFBF" }}>{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === "classes" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Classes</h1>
                  <p className="page-sub">Your assigned classes (view only).</p>
                </div>
              </div>
              <div className="card">
                <table className="table">
                  <thead><tr><th>Class name</th><th>Students</th></tr></thead>
                  <tbody>
                    {mockClasses.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ color: "#5B7C88" }}>{c.students} students</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {/* CREATE QUIZ MODAL */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Create new quiz</div>
              <button className="btn-icon" onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <div className="two-col">
              <div className="field"><label>Title</label><input placeholder="e.g. Algebra Fundamentals" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} /></div>
              <div className="field"><label>Subject</label><input placeholder="e.g. Mathematics" value={draft.subject} onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))} /></div>
            </div>
            <div style={{ borderTop: "1px solid rgba(42,61,69,0.08)", paddingTop: "1rem" }}>
              {draft.questions.map((q, qi) => (
                <div className="q-block" key={q.id}>
                  <div className="q-header">
                    <span>Question {qi + 1}</span>
                    {draft.questions.length > 1 && (
                      <button className="btn-icon danger" onClick={() => setDraft(d => ({ ...d, questions: d.questions.filter(x => x.id !== q.id) }))}><Trash2 size={13} /></button>
                    )}
                  </div>
                  <input style={{ width: "100%", padding: "9px 12px", background: "#fff", border: "1px solid rgba(42,61,69,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "Mulish,sans-serif", outline: "none", marginBottom: 10 }}
                    placeholder="Question text..."
                    value={q.text}
                    onChange={e => setDraft(d => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, text: e.target.value } : x) }))} />
                  <div className="options-grid">
                    {q.options.map((opt, oi) => (
                      <div className="option-row" key={oi}>
                        <span className="option-letter">{["A","B","C","D"][oi]}</span>
                        <input style={{ flex: 1, padding: "7px 10px", background: "#fff", border: "1px solid rgba(42,61,69,0.15)", borderRadius: 6, fontSize: 12, fontFamily: "Mulish,sans-serif", outline: "none" }}
                          placeholder={`Option ${["A","B","C","D"][oi]}`} value={opt}
                          onChange={e => setDraft(d => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, options: x.options.map((o, i) => i === oi ? e.target.value : o) } : x) }))} />
                        <input type="radio" checked={q.correct === oi} title="Mark correct"
                          onChange={() => setDraft(d => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, correct: oi } : x) }))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="add-q-btn" onClick={() => setDraft(d => ({ ...d, questions: [...d.questions, newQ()] }))}>+ Add question</button>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveQuiz}>Publish quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {showSubs && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{showSubs.title} — Submissions</div>
              <button className="btn-icon" onClick={() => setShowSubs(null)}><X size={16} /></button>
            </div>
            <table className="table">
              <thead><tr><th>Student</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
              <tbody>
                {mockSubmissions.filter(s => s.quiz === showSubs.title).map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{s.student}</td>
                    <td>{s.score}/{s.total}</td>
                    <td><span className={`badge ${s.pct >= 80 ? "badge-high" : s.pct >= 50 ? "badge-mid" : "badge-low"}`}>{s.pct}%</span></td>
                    <td style={{ color: "#A8BFBF" }}>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-footer">
              <button className="btn btn-outline"><Download size={13} /> Export</button>
              <button className="btn btn-primary" onClick={() => setShowSubs(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}