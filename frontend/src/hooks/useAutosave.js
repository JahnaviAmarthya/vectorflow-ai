import { useEffect, useRef } from 'react';
import { useFlowStore } from '../store/flowStore';

export function useAutosave(delayMs = 1200) {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const autosave = useFlowStore((s) => s.autosave);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => autosave(), delayMs);
    return () => clearTimeout(timer.current);
  }, [nodes, edges, autosave, delayMs]);
}
