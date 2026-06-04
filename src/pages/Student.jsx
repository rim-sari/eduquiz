import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  LogOut, ClipboardList, Star, CheckCircle,
  ChevronRight, Download, BarChart2
} from "lucide-react";
import quizLogo from "../assets/quizLogo.png";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F4F7F6; font-family: 'Mulish', sans-serif; color: #1C2B30; }

  .portal-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 3.5rem; height: 66px;
    background: rgba(253,254,254,0.75);
    backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    border-bottom: 1px solid rgba(42,61,69,0.1);
  }
  .portal-nav::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 12px;
    background: linear-gradient(to bottom, transparent, rgba(253,254,254,0.6));
    pointer-events: none;
  }
  .nav-logo img { height: 115px; width: auto; display: block; }
  .nav-right { display: flex; align-items: center; gap: 1rem; }
  .nav-user-name { font-size: 13px; font-weight: 600; color: #2A3D45; }
  .nav-user-email { font-size: 11px; color: #5B7C88; }
  .role-pill {
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: #EBF5EE; color: #2A7A45; border: 1px solid #AACFB4;
  }
  .logout-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 20px; background: #2A3D45; color: #fff;
    border: none; border-radius: 40px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Mulish', sans-serif; transition: all 0.2s;
  }
  .logout-btn:hover { background: #3E5A64; transform: translateY(-1px); }

  .tab-wrap {
    position: sticky; top: 66px; z-index: 90;
    background: rgba(244,247,246,0.95); backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(42,61,69,0.08);
    padding: 0 3.5rem; display: flex;
  }
  .tab-btn {
    padding: 14px 20px; font-size: 14px; font-weight: 500; color: #5B7C88;
    border: none; background: transparent; cursor: pointer;
    font-family: 'Mulish', sans-serif; border-bottom: 2.5px solid transparent;
    transition: all 0.15s; display: flex; align-items: center; gap: 7px;
  }
  .tab-btn:hover { color: #2A3D45; }
  .tab-btn.active { color: #2A3D45; border-bottom-color: #2A3D45; font-weight: 600; }

  .page { padding: 2.5rem 3.5rem; }
  .page-header { margin-bottom: 2rem; }
  .page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #2A3D45; letter-spacing: -0.5px; }
  .page-sub { font-size: 14px; color: #5B7C88; margin-top: 5px; }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat-box { background: #fff; border: 1px solid rgba(42,61,69,0.1); border-radius: 14px; padding: 1.25rem 1.5rem; }
  .stat-label { font-size: 12px; color: #5B7C88; font-weight: 500; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
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
  .badge-submitted { background: #E1F0FF; color: #1A5FAA; }
  .badge-high { background: #EBF5EE; color: #2A7A45; }
  .badge-mid { background: #FFF8E6; color: #9A6B00; }
  .badge-low { background: #FAECE7; color: #993C1D; }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Mulish', sans-serif; transition: all 0.15s; }
  .btn-primary { background: #2A3D45; color: #fff; }
  .btn-primary:hover { background: #3E5A64; }
  .btn-sm { padding: 6px 13px; font-size: 12px; }
  .btn-outline { background: transparent; color: #2A3D45; border: 1.5px solid rgba(42,61,69,0.2); }
  .btn-outline:hover { background: #EBF5EE; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #A8BFBF; padding: 8px 12px; border-bottom: 1px solid rgba(42,61,69,0.08); font-weight: 600; }
  .table td { padding: 12px; border-bottom: 1px solid rgba(42,61,69,0.06); }
  .table tr:last-child td { border-bottom: none; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: #fff; border-radius: 18px; padding: 2rem; width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #2A3D45; margin-bottom: 1.5rem; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(42,61,69,0.08); }
  .option-btn { width: 100%; text-align: left; padding: 11px 14px; border: 1.5px solid rgba(42,61,69,0.12); border-radius: 9px; margin-bottom: 8px; background: #F4F7F6; font-size: 14px; cursor: pointer; font-family: 'Mulish', sans-serif; transition: all 0.15s; color: #2A3D45; }
  .option-btn:hover { border-color: #2A3D45; background: #EBF5EE; }
  .option-btn.selected { border-color: #2A3D45; background: #EBF5EE; font-weight: 600; }
  .q-block { margin-bottom: 1.5rem; }
  .q-text { font-size: 14px; font-weight: 600; color: #2A3D45; margin-bottom: 10px; line-height: 1.5; }
  .empty { text-align: center; padding: 3rem; color: #A8BFBF; font-size: 14px; }
`;

export default function Student() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState({ name: "", email: "" });
  const [quizzes, setQuizzes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ name: u.email.split("@")[0], email: u.email });
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function openQuiz(q) { 
    setActiveQuiz(q); 
    setAnswers({}); 
    setSubmitted(false); 
  }

  function submitQuiz() {
    if (!activeQuiz || !activeQuiz.questions) return;
    
    const score = activeQuiz.questions.filter(q => answers[q.id] === q.correct).length;
    setQuizzes(prev => prev.map(q =>
      q.id === activeQuiz.id ? { ...q, submitted: true, score, total: activeQuiz.questions.length } : q
    ));
    setSubmitted(true);
  }

  const avgPct = grades.length
    ? Math.round(grades.reduce((a, g) => a + g.pct, 0) / grades.length) : 0;
  const pending = quizzes.filter(q => q.status === "open" && !q.submitted);

  const tabs = [
    { id: "dashboard", label: "Dashboard",   icon: <BarChart2 size={15} /> },
    { id: "quizzes",   label: "My Quizzes",  icon: <ClipboardList size={15} /> },
    { id: "grades",    label: "My Grades",   icon: <Star size={15} /> },
  ];

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Mulish:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <nav className="portal-nav">
        <div className="nav-logo"><img src={quizLogo} alt="EduQuiz" /></div>
        <div className="nav-right">
          <div>
            <div className="nav-user-name">{user.name}</div>
            <div className="nav-user-email">{user.email}</div>
          </div>
          <span className="role-pill">Student</span>
          <button className="logout-btn" onClick={logout}><LogOut size={14} /> Sign out</button>
        </div>
      </nav>

      <div className="tab-wrap" style={{ marginTop: 66 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="page">
        {tab === "dashboard" && (
          <>
            <div className="page-header">
              <h1 className="page-title">Good morning, {user.name}</h1>
              <p className="page-sub">Here's what's happening in your classes today.</p>
            </div>
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-label">Pending quizzes</div>
                <div className="stat-value">{pending.length}</div>
                <div className="stat-sub">Open & not submitted</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{quizzes.filter(q => q.submitted).length}</div>
                <div className="stat-sub">Total submissions</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Average score</div>
                <div className="stat-value">{avgPct}%</div>
                <div className="stat-sub">Across all quizzes</div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Pending quizzes</span>
              </div>
              {pending.length === 0 ? (
                <div className="empty">
                  <CheckCircle size={28} style={{ marginBottom: 8, color: "#AACFB4" }} /><p>All caught up!</p>
                </div>
              ) : pending.map(q => (
                <div className="quiz-row" key={q.id}>
                  <div>
                    <div className="quiz-name">{q.title}</div>
                    <div className="quiz-meta">{q.subject} · {q.questions?.length || 0} questions</div>
                  </div>
                  <div className="quiz-actions">
                    <span className="badge badge-open">Open</span>
                    <button className="btn btn-primary btn-sm" onClick={() => { setTab("quizzes"); openQuiz(q); }}>
                      Start <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent grades</span>
                <button className="btn btn-outline btn-sm" onClick={() => setTab("grades")}>View all</button>
              </div>
              {grades.length === 0 ? (
                <div className="empty"><p>No grades recorded yet.</p></div>
              ) : (
                <table className="table">
                  <thead><tr><th>Quiz</th><th>Subject</th><th>Score</th><th>Date</th></tr></thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{g.quiz}</td>
                        <td style={{ color: "#5B7C88" }}>{g.subject}</td>
                        <td><span className={`badge ${g.pct >= 80 ? "badge-high" : g.pct >= 50 ? "badge-mid" : "badge-low"}`}>{g.score}/{g.total} — {g.pct}%</span></td>
                        <td style={{ color: "#A8BFBF" }}>{g.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {tab === "quizzes" && (
          <>
            <div className="page-header">
              <h1 className="page-title">My Quizzes</h1>
              <p className="page-sub">All quizzes assigned to you.</p>
            </div>
            <div className="card">
              {quizzes.length === 0 ? (
                <div className="empty"><p>No quizzes available.</p></div>
              ) : quizzes.map(q => (
                <div className="quiz-row" key={q.id}>
                  <div>
                    <div className="quiz-name">{q.title}</div>
                    <div className="quiz-meta">{q.subject} · {q.questions?.length || 0} questions</div>
                  </div>
                  <div className="quiz-actions">
                    {q.submitted ? (
                      <>
                        <span className="badge badge-submitted">Submitted</span>
                        {q.score !== undefined && (
                          <span className={`badge ${q.score/q.total >= 0.8 ? "badge-high" : q.score/q.total >= 0.5 ? "badge-mid" : "badge-low"}`}>{q.score}/{q.total}</span>
                        )}
                      </>
                    ) : q.status === "open" ? (
                      <>
                        <span className="badge badge-open">Open</span>
                        <button className="btn btn-primary btn-sm" onClick={() => openQuiz(q)}>Take quiz <ChevronRight size={13} /></button>
                      </>
                    ) : (
                      <span className="badge badge-closed">Closed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "grades" && (
          <>
            <div className="page-header">
              <h1 className="page-title">My Grades</h1>
              <p className="page-sub">Your performance across all completed quizzes.</p>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Grade history</span>
                <button className="btn btn-outline btn-sm"><Download size={13} /> Export</button>
              </div>
              {grades.length === 0 ? (
                <div className="empty"><p>No history available.</p></div>
              ) : (
                <table className="table">
                  <thead><tr><th>Quiz</th><th>Subject</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{g.quiz}</td>
                        <td style={{ color: "#5B7C88" }}>{g.subject}</td>
                        <td>{g.score}/{g.total}</td>
                        <td><span className={`badge ${g.pct >= 80 ? "badge-high" : g.pct >= 50 ? "badge-mid" : "badge-low"}`}>{g.pct}%</span></td>
                        <td style={{ color: "#A8BFBF" }}>{g.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {activeQuiz && activeQuiz.questions && (
        <div className="modal-overlay" onClick={() => !submitted && setActiveQuiz(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{activeQuiz.title}</div>
            {submitted ? (
              <>
                <div style={{ background: "#EBF5EE", borderRadius: 12, padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: 42, fontFamily: "Cormorant Garamond,serif", fontWeight: 700, color: "#2A7A45" }}>
                    {activeQuiz.questions.filter(q => answers[q.id] === q.correct).length}/{activeQuiz.questions.length}
                  </div>
                  <p style={{ fontSize: 14, color: "#2A7A45", marginTop: 4 }}>Submitted successfully</p>
                </div>
                {activeQuiz.questions.map((q, qi) => (
                  <div className="q-block" key={q.id}>
                    <p className="q-text">{qi + 1}. {q.text}</p>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ padding: "10px 14px", borderRadius: 9, marginBottom: 7, fontSize: 13, background: oi === q.correct ? "#EBF5EE" : answers[q.id] === oi ? "#FAECE7" : "#F4F7F6", color: oi === q.correct ? "#2A7A45" : answers[q.id] === oi ? "#993C1D" : "#2A3D45", border: `1.5px solid ${oi === q.correct ? "#AACFB4" : answers[q.id] === oi ? "#E5A090" : "rgba(42,61,69,0.1)"}` }}>
                        {opt}{oi === q.correct ? " ✓" : ""}
                      </div>
                    ))}
                  </div>
                ))}
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={() => setActiveQuiz(null)}>Close</button>
                </div>
              </>
            ) : (
              <>
                {activeQuiz.questions.map((q, qi) => (
                  <div className="q-block" key={q.id}>
                    <p className="q-text">{qi + 1}. {q.text}</p>
                    {q.options.map((opt, oi) => (
                      <button key={oi} className={`option-btn ${answers[q.id] === oi ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}>{opt}</button>
                    ))}
                  </div>
                ))}
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={() => setActiveQuiz(null)}>Cancel</button>
                  <button className="btn btn-primary" disabled={Object.keys(answers).length < activeQuiz.questions.length} onClick={submitQuiz}>Submit quiz</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}