import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Environmental', path: '/environmental' },
  { label: 'Social', path: '/social' },
  { label: 'Governance', path: '/governance' },
  { label: 'Gamification', path: '/gamification' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
];

const TopTabBar = () => {
  const { user } = useAuth();
  const visibleTabs = user?.role === 'EMPLOYEE' ? tabs.filter((tab) => tab.path !== '/settings') : tabs;

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-800 bg-slate-900/80 p-4">
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `rounded-full border px-3 py-1.5 text-sm transition ${isActive ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300' : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white'}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TopTabBar;
