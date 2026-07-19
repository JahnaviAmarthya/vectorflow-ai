import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NODE_CONFIG, NODE_TYPES_LIST } from '../../nodes/nodeConfig';

export default function ContextMenu({ x, y, onAdd, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    function handler(e) {
      if (!e.target.closest('.vf-ctxmenu')) onClose();
    }
    window.addEventListener('mousedown', handler);
    window.addEventListener('scroll', onClose, true);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  const filtered = NODE_TYPES_LIST.filter((k) =>
    NODE_CONFIG[k].label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <motion.div
      className="glass-panel vf-ctxmenu"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.12 }}
    >
      <input
        autoFocus
        placeholder="Add a node…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="vf-ctxmenu__search"
      />
      <div className="vf-ctxmenu__list">
        {filtered.map((k) => {
          const cfg = NODE_CONFIG[k];
          const Icon = cfg.icon;
          return (
            <button key={k} className="vf-ctxmenu__item" onClick={() => onAdd(k)}>
              <span className="vf-palette__icon" style={{ background: cfg.color, width: 18, height: 18 }}>
                <Icon size={11} />
              </span>
              {cfg.label}
            </button>
          );
        })}
        {filtered.length === 0 && <span className="vf-inspector__muted" style={{ padding: 8 }}>No matches</span>}
      </div>
    </motion.div>
  );
}
