import { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { motion } from 'framer-motion';
import { FiTrash2, FiCopy } from 'react-icons/fi';
import { NODE_CONFIG } from './nodeConfig';
import { useFlowStore } from '../store/flowStore';
import './nodes.css';

const POSITION_MAP = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

/**
 * Renders any node type purely from its nodeConfig entry: title, icon,
 * color, fields, and handles are all data — this component never
 * branches on node type by name. Nodes that need extra behavior (like
 * TextNode's dynamic handles) wrap this component instead of
 * reimplementing it.
 */
function BaseNodeImpl({ id, data, selected, configKey, extraHandles, children, footer }) {
  const config = NODE_CONFIG[configKey];
  const updateNodeField = useFlowStore((s) => s.updateNodeField);
  const removeNode = useFlowStore((s) => s.removeNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);
  const { getZoom } = useReactFlow();

  const handleChange = useCallback(
    (fieldKey, value) => updateNodeField(id, fieldKey, value),
    [id, updateNodeField]
  );

  if (!config) return null;
  const Icon = config.icon;
  const handles = extraHandles ?? config.handles;

  return (
    <motion.div
      className={`vf-node ${selected ? 'vf-node--selected' : ''}`}
      style={{ '--node-color': config.color }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {handles
        .filter((h) => h.type === 'target')
        .map((h) => (
          <Handle
            key={h.id}
            id={h.id}
            type="target"
            position={POSITION_MAP[h.position]}
            style={h.offset ? { top: `${h.offset}%` } : undefined}
            className="vf-handle"
          />
        ))}

      <div className="vf-node__header">
        <span className="vf-node__icon" style={{ background: config.color }}>
          <Icon size={14} />
        </span>
        <span className="vf-node__title">{config.label}</span>
        <div className="vf-node__actions">
          <button
            className="vf-node__iconbtn"
            title="Duplicate"
            onClick={(e) => { e.stopPropagation(); duplicateNode(id); }}
          >
            <FiCopy size={12} />
          </button>
          <button
            className="vf-node__iconbtn vf-node__iconbtn--danger"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); removeNode(id); }}
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>

      {config.description && (
        <p className="vf-node__desc">{config.description}</p>
      )}

      <div className="vf-node__body nodrag">
        {children ?? config.fields.map((field) => (
          <FieldControl
            key={field.key}
            field={field}
            value={data?.[field.key] ?? field.default}
            onChange={(v) => handleChange(field.key, v)}
          />
        ))}
      </div>

      {footer}

      {handles
        .filter((h) => h.type === 'source')
        .map((h) => (
          <Handle
            key={h.id}
            id={h.id}
            type="source"
            position={POSITION_MAP[h.position]}
            style={h.offset ? { top: `${h.offset}%` } : undefined}
            className="vf-handle vf-handle--source"
          />
        ))}
    </motion.div>
  );
}

export function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return (
        <label className="vf-field">
          <span>{field.label}</span>
          <textarea
            className="vf-input vf-textarea"
            value={value}
            rows={3}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );
    case 'select':
      return (
        <label className="vf-field">
          <span>{field.label}</span>
          <select className="vf-input" value={value} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      );
    case 'number':
      return (
        <label className="vf-field">
          <span>{field.label}</span>
          <input
            className="vf-input"
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </label>
      );
    case 'checkbox':
      return (
        <label className="vf-field vf-field--row">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      );
    default:
      return (
        <label className="vf-field">
          <span>{field.label}</span>
          <input
            className="vf-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );
  }
}

export default memo(BaseNodeImpl);
