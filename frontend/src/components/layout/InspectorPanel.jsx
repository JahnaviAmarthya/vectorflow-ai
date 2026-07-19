import { FiX } from 'react-icons/fi';
import { NODE_CONFIG } from '../../nodes/nodeConfig';
import { FieldControl } from '../../nodes/BaseNode';
import { useFlowStore } from '../../store/flowStore';

export default function InspectorPanel() {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useFlowStore((s) => s.setSelectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const updateNodeField = useFlowStore((s) => s.updateNodeField);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <aside className="glass-panel vf-inspector vf-inspector--empty">
        <p>Select a node to view its properties, settings, and connections.</p>
      </aside>
    );
  }

  const config = NODE_CONFIG[node.type];
  const connections = edges.filter((e) => e.source === node.id || e.target === node.id);

  return (
    <aside className="glass-panel vf-inspector">
      <div className="vf-inspector__header">
        <div>
          <span className="vf-inspector__eyebrow">{config.category}</span>
          <h3>{config.label}</h3>
        </div>
        <button className="vf-node__iconbtn" onClick={() => setSelectedNodeId(null)}><FiX size={14} /></button>
      </div>

      <p className="vf-inspector__desc">{config.description}</p>

      <div className="vf-inspector__section">
        <span className="vf-inspector__label">Settings</span>
        <div className="vf-inspector__fields">
          {config.fields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={node.data?.[field.key] ?? field.default}
              onChange={(v) => updateNodeField(node.id, field.key, v)}
            />
          ))}
        </div>
      </div>

      <div className="vf-inspector__section">
        <span className="vf-inspector__label">Connections ({connections.length})</span>
        {connections.length === 0 && <p className="vf-inspector__muted">Not connected to any other node yet.</p>}
        <ul className="vf-inspector__connlist">
          {connections.map((e) => (
            <li key={e.id}>
              <span className="vf-mono">{e.source}</span> → <span className="vf-mono">{e.target}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
