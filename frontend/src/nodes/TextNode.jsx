import { memo, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { motion } from 'framer-motion';
import { FiType, FiTrash2, FiCopy } from 'react-icons/fi';
import { NODE_CONFIG } from './nodeConfig';
import { useFlowStore } from '../store/flowStore';
import './nodes.css';

const VAR_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

/** Extracts unique, ordered variable names from `{{name}}` tokens. */
export function extractVariables(text) {
  const seen = new Set();
  const ordered = [];
  let match;
  VAR_PATTERN.lastIndex = 0;
  while ((match = VAR_PATTERN.exec(text || '')) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      ordered.push(match[1]);
    }
  }
  return ordered;
}

/** Splits text into plain-string and variable segments for highlighting. */
function segmentText(text) {
  const segments = [];
  let lastIndex = 0;
  let match;
  VAR_PATTERN.lastIndex = 0;
  while ((match = VAR_PATTERN.exec(text || '')) !== null) {
    if (match.index > lastIndex) segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    segments.push({ type: 'var', value: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < (text || '').length) segments.push({ type: 'text', value: text.slice(lastIndex) });
  return segments;
}

function TextNodeImpl({ id, data, selected }) {
  const config = NODE_CONFIG.text;
  const updateNodeField = useFlowStore((s) => s.updateNodeField);
  const removeNode = useFlowStore((s) => s.removeNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);
  const updateNodeInternals = useUpdateNodeInternals();

  const [text, setText] = useState(data?.text ?? config.fields[0].default);
  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(text), [text]);
  const segments = useMemo(() => segmentText(text), [text]);

  // Auto-resize: grow the textarea to fit content (auto height + width
  // is capped by the node's max-width so it wraps rather than overflowing).
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  // Every time the variable set changes, tell React Flow the node's
  // handle layout changed — otherwise existing edges render at stale
  // anchor points, and removed handles leave "ghost" edges attached.
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables.length, id, updateNodeInternals]);

  const handleTextChange = useCallback(
    (value) => {
      setText(value);
      updateNodeField(id, 'text', value);
    },
    [id, updateNodeField]
  );

  const handleCount = Math.max(variables.length, 1);

  return (
    <motion.div
      className={`vf-node ${selected ? 'vf-node--selected' : ''}`}
      style={{ '--node-color': config.color, minWidth: 260 }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {/* One target handle per unique {{variable}}, evenly spaced.
          Handles are keyed by variable name, so React reuses/removes
          them correctly as variables are added or deleted — no
          duplicate handles, no orphaned ones. */}
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          id={varName}
          type="target"
          position={Position.Left}
          style={{ top: `${((i + 1) / (handleCount + 1)) * 100}%` }}
          className="vf-handle"
        />
      ))}

      <div className="vf-node__header">
        <span className="vf-node__icon" style={{ background: config.color }}>
          <FiType size={14} />
        </span>
        <span className="vf-node__title">{config.label}</span>
        <div className="vf-node__actions">
          <button className="vf-node__iconbtn" title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateNode(id); }}>
            <FiCopy size={12} />
          </button>
          <button className="vf-node__iconbtn vf-node__iconbtn--danger" title="Delete" onClick={(e) => { e.stopPropagation(); removeNode(id); }}>
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>

      <div className="vf-node__body nodrag">
        <label className="vf-field">
          <span>Content</span>
          <textarea
            ref={textareaRef}
            className="vf-input vf-textarea"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Use {{variable}} to create an input"
          />
        </label>

        {/* Live highlighted preview so variables are visible without
            hunting through raw braces. */}
        <div className="vf-field">
          <span>Preview</span>
          <div className="vf-input" style={{ lineHeight: 1.6, minHeight: 20, whiteSpace: 'pre-wrap' }}>
            {segments.length === 0 && <span style={{ color: 'var(--text-tertiary)' }}>Empty</span>}
            {segments.map((seg, i) =>
              seg.type === 'var'
                ? <span key={i} className="vf-var-pill">{'{{'}{seg.value}{'}}'}</span>
                : <span key={i}>{seg.value}</span>
            )}
          </div>
        </div>

        {variables.length > 0 && (
          <div className="vf-node__varlist">
            {variables.map((v) => (
              <span key={v} className="vf-var-pill">{v}</span>
            ))}
          </div>
        )}
      </div>

      <Handle id="output" type="source" position={Position.Right} className="vf-handle vf-handle--source" />
    </motion.div>
  );
}

export default memo(TextNodeImpl);
