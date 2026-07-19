/**
 * Single source of truth for every node type in the palette.
 *
 * This is the whole point of the BaseNode abstraction: adding a new
 * node type means adding one entry here, NOT writing a new React
 * component. BaseNode reads `fields` + `handles` and renders itself.
 *
 * field.type: 'text' | 'textarea' | 'select' | 'number' | 'checkbox'
 * handle.type: 'source' | 'target'
 * handle.position: 'left' | 'right' | 'top' | 'bottom'
 */
import {
  FiLogIn, FiLogOut, FiType, FiCpu, FiImage, FiFileText, FiDatabase,
  FiGlobe, FiGitBranch, FiShuffle, FiClock, FiGitMerge, FiMail,
  FiCode, FiRepeat, FiBell, FiLayers, FiZap, FiHash, FiTerminal,
} from 'react-icons/fi';
import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { TbVectorBezier2 } from 'react-icons/tb';

export const CATEGORIES = ['I/O', 'AI', 'Data', 'Logic', 'Integration'];

export const NODE_CONFIG = {
  input: {
    label: 'Input', category: 'I/O', icon: FiLogIn, color: '#6366f1',
    description: 'Entry point that feeds a value into the pipeline.',
    fields: [
      { key: 'name', label: 'Name', type: 'text', default: 'input_1' },
      { key: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File', 'Number'], default: 'Text' },
    ],
    handles: [{ id: 'value', type: 'source', position: 'right' }],
  },
  output: {
    label: 'Output', category: 'I/O', icon: FiLogOut, color: '#8b5cf6',
    description: 'Terminal node that surfaces a pipeline result.',
    fields: [
      { key: 'name', label: 'Name', type: 'text', default: 'output_1' },
      { key: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image', 'JSON'], default: 'Text' },
    ],
    handles: [{ id: 'value', type: 'target', position: 'left' }],
  },
  text: {
    label: 'Text', category: 'I/O', icon: FiType, color: '#22d3ee',
    description: 'Editable text block. {{variables}} become input handles.',
    fields: [
      { key: 'text', label: 'Content', type: 'textarea', default: 'Hello {{name}}, answer this: {{question}}' },
    ],
    handles: [{ id: 'output', type: 'source', position: 'right' }],
    dynamicHandles: true,
  },
  llm: {
    label: 'LLM', category: 'AI', icon: FiCpu, color: '#a855f7',
    description: 'Runs a prompt through a large language model.',
    fields: [
      { key: 'model', label: 'Model', type: 'select', options: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5'], default: 'claude-sonnet-5' },
      { key: 'temperature', label: 'Temperature', type: 'number', default: 0.7 },
    ],
    handles: [
      { id: 'system', type: 'target', position: 'left', offset: 30 },
      { id: 'prompt', type: 'target', position: 'left', offset: 70 },
      { id: 'response', type: 'source', position: 'right' },
    ],
  },
  imageGen: {
    label: 'Image Generator', category: 'AI', icon: FiImage, color: '#ec4899',
    description: 'Generates an image from a text prompt.',
    fields: [
      { key: 'size', label: 'Size', type: 'select', options: ['512x512', '1024x1024'], default: '1024x1024' },
    ],
    handles: [
      { id: 'prompt', type: 'target', position: 'left' },
      { id: 'image', type: 'source', position: 'right' },
    ],
  },
  promptTemplate: {
    label: 'Prompt Template', category: 'AI', icon: FiTerminal, color: '#c084fc',
    description: 'Reusable prompt scaffold for downstream LLM nodes.',
    fields: [
      { key: 'template', label: 'Template', type: 'textarea', default: 'You are a helpful assistant. Task: {{task}}' },
    ],
    handles: [
      { id: 'vars', type: 'target', position: 'left' },
      { id: 'prompt', type: 'source', position: 'right' },
    ],
  },
  csvReader: {
    label: 'CSV Reader', category: 'Data', icon: BsFileEarmarkSpreadsheet, color: '#22c55e',
    description: 'Parses a CSV file into structured rows.',
    fields: [
      { key: 'delimiter', label: 'Delimiter', type: 'text', default: ',' },
      { key: 'hasHeader', label: 'Has header row', type: 'checkbox', default: true },
    ],
    handles: [
      { id: 'file', type: 'target', position: 'left' },
      { id: 'rows', type: 'source', position: 'right' },
    ],
  },
  pdfReader: {
    label: 'PDF Reader', category: 'Data', icon: FiFileText, color: '#16a34a',
    description: 'Extracts text content from a PDF document.',
    fields: [
      { key: 'ocr', label: 'Use OCR', type: 'checkbox', default: false },
    ],
    handles: [
      { id: 'file', type: 'target', position: 'left' },
      { id: 'text', type: 'source', position: 'right' },
    ],
  },
  database: {
    label: 'Database', category: 'Data', icon: FiDatabase, color: '#14b8a6',
    description: 'Reads or writes rows against a connected database.',
    fields: [
      { key: 'query', label: 'Query', type: 'textarea', default: 'SELECT * FROM table' },
    ],
    handles: [
      { id: 'params', type: 'target', position: 'left' },
      { id: 'rows', type: 'source', position: 'right' },
    ],
  },
  vectorStore: {
    label: 'Vector Store', category: 'Data', icon: TbVectorBezier2, color: '#0ea5e9',
    description: 'Stores and retrieves embeddings for similarity search.',
    fields: [
      { key: 'topK', label: 'Top K', type: 'number', default: 5 },
    ],
    handles: [
      { id: 'query', type: 'target', position: 'left' },
      { id: 'matches', type: 'source', position: 'right' },
    ],
  },
  embeddings: {
    label: 'Embeddings', category: 'AI', icon: FiHash, color: '#818cf8',
    description: 'Converts text into a dense vector representation.',
    fields: [
      { key: 'model', label: 'Model', type: 'select', options: ['text-embed-small', 'text-embed-large'], default: 'text-embed-small' },
    ],
    handles: [
      { id: 'text', type: 'target', position: 'left' },
      { id: 'vector', type: 'source', position: 'right' },
    ],
  },
  apiRequest: {
    label: 'API Request', category: 'Integration', icon: FiGlobe, color: '#f59e0b',
    description: 'Calls an external HTTP endpoint.',
    fields: [
      { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      { key: 'url', label: 'URL', type: 'text', default: 'https://api.example.com' },
    ],
    handles: [
      { id: 'body', type: 'target', position: 'left' },
      { id: 'response', type: 'source', position: 'right' },
    ],
  },
  webhook: {
    label: 'Webhook', category: 'Integration', icon: FiZap, color: '#fb923c',
    description: 'Triggers the pipeline when an inbound event arrives.',
    fields: [
      { key: 'path', label: 'Path', type: 'text', default: '/hooks/incoming' },
    ],
    handles: [{ id: 'payload', type: 'source', position: 'right' }],
  },
  email: {
    label: 'Email', category: 'Integration', icon: FiMail, color: '#f43f5e',
    description: 'Sends an email with the piped-in content.',
    fields: [
      { key: 'to', label: 'To', type: 'text', default: '' },
      { key: 'subject', label: 'Subject', type: 'text', default: '' },
    ],
    handles: [{ id: 'body', type: 'target', position: 'left' }],
  },
  condition: {
    label: 'Condition', category: 'Logic', icon: FiGitBranch, color: '#eab308',
    description: 'Branches the pipeline based on a boolean expression.',
    fields: [
      { key: 'expression', label: 'Expression', type: 'text', default: 'value > 0' },
    ],
    handles: [
      { id: 'value', type: 'target', position: 'left' },
      { id: 'true', type: 'source', position: 'right', offset: 30 },
      { id: 'false', type: 'source', position: 'right', offset: 70 },
    ],
  },
  switch: {
    label: 'Switch', category: 'Logic', icon: FiShuffle, color: '#facc15',
    description: 'Routes to one of several outputs by matched case.',
    fields: [
      { key: 'cases', label: 'Cases (comma-separated)', type: 'text', default: 'a,b,c' },
    ],
    handles: [
      { id: 'value', type: 'target', position: 'left' },
      { id: 'out', type: 'source', position: 'right' },
    ],
  },
  merge: {
    label: 'Merge', category: 'Logic', icon: FiGitMerge, color: '#84cc16',
    description: 'Combines multiple incoming branches into one.',
    fields: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['concat', 'first', 'zip'], default: 'concat' },
    ],
    handles: [
      { id: 'in1', type: 'target', position: 'left', offset: 30 },
      { id: 'in2', type: 'target', position: 'left', offset: 70 },
      { id: 'out', type: 'source', position: 'right' },
    ],
  },
  loop: {
    label: 'Loop', category: 'Logic', icon: FiRepeat, color: '#4ade80',
    description: 'Iterates a sub-flow over a collection.',
    fields: [
      { key: 'maxIterations', label: 'Max iterations', type: 'number', default: 10 },
    ],
    handles: [
      { id: 'collection', type: 'target', position: 'left' },
      { id: 'item', type: 'source', position: 'right' },
    ],
  },
  delay: {
    label: 'Delay', category: 'Logic', icon: FiClock, color: '#38bdf8',
    description: 'Pauses execution for a fixed duration.',
    fields: [
      { key: 'seconds', label: 'Seconds', type: 'number', default: 1 },
    ],
    handles: [
      { id: 'in', type: 'target', position: 'left' },
      { id: 'out', type: 'source', position: 'right' },
    ],
  },
  pythonFunction: {
    label: 'Python Function', category: 'Logic', icon: FiCode, color: '#3b82f6',
    description: 'Runs a custom Python snippet against the input.',
    fields: [
      { key: 'code', label: 'Code', type: 'textarea', default: 'def run(x):\n    return x' },
    ],
    handles: [
      { id: 'in', type: 'target', position: 'left' },
      { id: 'out', type: 'source', position: 'right' },
    ],
  },
  calculator: {
    label: 'Calculator', category: 'Logic', icon: FiHash, color: '#60a5fa',
    description: 'Evaluates a numeric expression.',
    fields: [
      { key: 'expression', label: 'Expression', type: 'text', default: 'a + b' },
    ],
    handles: [
      { id: 'a', type: 'target', position: 'left', offset: 30 },
      { id: 'b', type: 'target', position: 'left', offset: 70 },
      { id: 'result', type: 'source', position: 'right' },
    ],
  },
  jsonParser: {
    label: 'JSON Parser', category: 'Data', icon: FiLayers, color: '#2dd4bf',
    description: 'Parses raw text into a JSON object.',
    fields: [
      { key: 'path', label: 'Path (optional)', type: 'text', default: '' },
    ],
    handles: [
      { id: 'raw', type: 'target', position: 'left' },
      { id: 'json', type: 'source', position: 'right' },
    ],
  },
  notification: {
    label: 'Notification', category: 'Integration', icon: FiBell, color: '#fbbf24',
    description: 'Pushes a message to a notification channel.',
    fields: [
      { key: 'channel', label: 'Channel', type: 'select', options: ['Slack', 'Email', 'SMS'], default: 'Slack' },
    ],
    handles: [{ id: 'message', type: 'target', position: 'left' }],
  },
};

export const NODE_TYPES_LIST = Object.keys(NODE_CONFIG);
