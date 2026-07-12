import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-lg font-semibold text-emerald-400">
          EcoSphere
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-white">Environmental</Link>
              <Link to="/carbon-transaction" className="hover:text-white">Carbon Tracking</Link>
              {user.role === 'MANAGER' ? <Link to="/reports" className="hover:text-white">Reports</Link> : null}
              <button onClick={handleLogout} className="rounded bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">Login</Link>
              <Link to="/register" className="hover:text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
