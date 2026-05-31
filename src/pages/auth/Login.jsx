import { useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import quizLogo from "../../assets/quizLogo.png";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // connexion avec Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      setError("Profil introuvable. ");
      setLoading(false);
      return;
    }

    if (profile.role === "admin") navigate("/admin");
    else if (profile.role === "teacher") navigate("/teacher");
    else navigate("/student");
  }

  return (
    <>
      <nav>
        <div className="logo">
          <img
            src={quizLogo}
            alt="EduQuiz logo"
            style={{ height: 115, width: "auto", cursor: "pointer"}}
            onClick={() => navigate("/")}
            
          />
        </div>
        <button className="nav-cta" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      <section className="login-page">
        <div className="login-card">
          <div className="login-top">
            <div
              className="login-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={quizLogo}
                alt="EduQuiz"
                style={{ height: 120, width: "auto" }}
              />
            </div>
            <h2 className="login-title">Welcome back</h2>
            <p className="login-sub">Sign in to your EduQuiz account</p>
          </div>

          {/* toggle visuel — 3 rôles */}
          <div
            className="role-toggle"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <button
              type="button"
              className={`role-btn ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              <BookOpen size={14} /> Student
            </button>
            <button
              type="button"
              className={`role-btn ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
            >
              <GraduationCap size={14} /> Teacher
            </button>
            <button
              type="button"
              className={`role-btn ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              <ShieldCheck size={14} /> Admin
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                placeholder={
                  role === "student"
                    ? "you@school.edu"
                    : role === "teacher"
                      ? "teacher@school.edu"
                      : "admin@eduquiz.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>

            {/* message d'erreur */}
            {error && (
              <p
                style={{
                  color: "#993C1D",
                  background: "#FAECE7",
                  borderRadius: 8,
                  padding: "9px 13px",
                  fontSize: 13,
                  marginBottom: "1rem",
                  borderLeft: "3px solid #993C1D",
                }}
              >
                {error}
              </p>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? "Connexion en cours..."
                : `Sign in as ${role === "student" ? "Student" : role === "teacher" ? "Teacher" : "Admin"}`}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p
            style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 13 }}
          >
            <span
              onClick={() => navigate("/")}
              style={{
                color: "var(--teal)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Back to home
            </span>
          </p>
        </div>
      </section>

      <footer>
        <div className="footer-logo">
          <div className="footer-mark">
            <GraduationCap size={14} color="#EBF5EE" />
          </div>
          EduQuiz
        </div>

        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
          <a href="#">Status</a>
        </div>
        <p className="footer-copy">2026 - EduQuiz</p>
      </footer>
    </>
  );
}
