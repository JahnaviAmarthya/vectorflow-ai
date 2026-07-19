import { useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft, FiDownload, FiUpload, FiRotateCcw, FiRotateCw,
  FiSun, FiMoon, FiPlay, FiSave,
} from 'react-icons/fi';
import { useFlowStore } from '../../store/flowStore';

export default function EditorToolbar({ pipelineName, onOpenSubmit, mode, onToggleTheme }) {
  const fileInputRef = useRef(null);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const loadGraph = useFlowStore((s) => s.loadGraph);
  const autosave = useFlowStore((s) => s.autosave);

  function exportJson() {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pipelineName || 'pipeline'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Pipeline exported');
  }

  function importJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        loadGraph(parsed);
        toast.success('Pipeline imported');
      } catch {
        toast.error('That file is not valid pipeline JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleSave() {
    autosave();
    toast.success('Saved');
  }

  return (
    <div className="glass-panel vf-toolbar">
      <Link to="/dashboard" className="vf-toolbar__back"><FiArrowLeft size={15} /></Link>
      <span className="vf-toolbar__name">{pipelineName || 'Untitled Pipeline'}</span>

      <div className="vf-toolbar__spacer" />

      <button className="vf-toolbar__btn" title="Undo (Ctrl+Z)" onClick={undo}><FiRotateCcw size={14} /></button>
      <button className="vf-toolbar__btn" title="Redo (Ctrl+Shift+Z)" onClick={redo}><FiRotateCw size={14} /></button>
      <span className="vf-toolbar__divider" />
      <button className="vf-toolbar__btn" title="Save (Ctrl+S)" onClick={handleSave}><FiSave size={14} /></button>
      <button className="vf-toolbar__btn" title="Export JSON" onClick={exportJson}><FiDownload size={14} /></button>
      <button className="vf-toolbar__btn" title="Import JSON" onClick={() => fileInputRef.current?.click()}><FiUpload size={14} /></button>
      <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={importJson} />
      <span className="vf-toolbar__divider" />
      <button className="vf-toolbar__btn" title="Toggle theme" onClick={onToggleTheme}>
        {mode === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
      </button>

      <button className="vf-toolbar__cta" onClick={onOpenSubmit}>
        <FiPlay size={13} /> Submit Pipeline
      </button>
    </div>
  );
}
