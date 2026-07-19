import BaseNode from './BaseNode';
import TextNode from './TextNode';
import { NODE_CONFIG, NODE_TYPES_LIST } from './nodeConfig';

/**
 * React Flow wants a stable `{ [type]: Component }` map. Rather than
 * writing one wrapper component per node type by hand, we generate a
 * thin wrapper for every entry in NODE_CONFIG that isn't special-cased
 * (currently only `text`, which needs dynamic handles).
 */
function makeWrapper(configKey) {
  const Wrapper = (props) => <BaseNode {...props} configKey={configKey} />;
  Wrapper.displayName = `Node(${configKey})`;
  return Wrapper;
}

export const nodeTypes = NODE_TYPES_LIST.reduce((acc, key) => {
  acc[key] = key === 'text' ? TextNode : makeWrapper(key);
  return acc;
}, {});

export { NODE_CONFIG, NODE_TYPES_LIST };
