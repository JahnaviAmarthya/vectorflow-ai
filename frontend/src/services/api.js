import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

/**
 * Sends the current graph to the backend for DAG validation.
 * Node/edge objects are trimmed to the shape the API cares about so
 * we don't ship React Flow's internal render state over the wire.
 */
export async function parsePipeline(nodes, edges) {
  const payload = {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
  };
  const { data } = await client.post('/pipelines/parse', payload);
  return data;
}

export default client;
