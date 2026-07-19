import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background, Controls, MiniMap, BackgroundVariant, ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import toast, { Toaster } from 'react-hot-toast';
import { FiLayers } from 'react-icons/fi';

import { nodeTypes } from '../nodes';
import { useFlowStore } from '../store/flowStore';
import { useAutosave } from '../hooks/useAutosave';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useThemeMode } from '../hooks/useThemeMode';
import NodePalette from '../components/layout/NodePalette';
import InspectorPanel from '../components/layout/InspectorPanel';
import EditorToolbar from '../components/layout/EditorToolbar';
import SubmitModal from '../components/layout/SubmitModal';
import ContextMenu from '../components/layout/ContextMenu';
import '../styles/layout.css';

const PIPELINES_KEY = 'vectorflow.pipelines.v1';

function EditorInner() {
  const { pipelineId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggle } = useThemeMode();
  const wrapperRef = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const setSelectedNodeId = useFlowStore((s) => s.setSelectedNodeId);
  const loadAutosave = useFlowStore((s) => s.loadAutosave);
  const clearCanvas = useFlowStore((s) => s.clearCanvas);
  const autosave = useFlowStore((s) => s.autosave);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const pipelineName = location.state?.name || 'Untitled Pipeline';

  useEffect(() => {
    clearCanvas();
    loadAutosave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineId]);

  useAutosave();
  useKeyboardShortcuts({ onSave: () => { autosave(); toast.success('Saved'); } });

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const configKey = e.dataTransfer.getData('application/vectorflow-node');
      if (!configKey) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(configKey, position);
    },
    [addNode, screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setContextMenu(null);
  }, [setSelectedNodeId]);

  const onNodeClick = useCallback((_, node) => setSelectedNodeId(node.id), [setSelectedNodeId]);

  const onPaneContextMenu = useCallback((e) => {
    e.preventDefault();
    const bounds = wrapperRef.current.getBoundingClientRect();
    setContextMenu({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      flowPos: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
    });
  }, [screenToFlowPosition]);

  const onSubmit = useCallback(() => {
    if (nodes.length === 0) {
      toast.error('Add at least one node before submitting.');
      return;
    }
    setSubmitOpen(true);
    // Persist node/execution counts back into the pipeline list entry.
    try {
      const list = JSON.parse(localStorage.getItem(PIPELINES_KEY)) ?? [];
      const next = list.map((p) =>
        p.id === pipelineId
          ? { ...p, nodeCount: nodes.length, executions: (p.executions || 0) + 1, updatedAt: Date.now() }
          : p
      );
      localStorage.setItem(PIPELINES_KEY, JSON.stringify(next));
    } catch { /* non-critical */ }
  }, [nodes.length, pipelineId]);

  const isEmpty = nodes.length === 0;

  return (
    <div className="vf-editor" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="var(--border-subtle)" />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          maskColor="rgba(11,14,20,0.65)"
          style={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}
        />
      </ReactFlow>

      {isEmpty && (
        <div className="vf-empty-canvas">
          <FiLayers size={28} />
          <h3>Start building</h3>
          <p>Drag a node from the left panel onto the canvas, or right-click to add one here.</p>
        </div>
      )}

      <EditorToolbar
        pipelineName={pipelineName}
        onOpenSubmit={onSubmit}
        mode={mode}
        onToggleTheme={toggle}
      />
      <NodePalette />
      <InspectorPanel />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAdd={(configKey) => { addNode(configKey, contextMenu.flowPos); setContextMenu(null); }}
          onClose={() => setContextMenu(null)}
        />
      )}

      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} nodes={nodes} edges={edges} />
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontSize: 13 } }} />
    </div>
  );
}

export default function PipelineEditor() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}
