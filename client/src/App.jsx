import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import EnvironmentalDashboard from './pages/EnvironmentalDashboard';
import Login from './pages/Login';
import CarbonTransactionForm from './pages/CarbonTransactionForm';
import Register from './pages/Register';

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<EnvironmentalDashboard />} />
          <Route path="/carbon-transaction" element={<CarbonTransactionForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  </AuthProvider>
);

export default App;
