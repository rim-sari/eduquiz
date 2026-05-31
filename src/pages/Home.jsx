import {
  Radio,
  BookOpen,
  BarChart2,
  FileText,
  Download,
  ArrowRight,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import quizLogo from "../assets/quizLogo.png";

const features = [
  {
    icon: <Radio size={22} />,
    name: "Live quizzes",
    desc: "Publish quizzes instantly. Students see them the moment they go live — no page refresh, no delay.",
  },
  {
    icon: <BookOpen size={22} />,
    name: "Smart grading",
    desc: "Answers are graded automatically. Students get instant feedback; teachers get instant results.",
  },
  {
    icon: <FileText size={22} />,
    name: "Question bank",
    desc: "Build a reusable library of questions. Remix, reorder, and recycle across any quiz in any class.",
  },
  {
    icon: <Download size={22} />,
    name: "Export & reports",
    desc: "Download results as CSV or PDF. Share with parents, departments, or keep for your own records.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <div className="logo">
          <img
            src={quizLogo}
            alt="EduQuiz logo"
            style={{ height: 115, width: "auto" }}
          />
        </div>
        <button className="nav-cta" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <h1>Welcome to EduQuiz</h1>
          <br />
          <br />
          <h3>
            Where <em>great teachers</em>
            <br />
            build great quizzes
          </h3>
          <br />
          <div className="hero-actions">
            <button className="btn-main" onClick={() => navigate("/login")}>
              Get started <ArrowRight size={16} />
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn more <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="hero-right">
          {[
            {
              icon: <BarChart2 size={18} />,
              label: "Class average",
              value: "84%",
              fill: "84%",
            },
            {
              icon: <FileText size={18} />,
              label: "Completion rate",
              value: "53%",
              fill: "53%",
            },
          ].map((c, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{c.icon}</div>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: c.fill }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section" id="features">
        <p className="section-eyebrow">What's included</p>
        <h2 className="section-heading">
          Built for real
          <br />
          classrooms
        </h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-num">0{i + 1}</div>
              <div className="feat-icon">{f.icon}</div>
              <p className="feat-name">{f.name}</p>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
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
