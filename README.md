# VectorFlow — AI Workflow Builder

A drag-and-drop visual editor for composing AI pipelines (LLMs, data
sources, logic, integrations) that are validated as a real directed
acyclic graph before they run.

> **Scope note:** this was built as a focused, working implementation
> of the core assessment (node abstraction, dynamic variable parsing,
> DAG validation, submit flow) with a polished editor UI around it.
> Auth is a localStorage-backed demo, not a real backend — see
> `frontend/src/services/authService.js`.

---

## Features

- **22 node types** across I/O, AI, Data, Logic, and Integration
  categories — all generated from a single config file
  (`frontend/src/nodes/nodeConfig.js`). Adding a new node type means
  adding one config entry, not a new component.
- **Text node with live variable parsing** — typing `{{name}}` adds a
  target handle named `name` automatically; deleting the variable
  removes the handle and any edge attached to it. No duplicate
  handles. Auto-resizing textarea with a highlighted preview.
- **DAG validation on submit** — nodes/edges are sent to a FastAPI
  backend, which uses NetworkX to check acyclicity and reports node
  count, edge count, and DAG status in a modal (confetti on success).
- **Editor tooling** — undo/redo, duplicate/delete, drag-from-palette
  or right-click-to-add, snap-to-grid, minimap, autosave to
  localStorage, JSON export/import, dark/light theme, keyboard
  shortcuts (⌘Z / ⌘⇧Z / ⌘S / ⌘D / Delete).
- **Dashboard & landing page** — stats cards, recent pipelines list,
  a landing page with a hero and feature grid.

## Architecture

```
Frontend (React 18 + React Flow + Zustand)
  Pages route between Landing → Auth → Dashboard → Editor.
  The editor canvas reads/writes a single Zustand store; React Flow's
  onNodesChange/onEdgesChange feed straight into it.
  Every node on the canvas is rendered by BaseNode (or TextNode for
  the one type with dynamic handles), driven entirely by
  nodeConfig.js — there is no per-node-type React component.

Backend (FastAPI + NetworkX)
  /pipelines/parse accepts { nodes, edges }, builds a networkx.DiGraph,
  and returns { num_nodes, num_edges, is_dag } plus optional cycle
  diagnostics.
```

## Folder structure

```
backend/
  app/
    main.py                 FastAPI app + CORS
    routers/pipelines.py     /pipelines/parse route
    services/graph_service.py NetworkX DAG analysis
    models/schemas.py        Pydantic request/response models

frontend/
  src/
    nodes/
      nodeConfig.js          Single source of truth for all node types
      BaseNode.jsx            Generic node renderer (fields + handles)
      TextNode.jsx             Variable-parsing text node
      index.jsx                Generates React Flow's nodeTypes map
    store/flowStore.js        Zustand store: nodes, edges, history, autosave
    components/layout/        NodePalette, InspectorPanel, EditorToolbar,
                               SubmitModal, ContextMenu
    pages/                    Landing, Auth, Dashboard, PipelineEditor
    services/                 api.js (axios), authService.js (localStorage)
    hooks/                    useAutosave, useKeyboardShortcuts, useThemeMode
    styles/                   theme.css (design tokens), layout.css, muiTheme.js
```

## Installation

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The dev server proxies `/api/*` to `http://localhost:8000` (see
`vite.config.js`). Open http://localhost:5173.

To build for production: `npm run build` (output in `frontend/dist`).

## Using it

1. Register an account (stored locally in your browser).
2. Create a pipeline from the dashboard.
3. Drag nodes from the left palette onto the canvas, or right-click
   the canvas to add one at the cursor.
4. Connect handles by dragging between them. Try a Text node with
   `{{question}}` in it — a new input handle appears live.
5. Click **Submit Pipeline** to send the graph to the backend and see
   the DAG validation result.

## Known limitations / future improvements

- Auth is client-side only (localStorage) — swap in a real backend
  (FastAPI + JWT + a database) for production use.
- Node "execution" is not implemented — the backend validates graph
  structure but doesn't actually run an LLM call, HTTP request, etc.
  A natural next step is an `/pipelines/execute` endpoint that walks
  the DAG in topological order and dispatches each node to a real
  service.
- No automated test suite yet (backend has been exercised manually
  against acyclic/cyclic payloads; a pytest suite covering the
  graph service and a React Testing Library suite for TextNode's
  variable parsing would be the next addition).
- Bundle size warning on `npm run build` (~675 KB) — worth
  code-splitting the editor route from the landing/auth routes.
