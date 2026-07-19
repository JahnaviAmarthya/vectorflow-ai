import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { NODE_CONFIG } from '../nodes/nodeConfig';

const AUTOSAVE_KEY = 'vectorflow.autosave.v1';
const HISTORY_LIMIT = 50;

function defaultDataFor(configKey) {
  const config = NODE_CONFIG[configKey];
  const data = {};
  config.fields.forEach((f) => { data[f.key] = f.default; });
  return data;
}

function snapshot(nodes, edges) {
  return { nodes: structuredClone(nodes), edges: structuredClone(edges) };
}

export const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  past: [],
  future: [],

  // ---- React Flow wiring ----
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    get().pushHistory();
    set({ edges: addEdge({ ...connection, animated: false, style: { stroke: 'var(--accent-1)', strokeWidth: 1.5 } }, get().edges) });
  },

  // ---- Node CRUD ----
  addNode: (configKey, position) => {
    get().pushHistory();
    const id = `${configKey}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newNode = {
      id,
      type: configKey,
      position: position ?? { x: 250, y: 150 },
      data: defaultDataFor(configKey),
    };
    set({ nodes: [...get().nodes, newNode], selectedNodeId: id });
    return id;
  },

  updateNodeField: (id, key, value) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n
      ),
    });
  },

  removeNode: (id) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  duplicateNode: (id) => {
    get().pushHistory();
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    const newId = `${node.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const clone = {
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      data: structuredClone(node.data),
      selected: false,
    };
    set({ nodes: [...get().nodes, clone], selectedNodeId: newId });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // ---- History (undo/redo) ----
  pushHistory: () => {
    const { nodes, edges, past } = get();
    const next = [...past, snapshot(nodes, edges)].slice(-HISTORY_LIMIT);
    set({ past: next, future: [] });
  },
  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      past: past.slice(0, -1),
      future: [snapshot(nodes, edges), ...future].slice(0, HISTORY_LIMIT),
    });
  },
  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, snapshot(nodes, edges)].slice(-HISTORY_LIMIT),
      future: future.slice(1),
    });
  },

  // ---- Persistence ----
  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
  loadGraph: (graph) => {
    get().pushHistory();
    set({ nodes: graph.nodes ?? [], edges: graph.edges ?? [], selectedNodeId: null });
  },
  autosave: () => {
    const { nodes, edges } = get();
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ nodes, edges, savedAt: Date.now() }));
  },
  loadAutosave: () => {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    try {
      const { nodes, edges } = JSON.parse(raw);
      set({ nodes: nodes ?? [], edges: edges ?? [] });
      return true;
    } catch {
      return false;
    }
  },
}));
