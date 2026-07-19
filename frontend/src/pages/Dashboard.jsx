import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiPlus, FiLogOut, FiClock, FiBox, FiPlay, FiLayers, FiSun, FiMoon,
} from 'react-icons/fi';
import { getSession, logout } from '../services/authService';
import { NODE_TYPES_LIST } from '../nodes/nodeConfig';
import { useThemeMode } from '../hooks/useThemeMode';
import './Dashboard.css';

const PIPELINES_KEY = 'vectorflow.pipelines.v1';
const AUTOSAVE_KEY = 'vectorflow.autosave.v1';

function readPipelines() {
  try { return JSON.parse(localStorage.getItem(PIPELINES_KEY)) ?? []; } catch { return []; }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { mode, toggle } = useThemeMode();
  const [session] = useState(() => getSession());
  const [pipelines, setPipelines] = useState(readPipelines);

  useEffect(() => {
    if (!session) navigate('/login');
  }, [session, navigate]);

  const stats = useMemo(() => {
    let autosaveNodeCount = 0;
    try {
      const auto = JSON.parse(localStorage.getItem(AUTOSAVE_KEY));
      autosaveNodeCount = auto?.nodes?.length ?? 0;
    } catch { /* no autosave yet */ }
    return {
      totalPipelines: pipelines.length,
      nodesCreated: pipelines.reduce((sum, p) => sum + (p.nodeCount || 0), 0) + autosaveNodeCount,
      executions: pipelines.reduce((sum, p) => sum + (p.executions || 0), 0),
      templates: NODE_TYPES_LIST.length,
    };
  }, [pipelines]);

  function createPipeline() {
    const name = `Untitled Pipeline ${pipelines.length + 1}`;
    const entry = { id: crypto.randomUUID(), name, updatedAt: Date.now(), nodeCount: 0, executions: 0 };
    const next = [entry, ...pipelines];
    localStorage.setItem(PIPELINES_KEY, JSON.stringify(next));
    setPipelines(next);
    navigate(`/editor/${entry.id}`, { state: { name } });
  }

  function openPipeline(p) {
    navigate(`/editor/${p.id}`, { state: { name: p.name } });
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!session) return null;

  return (
    <div className="vf-dash">
      <aside className="vf-dash__sidebar">
        <span className="vf-dash__logo gradient-text">VectorFlow</span>
        <nav className="vf-dash__nav">
          <span className="vf-dash__navitem vf-dash__navitem--active"><FiGrid size={15} /> Dashboard</span>
          <span className="vf-dash__navitem"><FiLayers size={15} /> Templates</span>
          <span className="vf-dash__navitem"><FiClock size={15} /> Recent</span>
        </nav>
        <div className="vf-dash__spacer" />
        <div className="vf-dash__profile">
          <div className="vf-dash__avatar">{session.name?.[0]?.toUpperCase() ?? 'U'}</div>
          <div>
            <div className="vf-dash__profilename">{session.name}</div>
            <div className="vf-dash__profileemail">{session.email}</div>
          </div>
        </div>
        <button className="vf-dash__logoutbtn" onClick={handleLogout}><FiLogOut size={14} /> Log out</button>
      </aside>

      <main className="vf-dash__main">
        <header className="vf-dash__header">
          <div>
            <h1>Welcome back, {session.name?.split(' ')[0]}</h1>
            <p>Here's what's happening with your pipelines.</p>
          </div>
          <div className="vf-dash__headeractions">
            <button className="vf-toolbar__btn" onClick={toggle} title="Toggle theme">
              {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>
            <button className="vf-dash__createbtn" onClick={createPipeline}>
              <FiPlus size={15} /> Create Pipeline
            </button>
          </div>
        </header>

        <section className="vf-dash__stats">
          <StatCard icon={FiBox} label="Total Pipelines" value={stats.totalPipelines} />
          <StatCard icon={FiLayers} label="Nodes Created" value={stats.nodesCreated} />
          <StatCard icon={FiPlay} label="Execution Count" value={stats.executions} />
          <StatCard icon={FiGrid} label="Templates" value={stats.templates} />
        </section>

        <section className="vf-dash__section">
          <h2>Recent Pipelines</h2>
          {pipelines.length === 0 ? (
            <div className="glass-panel vf-dash__empty">
              <p>No pipelines yet. Create your first one to get started.</p>
              <button className="vf-dash__createbtn" onClick={createPipeline}><FiPlus size={14} /> Create Pipeline</button>
            </div>
          ) : (
            <div className="vf-dash__grid">
              {pipelines.map((p, i) => (
                <motion.button
                  key={p.id}
                  className="glass-panel vf-dash__card"
                  onClick={() => openPipeline(p)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                >
                  <span className="vf-dash__cardicon"><FiBox size={16} /></span>
                  <span className="vf-dash__cardname">{p.name}</span>
                  <span className="vf-dash__cardmeta">{p.nodeCount || 0} nodes · updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-panel vf-dash__stat">
      <span className="vf-dash__staticon"><Icon size={16} /></span>
      <div>
        <div className="vf-dash__statvalue">{value}</div>
        <div className="vf-dash__statlabel">{label}</div>
      </div>
    </div>
  );
}
