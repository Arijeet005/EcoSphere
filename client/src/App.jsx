import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

const Dashboard = () => (
  <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-3 text-sm text-slate-400">This is a placeholder protected page for the hackathon MVP.</p>
    </div>
  </div>
);

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  </AuthProvider>
);

export default App;
