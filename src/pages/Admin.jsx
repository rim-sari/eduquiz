import { useState, useEffect } from "react";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  BarChart2,
  ClipboardList,
  Users,
  UserCheck,
  Shield,
  Plus,
  Trash2,
  Edit2,
  X,
  Eye,
  EyeOff,
  User,
  BookOpen,
  Star,
  Download,
  Home,
} from "lucide-react";
import quizLogo from "../assets/quizLogo.png";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F4F7F6; font-family: 'Mulish', sans-serif; color: #1C2B30; }

  /* ── TOP NAV ── */
  .top-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
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

  .nav-right { display: flex; align-items: center; gap: 1.5rem; }
  .logout-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 20px; background: #1C2B30; color: #fff;
    border: none; border-radius: 40px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Mulish', sans-serif; transition: all 0.2s;
  }
  .logout-btn:hover { background: #2A3D45; transform: translateY(-1px); }

  /* ── LAYOUT ── */
  .layout { display: flex; padding-top: 66px; min-height: 100vh; }

  /* ── SIDEBAR FIXED STACK ── */
  .sidebar {
    width: 240px; height: calc(100vh - 66px);
    background: #1C2B30;
    position: fixed; top: 66px; left: 0; bottom: 0;
    z-index: 100;
    padding: 24px 16px;
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
  }
  
  .sidebar-user { 
    display: block !important;
    width: 100%;
    padding-bottom: 20px; 
    border-bottom: 1px solid rgba(235,245,238,0.08);
    margin-bottom: 24px;
    flex-shrink: 0;
  }
  .sidebar-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(235,245,238,0.12); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #EBF5EE; }
  .sidebar-name { font-size: 15px; font-weight: 600; color: #EBF5EE; margin-bottom: 4px; display: block; line-height: 1.2; }
  .sidebar-email { font-size: 12px; color: rgba(235,245,238,0.4); margin-bottom: 12px; display: block; word-break: break-all; line-height: 1.2; }
  .sidebar-role-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; background: rgba(153,60,29,0.2); color: #E8997A; border: 1px solid rgba(153,60,29,0.3); }
  
  .sidebar-nav { 
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100%;
    margin-top: 0px;
  }
  
  .nav-item { 
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 14px !important; 
    padding: 12px 16px !important; 
    font-size: 15px; 
    font-weight: 500; 
    color: rgba(235,245,238,0.5); 
    cursor: pointer; 
    background: transparent;
    border: none; 
    width: 100%; 
    border-radius: 12px;
    font-family: 'Mulish', sans-serif; 
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .nav-item:hover { color: #EBF5EE; background: rgba(235,245,238,0.05); }
  .nav-item.active { 
    color: #EBF5EE; 
    background: rgba(253,254,254,0.1); 
    font-weight: 600; 
  }
  .nav-item svg { flex-shrink: 0 !important; color: inherit; display: block !important; }
  .nav-item span { display: inline-block !important; color: inherit; white-space: nowrap; line-height: 1; }

  /* ── MAIN ── */
  .main { margin-left: 240px; flex: 1; padding: 2.5rem; }
  .page-header { margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
  .page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #2A3D45; letter-spacing: -0.5px; }
  .page-sub { font-size: 14px; color: #5B7C88; margin-top: 5px; }

  /* ── STATS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .stat-box { background: #fff; border: 1px solid rgba(42,61,69,0.1); border-radius: 14px; padding: 1.25rem 1.5rem; }
  .stat-label { font-size: 11px; color: #5B7C88; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-value { font-size: 30px; font-family: 'Cormorant Garamond', serif; font-weight: 700; color: #2A3D45; }
  .stat-sub { font-size: 12px; color: #A8BFBF; margin-top: 4px; }

  /* ── CARD ── */
  .card { background: #fff; border: 1px solid rgba(42,61,69,0.1); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
  .card-title { font-size: 15px; font-weight: 600; color: #2A3D45; }

  /* ── TABLE ── */
  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #A8BFBF; padding: 8px 12px; border-bottom: 1px solid rgba(42,61,69,0.08); font-weight: 600; }
  .table td { padding: 12px; border-bottom: 1px solid rgba(42,61,69,0.06); vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-student { background: #EBF5EE; color: #2A7A45; }
  .badge-teacher { background: #FFF8E6; color: #9A6B00; }
  .badge-admin { background: #FAECE7; color: #993C1D; }
  .badge-open { background: #EBF5EE; color: #2A7A45; }
  .badge-closed { background: #F1EEE8; color: #7A6040; }
  .badge-high { background: #EBF5EE; color: #2A7A45; }
  .badge-mid { background: #FFF8E6; color: #9A6B00; }
  .badge-low { background: #FAECE7; color: #993C1D; }

  /* ── BUTTONS ── */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'Mulish', sans-serif; transition: all 0.15s; }
  .btn-primary { background: #2A3D45; color: #fff; }
  .btn-primary:hover { background: #3E5A64; }
  .btn-sm { padding: 6px 13px; font-size: 12px; }
  .btn-outline { background: transparent; color: #2A3D45; border: 1.5px solid rgba(42,61,69,0.2); }
  .btn-outline:hover { background: #EBF5EE; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-icon { padding: 6px 8px; background: transparent; border: 1px solid rgba(42,61,69,0.15); border-radius: 7px; color: #5B7C88; cursor: pointer; display: inline-flex; align-items: center; transition: all 0.15s; font-family: 'Mulish', sans-serif; margin-left: 4px; }
  .btn-icon:hover { background: #EBF5EE; color: #2A3D45; }
  .btn-icon.danger:hover { background: #FAECE7; color: #993C1D; border-color: #E5A090; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: #fff; border-radius: 18px; padding: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; color: #2A3D45; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(42,61,69,0.08); }

  /* ── FIELDS ── */
  .field { margin-bottom: 1.1rem; }
  .field label { display: block; font-size: 11px; font-weight: 700; color: #5B7C88; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
  .field input, .field select { width: 100%; padding: 10px 13px; background: #F4F7F6; border: 1.5px solid transparent; border-radius: 8px; color: #2A3D45; font-size: 14px; font-family: 'Mulish', sans-serif; outline: none; transition: all 0.2s; }
  .field input:focus, .field select:focus { border-color: #5B7C88; background: #fff; }
  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 40px; }
  .pw-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #A8BFBF; display: flex; align-items: center; }
  .pw-eye:hover { color: #2A3D45; }

  /* ── ERROR ── */
  .error-msg { color: #993C1D; background: #FAECE7; border-radius: 8px; border-left: 3px solid #993C1D; font-size: 13px; padding: 9px 13px; margin-bottom: 1rem; }
  .success-msg { color: #2A7A45; background: #EBF5EE; border-radius: 8px; border-left: 3px solid #AACFB4; font-size: 13px; padding: 9px 13px; margin-bottom: 1rem; }

  /* ── MISC ── */
  .empty { text-align: center; padding: 3rem; color: #A8BFBF; font-size: 14px; }
  .spinner { text-align: center; padding: 3rem; color: #A8BFBF; font-size: 14px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .quiz-row { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid rgba(42,61,69,0.07); }
  .quiz-row:last-child { border-bottom: none; }
  .quiz-name { font-size: 14px; font-weight: 600; color: #2A3D45; margin-bottom: 3px; }
  .quiz-meta { font-size: 12px; color: #5B7C88; }
  .sub-panel { background: #F4F7F6; border-radius: 10px; padding: 1.25rem; margin-top: 1rem; }
  .sub-panel-title { font-size: 13px; font-weight: 600; color: #2A3D45; margin-bottom: 0.75rem; }
`;

function newQuestionDraft() {
  return { id: Date.now(), text: "", options: ["", "", "", ""], correct: 0 };
}

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [modalRole, setModalRole] = useState("teacher");
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizDraft, setQuizDraft] = useState({
    title: "",
    subject: "",
    status: "open",
    questions: [newQuestionDraft()],
  });
  const [quizError, setQuizError] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setCurrentUser(user);
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(prof);
      await loadAll();
    });
  }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: t }, { data: s }, { data: q }, { data: sub }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "teacher")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "student")
          .order("created_at", { ascending: false }),
        supabase
          .from("quizzes")
          .select("*, teacher:profiles!quizzes_teacher_id_fkey(full_name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("submissions")
          .select(
            "*, quiz:quizzes(title,subject), student:profiles!submissions_student_id_fkey(full_name,email)",
          )
          .order("submitted_at", { ascending: false }),
      ]);
    setTeachers(t || []);
    setStudents(s || []);
    setQuizzes(q || []);
    setSubmissions(sub || []);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function openAddUser(role) {
    setModalRole(role);
    setEditTarget(null);
    setFormData({ full_name: "", email: "", password: "" });
    setUserError("");
    setUserSuccess("");
    setShowUserModal(true);
  }

  function openEditUser(person, role) {
    setModalRole(role);
    setEditTarget(person);
    setFormData({
      full_name: person.full_name,
      email: person.email || "",
      password: "",
    });
    setUserError("");
    setUserSuccess("");
    setShowUserModal(true);
  }

  async function saveUser() {
    setUserError("");
    setUserSuccess("");
    setUserLoading(true);

    if (editTarget) {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: formData.full_name })
        .eq("id", editTarget.id);
      if (error) {
        setUserError(error.message);
        setUserLoading(false);
        return;
      }
      setUserSuccess("User updated successfully.");
      await loadAll();
      setUserLoading(false);
      return;
    }

    if (!formData.full_name || !formData.email || !formData.password) {
      setUserError("All fields are required.");
      setUserLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setUserError("Password must be at least 6 characters.");
      setUserLoading(false);
      return;
    }

    const { data, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
    });

    if (authErr) {
      setUserError(authErr.message);
      setUserLoading(false);
      return;
    }
    if (!data.user) {
      setUserError("User creation failed.");
      setUserLoading(false);
      return;
    }

    const { error: profErr } = await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: formData.full_name,
      role: modalRole,
      email: formData.email,
    });

    if (profErr) {
      setUserError(profErr.message);
      setUserLoading(false);
      return;
    }

    setUserSuccess(
      `${modalRole === "teacher" ? "Teacher" : "Student"} created successfully!`,
    );
    await loadAll();
    setUserLoading(false);
    setTimeout(() => {
      setShowUserModal(false);
      setUserSuccess("");
    }, 1400);
  }

  async function deleteUser(id) {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) await loadAll();
  }

  function openCreateQuiz() {
    setQuizDraft({
      title: "",
      subject: "",
      status: "open",
      questions: [newQuestionDraft()],
    });
    setQuizError("");
    setShowQuizModal(true);
  }

  async function saveQuiz() {
    if (!quizDraft.title.trim()) {
      setQuizError("Title is required.");
      return;
    }
    setQuizLoading(true);

    const { data: qData, error: qErr } = await supabase
      .from("quizzes")
      .insert({
        title: quizDraft.title,
        subject: quizDraft.subject,
        status: quizDraft.status,
        teacher_id: currentUser.id,
      })
      .select()
      .single();

    if (qErr) {
      setQuizError(qErr.message);
      setQuizLoading(false);
      return;
    }

    const questionRows = quizDraft.questions
      .filter((q) => q.text.trim())
      .map((q, i) => ({
        quiz_id: qData.id,
        text: q.text,
        options: q.options,
        correct_index: q.correct,
        position: i,
      }));

    if (questionRows.length > 0) {
      await supabase.from("questions").insert(questionRows);
    }

    await loadAll();
    setShowQuizModal(false);
    setQuizLoading(false);
  }

  async function deleteQuiz(id) {
    await supabase.from("quizzes").delete().eq("id", id);
    await loadAll();
  }

  async function toggleQuizStatus(quiz) {
    const newStatus = quiz.status === "open" ? "closed" : "open";
    await supabase
      .from("quizzes")
      .update({ status: newStatus })
      .eq("id", quiz.id);
    await loadAll();
  }

  async function viewStudentGrades(student) {
    setSelectedStudent(student);
    const { data } = await supabase
      .from("submissions")
      .select("*, quiz:quizzes(title, subject)")
      .eq("student_id", student.id)
      .order("submitted_at", { ascending: false });
    setStudentGrades(data || []);
  }

  const avgScore = submissions.length
    ? Math.round(
        submissions.reduce((a, s) => a + (s.score / s.total) * 100, 0) /
          submissions.length,
      )
    : 0;

  /* Exchanged the position of quizzes and grades objects inside tracking array */
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "teachers",  label: "Teachers",  icon: <UserCheck size={20} /> },
    { id: "students",  label: "Students",  icon: <Users size={20} /> },
    { id: "grades",    label: "Grades",    icon: <Star size={20} /> },
    { id: "quizzes",   label: "Quizzes",   icon: <ClipboardList size={20} /> },
  ];

  return (
    <>
      <style>{css}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Mulish:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── TOP NAV ── */}
      <nav className="top-nav">
        <img src={quizLogo} alt="EduQuiz" />
        <div className="nav-right">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </nav>

      <div className="layout">
        {/* ── SIDEBAR FIXED STACK ── */}
        <aside className="sidebar">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <User size={18} />
            </div>
            <div className="sidebar-name">
              {profile?.full_name || currentUser?.email?.split("@")[0]}
            </div>
            <div className="sidebar-email">{currentUser?.email}</div>
            <span className="sidebar-role-badge">Admin</span>
          </div>
          
          <div className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${tab === item.id ? "active" : ""}`}
                onClick={() => {
                  setTab(item.id);
                  if (item.id === "students") setSelectedStudent(null);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          {/* ═══ DASHBOARD ═══ */}
          {tab === "dashboard" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Admin Dashboard</h1>
                  <p className="page-sub">Full platform overview — EduQuiz.</p>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-label">Teachers</div>
                  <div className="stat-value">{teachers.length}</div>
                  <div className="stat-sub">Active accounts</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Students</div>
                  <div className="stat-value">{students.length}</div>
                  <div className="stat-sub">Enrolled</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Quizzes</div>
                  <div className="stat-value">{quizzes.length}</div>
                  <div className="stat-sub">
                    {quizzes.filter((q) => q.status === "open").length} open
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Avg. score</div>
                  <div className="stat-value">{avgScore}%</div>
                  <div className="stat-sub">
                    {submissions.length} submissions
                  </div>
                </div>
              </div>
              <div className="two-col">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Recent teachers</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setTab("teachers")}
                    >
                      Manage
                    </button>
                  </div>
                  {teachers.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(42,61,69,0.06)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#2A3D45" }}>
                          {t.full_name}
                        </div>
                        <div style={{ fontSize: 11, color: "#A8BFBF" }}>
                          {t.email}
                        </div>
                      </div>
                      <span className="badge badge-teacher">teacher</span>
                    </div>
                  ))}
                  {teachers.length === 0 && (
                    <div className="empty">No teachers yet.</div>
                  )}
                </div>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Recent students</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setTab("students")}
                    >
                      Manage
                    </button>
                  </div>
                  {students.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(42,61,69,0.06)",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#2A3D45" }}>
                          {s.full_name}
                        </div>
                        <div style={{ fontSize: 11, color: "#A8BFBF" }}>
                          {s.email}
                        </div>
                      </div>
                      <span className="badge badge-student">student</span>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="empty">No students yet.</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ═══ TEACHERS ═══ */}
          {tab === "teachers" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Teachers</h1>
                  <p className="page-sub">Add, edit, and remove teacher accounts.</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => openAddUser("teacher")}
                >
                  <Plus size={15} /> Add teacher
                </button>
              </div>
              <div className="card">
                {loading ? (
                  <div className="spinner">Loading...</div>
                ) : teachers.length === 0 ? (
                  <div className="empty">No teachers yet. Add one above.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Full name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t) => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600 }}>{t.full_name}</td>
                          <td style={{ color: "#5B7C88" }}>{t.email || "—"}</td>
                          <td style={{ color: "#A8BFBF" }}>
                            {new Date(t.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="btn-icon"
                              title="Edit"
                              onClick={() => openEditUser(t, "teacher")}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="btn-icon danger"
                              title="Delete"
                              onClick={() => deleteUser(t.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ═══ STUDENTS ═══ */}
          {tab === "students" && !selectedStudent && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Students</h1>
                  <p className="page-sub">Add, edit, remove students — and view their grades.</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => openAddUser("student")}
                >
                  <Plus size={15} /> Add student
                </button>
              </div>
              <div className="card">
                {loading ? (
                  <div className="spinner">Loading...</div>
                ) : students.length === 0 ? (
                  <div className="empty">No students yet. Add one above.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Full name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Submissions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => {
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.full_name}</td>
                            <td style={{ color: "#5B7C88" }}>{s.email || "—"}</td>
                            <td style={{ color: "#A8BFBF" }}>
                              {new Date(s.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              {submissions.filter((sub) => sub.student_id === s.id).length}
                            </td>
                            <td>
                              <button
                                className="btn-icon"
                                title="View grades"
                                onClick={() => viewStudentGrades(s)}
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                className="btn-icon"
                                title="Edit"
                                onClick={() => openEditUser(s, "student")}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                className="btn-icon danger"
                                title="Delete"
                                onClick={() => deleteUser(s.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Student grades detail view */}
          {tab === "students" && selectedStudent && (
            <>
              <div className="page-header">
                <div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedStudent(null)}
                    style={{ marginBottom: 12 }}
                  >
                    ← Back to students
                  </button>
                  <h1 className="page-title">{selectedStudent.full_name}</h1>
                  <p className="page-sub">{selectedStudent.email} · Grade history</p>
                </div>
              </div>
              <div className="card">
                {studentGrades.length === 0 ? (
                  <div className="empty">No submissions yet for this student.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Quiz</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>%</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentGrades.map((g, i) => {
                        const pct = Math.round((g.score / g.total) * 100);
                        return (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{g.quiz?.title}</td>
                            <td style={{ color: "#5B7C88" }}>{g.quiz?.subject}</td>
                            <td>{g.score}/{g.total}</td>
                            <td>
                              <span className={`badge ${pct >= 80 ? "badge-high" : pct >= 50 ? "badge-mid" : "badge-low"}`}>
                                {pct}%
                              </span>
                            </td>
                            <td style={{ color: "#A8BFBF" }}>
                              {new Date(g.submitted_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ═══ GLOBAL PLATFORM GRADES TAB ═══ */}
          {tab === "grades" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Platform Grades</h1>
                  <p className="page-sub">Global performance metrics and student history tracking.</p>
                </div>
                <button className="btn btn-outline"><Download size={14} /> Export CSV</button>
              </div>
              <div className="card">
                {submissions.length === 0 ? (
                  <div className="empty">No grading records stored yet on the platform.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Quiz</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>%</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s, i) => {
                        const pct = Math.round((s.score / s.total) * 100);
                        return (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{s.student?.full_name || "—"}</td>
                            <td style={{ color: "#5B7C88" }}>{s.student?.email || "—"}</td>
                            <td style={{ fontWeight: 600 }}>{s.quiz?.title || "—"}</td>
                            <td style={{ color: "#5B7C88" }}>{s.quiz?.subject || "—"}</td>
                            <td>{s.score}/{s.total}</td>
                            <td>
                              <span className={`badge ${pct >= 80 ? "badge-high" : pct >= 50 ? "badge-mid" : "badge-low"}`}>
                                {pct}%
                              </span>
                            </td>
                            <td style={{ color: "#A8BFBF" }}>
                              {new Date(s.submitted_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ═══ QUIZZES ═══ */}
          {tab === "quizzes" && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Quizzes</h1>
                  <p className="page-sub">All quizzes on the platform — create or delete.</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateQuiz}>
                  <Plus size={15} /> New quiz
                </button>
              </div>
              <div className="card">
                {loading ? (
                  <div className="spinner">Loading...</div>
                ) : quizzes.length === 0 ? (
                  <div className="empty">No quizzes yet.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Created By</th>
                        <th>Submissions</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((q) => {
                        const qSubs = submissions.filter((s) => s.quiz_id === q.id);
                        const qAvg = qSubs.length
                          ? Math.round(qSubs.reduce((a, s) => a + (s.score / s.total) * 100, 0) / qSubs.length)
                          : null;
                        return (
                          <tr key={q.id}>
                            <td style={{ fontWeight: 600 }}>{q.title}</td>
                            <td style={{ color: "#5B7C88" }}>{q.subject}</td>
                            <td style={{ color: "#5B7C88" }}>{q.teacher?.full_name || "Admin"}</td>
                            <td>{qSubs.length} response{qSubs.length !== 1 ? 's' : ''} {qAvg !== null && `(avg ${qAvg}%)`}</td>
                            <td>
                              <span className={`badge ${q.status === "open" ? "badge-open" : "badge-closed"}`}>
                                {q.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => toggleQuizStatus(q)}
                                style={{ marginRight: 8 }}
                              >
                                {q.status === "open" ? "Close" : "Open"}
                              </button>
                              <button
                                className="btn-icon danger"
                                onClick={() => deleteQuiz(q.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ═══ USER MODAL ═══ */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                {editTarget ? "Edit" : "Add"} {modalRole === "teacher" ? "Teacher" : "Student"}
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "#A8BFBF" }}
                onClick={() => setShowUserModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="field">
              <label>Full name</label>
              <input
                placeholder="Ahmed Benali"
                value={formData.full_name}
                onChange={(e) => setFormData((f) => ({ ...f, full_name: e.target.value }))}
              />
            </div>

            {!editTarget && (
              <>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="ahmed@school.edu"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                    />
                    <button
                      className="pw-eye"
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            

            {userError && <div className="error-msg">{userError}</div>}
            {userSuccess && <div className="success-msg">{userSuccess}</div>}

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowUserModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={userLoading} onClick={saveUser}>
                {userLoading ? "Saving..." : editTarget ? "Save changes" : `Create ${modalRole}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CREATE QUIZ MODAL ═══ */}
      {showQuizModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div className="modal-title">Create quiz</div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "#A8BFBF" }}
                onClick={() => setShowQuizModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="field">
                <label>Title</label>
                <input
                  placeholder="e.g. Algebra Fundamentals"
                  value={quizDraft.title}
                  onChange={(e) => setQuizDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Subject</label>
                <input
                  placeholder="e.g. Mathematics"
                  value={quizDraft.subject}
                  onChange={(e) => setQuizDraft((d) => ({ ...d, subject: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(42,61,69,0.08)", paddingTop: "1rem" }}>
              {quizDraft.questions.map((q, qi) => (
                <div
                  key={q.id}
                  style={{ border: "1px solid rgba(42,61,69,0.1)", borderRadius: 10, padding: "1.25rem", marginBottom: "1rem", background: "#F4F7F6" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontSize: 11, fontWeight: 700, color: "#A8BFBF", textTransform: "uppercase" }}>
                    <span>Question {qi + 1}</span>
                    {quizDraft.questions.length > 1 && (
                      <button
                        className="btn-icon danger"
                        onClick={() => setQuizDraft((d) => ({ ...d, questions: d.questions.filter((x) => x.id !== q.id) }))}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    style={{ width: "100%", padding: "9px 12px", background: "#fff", border: "1px solid rgba(42,61,69,0.15)", borderRadius: 8, fontSize: 13, fontFamily: "Mulish,sans-serif", outline: "none", marginBottom: 10 }}
                    placeholder="Question text..."
                    value={q.text}
                    onChange={(e) => setQuizDraft((d) => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, text: e.target.value } : x) }))}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#A8BFBF", width: 16 }}>
                          {["A", "B", "C", "D"][oi]}
                        </span>
                        <input
                          style={{ flex: 1, padding: "7px 10px", background: "#fff", border: "1px solid rgba(42,61,69,0.15)", borderRadius: 6, fontSize: 12, fontFamily: "Mulish,sans-serif", outline: "none" }}
                          placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
                          value={opt}
                          onChange={(e) => setQuizDraft((d) => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, options: x.options.map((o, i) => i === oi ? e.target.value : o) } : x) }))}
                        />
                        <input
                          type="radio"
                          title="Mark correct"
                          checked={q.correct === oi}
                          onChange={() => setQuizDraft((d) => ({ ...d, questions: d.questions.map(x => x.id === q.id ? { ...x, correct: oi } : x) }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                style={{ width: "100%", padding: "10px", border: "1.5px dashed rgba(42,61,69,0.2)", borderRadius: 8, background: "transparent", fontSize: 13, color: "#5B7C88", cursor: "pointer", fontFamily: "Mulish,sans-serif" }}
                onClick={() => setQuizDraft((d) => ({ ...d, questions: [...d.questions, newQuestionDraft()] }))}
              >
                + Add question
              </button>
            </div>

            {quizError && (
              <div className="error-msg" style={{ marginTop: "1rem" }}>
                {quizError}
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowQuizModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={quizLoading} onClick={saveQuiz}>
                {quizLoading ? "Publishing..." : "Publish quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}