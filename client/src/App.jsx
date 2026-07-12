import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EnvironmentalModule from './pages/EnvironmentalModule';
import SocialModule from './pages/SocialModule';
import GovernanceModule from './pages/GovernanceModule';
import GamificationModule from './pages/GamificationModule';
import ReportsModule from './pages/ReportsModule';
import SettingsModule from './pages/SettingsModule';

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/environmental/*" element={<EnvironmentalModule />} />
            <Route path="/social/*" element={<SocialModule />} />
            <Route path="/governance/*" element={<GovernanceModule />} />
            <Route path="/gamification/*" element={<GamificationModule />} />
            <Route path="/reports/*" element={<ReportsModule />} />
            <Route path="/settings/*" element={<SettingsModule />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  </AuthProvider>
);

export default App;
