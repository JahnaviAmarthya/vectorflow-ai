import { useEffect } from 'react';
import { useFlowStore } from '../store/flowStore';

/**
 * Global editor shortcuts. Ignored while focus is inside a text input
 * or textarea so typing "e" in a node field doesn't trigger anything.
 */
export function useKeyboardShortcuts({ onSave } = {}) {
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const removeNode = useFlowStore((s) => s.removeNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      const cmd = e.metaKey || e.ctrlKey;

      if (cmd && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (cmd && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if (cmd && e.key.toLowerCase() === 's') { e.preventDefault(); onSave?.(); return; }

      if (isTyping) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        removeNode(selectedNodeId);
      }
      if (cmd && e.key.toLowerCase() === 'd' && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo, selectedNodeId, removeNode, duplicateNode, onSave]);
}
