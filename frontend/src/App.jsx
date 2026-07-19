import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import { Login, Register, ForgotPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PipelineEditor from './pages/PipelineEditor';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:pipelineId"
          element={
            <ProtectedRoute>
              <PipelineEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
