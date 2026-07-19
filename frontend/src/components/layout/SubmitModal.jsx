import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FiCheckCircle, FiXCircle, FiX, FiLoader } from 'react-icons/fi';
import { parsePipeline } from '../../services/api';

export default function SubmitModal({ open, onClose, nodes, edges }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus('loading');
    setErrorMsg('');

    parsePipeline(nodes, edges)
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setStatus('success');
        if (data.is_dag) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#2dd4bf'],
          });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err?.response?.data?.detail || err.message || 'Could not reach the backend.');
        setStatus('error');
      });

    return () => { cancelled = true; };
  }, [open, nodes, edges]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="vf-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel vf-modal"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="vf-modal__close" onClick={onClose}><FiX size={16} /></button>

            {status === 'loading' && (
              <div className="vf-modal__state">
                <FiLoader className="vf-spin" size={28} />
                <p>Validating pipeline…</p>
              </div>
            )}

            {status === 'error' && (
              <div className="vf-modal__state">
                <FiXCircle size={32} color="var(--rose)" />
                <p>Couldn't validate the pipeline</p>
                <span className="vf-inspector__muted">{errorMsg}</span>
              </div>
            )}

            {status === 'success' && result && (
              <div className="vf-modal__result">
                <div className={`vf-modal__badge ${result.is_dag ? 'vf-modal__badge--ok' : 'vf-modal__badge--warn'}`}>
                  {result.is_dag ? <FiCheckCircle size={28} /> : <FiXCircle size={28} />}
                </div>
                <h2>{result.is_dag ? 'Valid pipeline' : 'Cycle detected'}</h2>
                <p className="vf-inspector__muted">
                  {result.is_dag
                    ? 'Your pipeline is a valid DAG and is ready to run.'
                    : 'This graph contains a cycle, so it cannot execute as a pipeline.'}
                </p>

                <div className="vf-modal__stats">
                  <StatRow label="Nodes" value={result.num_nodes} ok />
                  <StatRow label="Edges" value={result.num_edges} ok />
                  <StatRow label="DAG validation" value={result.is_dag ? 'Passed' : 'Failed'} ok={result.is_dag} />
                </div>

                {!result.is_dag && result.cycle_nodes?.length > 0 && (
                  <p className="vf-inspector__muted">
                    Cycle involves: <span className="vf-mono">{result.cycle_nodes.join(', ')}</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, value, ok }) {
  return (
    <div className="vf-modal__statrow">
      <span>{label}</span>
      <span className={ok ? 'vf-modal__statvalue--ok' : 'vf-modal__statvalue--warn'}>
        {ok ? <FiCheckCircle size={13} /> : <FiXCircle size={13} />} {value}
      </span>
    </div>
  );
}
