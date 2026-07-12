import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Compliance from './pages/Compliance';
import CsrActivities from './pages/CsrActivities';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MetricsForm from './pages/MetricsForm';
import Register from './pages/Register';

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/metrics" element={<MetricsForm />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/csr" element={<CsrActivities />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  </AuthProvider>
);

export default App;
