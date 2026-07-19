import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCpu, FiGitBranch, FiZap, FiLayers } from 'react-icons/fi';
import './Landing.css';

const FEATURES = [
  { icon: FiLayers, title: '22 building blocks', body: 'LLMs, data readers, logic, and integrations — drag them onto the canvas and wire them together.' },
  { icon: FiGitBranch, title: 'DAG-validated by design', body: 'Every pipeline is checked against a real graph engine before it can run, so cycles get caught early.' },
  { icon: FiCpu, title: 'Variables that just work', body: 'Type {{name}} in a Text node and the input handle appears automatically — no manual wiring.' },
  { icon: FiZap, title: 'Built for iteration', body: 'Undo, duplicate, export, import — the editor gets out of your way while you shape a workflow.' },
];

export default function Landing() {
  return (
    <div className="vf-landing">
      <div className="vf-landing__glow" />
      <nav className="vf-landing__nav">
        <span className="vf-landing__logo gradient-text">VectorFlow</span>
        <div className="vf-landing__navlinks">
          <Link to="/login">Log in</Link>
          <Link to="/register" className="vf-landing__navcta">Get started</Link>
        </div>
      </nav>

      <header className="vf-landing__hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="vf-landing__eyebrow">AI workflow builder</span>
          <h1>
            Build AI pipelines <span className="gradient-text">visually</span>,
            <br />ship them with confidence.
          </h1>
          <p className="vf-landing__sub">
            VectorFlow is a drag-and-drop canvas for composing LLMs, data
            sources, and logic into pipelines that are validated as a real
            directed acyclic graph before they run.
          </p>
          <div className="vf-landing__actions">
            <Link to="/register" className="vf-landing__primary">
              Get started free <FiArrowRight size={15} />
            </Link>
            <Link to="/login" className="vf-landing__secondary">I have an account</Link>
          </div>
        </motion.div>

        <motion.div
          className="vf-landing__preview glass-panel"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <PreviewCanvas />
        </motion.div>
      </header>

      <section className="vf-landing__features">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className="glass-panel vf-landing__feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <span className="vf-landing__featureicon"><f.icon size={17} /></span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </motion.div>
        ))}
      </section>

      <footer className="vf-landing__footer">
        <span>VectorFlow — built as a workflow editor demo.</span>
      </footer>
    </div>
  );
}

/** Small static illustration of three connected nodes for the hero. */
function PreviewCanvas() {
  return (
    <svg viewBox="0 0 420 260" width="100%" height="100%">
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M 90 70 C 150 70, 150 130, 200 130" stroke="url(#edge)" strokeWidth="2" fill="none" />
      <path d="M 250 130 C 300 130, 300 60, 340 60" stroke="url(#edge)" strokeWidth="2" fill="none" />
      <path d="M 250 130 C 300 130, 300 200, 340 200" stroke="url(#edge)" strokeWidth="2" fill="none" />

      <g>
        <rect x="20" y="45" width="100" height="50" rx="12" fill="#12151c" stroke="#2a3142" />
        <circle cx="40" cy="70" r="7" fill="#6366f1" />
        <rect x="55" y="63" width="50" height="6" rx="3" fill="#3a4258" />
        <rect x="55" y="75" width="35" height="5" rx="2.5" fill="#252b3a" />
      </g>
      <g>
        <rect x="200" y="105" width="100" height="50" rx="12" fill="#12151c" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx="220" cy="130" r="7" fill="#a855f7" />
        <rect x="235" y="123" width="50" height="6" rx="3" fill="#3a4258" />
        <rect x="235" y="135" width="35" height="5" rx="2.5" fill="#252b3a" />
      </g>
      <g>
        <rect x="340" y="35" width="70" height="50" rx="12" fill="#12151c" stroke="#2a3142" />
        <circle cx="358" cy="60" r="6" fill="#2dd4bf" />
      </g>
      <g>
        <rect x="340" y="175" width="70" height="50" rx="12" fill="#12151c" stroke="#2a3142" />
        <circle cx="358" cy="200" r="6" fill="#f59e0b" />
      </g>
    </svg>
  );
}
