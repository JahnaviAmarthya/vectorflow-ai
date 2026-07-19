import { useMemo, useState } from 'react';
import { FiSearch, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { CATEGORIES, NODE_CONFIG, NODE_TYPES_LIST } from '../../nodes/nodeConfig';

const FAVORITES_KEY = 'vectorflow.favorites.v1';
const RECENT_KEY = 'vectorflow.recent.v1';

function readList(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? []; } catch { return []; }
}

export default function NodePalette() {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readList(FAVORITES_KEY));
  const [recent] = useState(() => readList(RECENT_KEY));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NODE_TYPES_LIST.filter((key) => {
      const cfg = NODE_CONFIG[key];
      return !q || cfg.label.toLowerCase().includes(q) || cfg.category.toLowerCase().includes(q);
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => { map[c] = []; });
    filtered.forEach((key) => map[NODE_CONFIG[key].category]?.push(key));
    return map;
  }, [filtered]);

  function toggleFavorite(key) {
    setFavorites((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }

  function onDragStart(e, key) {
    e.dataTransfer.setData('application/vectorflow-node', key);
    e.dataTransfer.effectAllowed = 'move';
    const recentList = [key, ...readList(RECENT_KEY).filter((k) => k !== key)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentList));
  }

  return (
    <aside className="glass-panel vf-palette">
      <div className="vf-palette__search">
        <FiSearch size={14} />
        <input
          placeholder="Search nodes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="vf-palette__scroll">
        {recent.length > 0 && !query && (
          <PaletteSection title="Recently used" nodeKeys={recent} favorites={favorites} onDragStart={onDragStart} onToggleFavorite={toggleFavorite} />
        )}
        {favorites.length > 0 && !query && (
          <PaletteSection title="Favorites" nodeKeys={favorites} favorites={favorites} onDragStart={onDragStart} onToggleFavorite={toggleFavorite} />
        )}
        {CATEGORIES.map((cat) => (
          grouped[cat]?.length > 0 && (
            <PaletteSection key={cat} title={cat} nodeKeys={grouped[cat]} favorites={favorites} onDragStart={onDragStart} onToggleFavorite={toggleFavorite} />
          )
        ))}
        {filtered.length === 0 && (
          <p className="vf-palette__empty">No nodes match "{query}"</p>
        )}
      </div>
    </aside>
  );
}

function PaletteSection({ title, nodeKeys, favorites, onDragStart, onToggleFavorite }) {
  return (
    <div className="vf-palette__section">
      <span className="vf-palette__sectiontitle">{title}</span>
      <div className="vf-palette__grid">
        {nodeKeys.map((key) => {
          const cfg = NODE_CONFIG[key];
          const Icon = cfg.icon;
          const isFav = favorites.includes(key);
          return (
            <motion.div
              key={key}
              className="vf-palette__item"
              draggable
              onDragStart={(e) => onDragStart(e, key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              title={cfg.description}
            >
              <span className="vf-palette__icon" style={{ background: cfg.color }}>
                <Icon size={13} />
              </span>
              <span className="vf-palette__label">{cfg.label}</span>
              <button
                className={`vf-palette__fav ${isFav ? 'vf-palette__fav--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(key); }}
                title="Toggle favorite"
              >
                <FiStar size={11} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
