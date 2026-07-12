import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const moduleConfig = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    accent: 'emerald',
  },
  {
    key: 'environmental',
    label: 'Environmental',
    path: '/environmental',
    accent: 'green',
    children: ['Emission Factors', 'Product ESG Profiles', 'Carbon Transactions', 'Environmental Goals'],
  },
  {
    key: 'social',
    label: 'Social',
    path: '/social',
    accent: 'blue',
    children: ['CSR Activities', 'Employee Participation', 'Diversity Dashboard'],
  },
  {
    key: 'governance',
    label: 'Governance',
    path: '/governance',
    accent: 'purple',
    children: ['Policies', 'Policy Acknowledgements', 'Audits', 'Compliance Issues'],
  },
  {
    key: 'gamification',
    label: 'Gamification',
    path: '/gamification',
    accent: 'amber',
    children: ['Challenges', 'Badges', 'Rewards', 'Leaderboard'],
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/reports',
    accent: 'indigo',
    children: ['Summary', 'Carbon Report', 'CSR Report', 'Governance Report'],
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    accent: 'slate',
    children: ['Departments', 'Categories', 'ESG Configuration', 'Notification Settings'],
  },
];

const accentClassMap = {
  emerald: 'text-emerald-300',
  green: 'text-green-300',
  blue: 'text-sky-300',
  purple: 'text-violet-300',
  amber: 'text-amber-300',
  indigo: 'text-indigo-300',
  slate: 'text-slate-300',
};

const Sidebar = () => {
  const { user } = useAuth();

  const visibleModules = user?.role === 'EMPLOYEE' ? moduleConfig.filter((module) => module.key !== 'settings') : moduleConfig;

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950/70 p-4 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">EcoSphere</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Operations Console</h2>
      </div>

      <nav className="space-y-3">
        {visibleModules.map((module) => (
          <div key={module.key}>
            <NavLink
              to={module.path}
              className={({ isActive }) => `flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition ${isActive ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'}`}
            >
              <span>{module.label}</span>
              <span className={`text-xs ${accentClassMap[module.accent]}`}>●</span>
            </NavLink>
            {module.children ? (
              <div className="mt-2 space-y-1 pl-3 text-sm text-slate-400">
                {module.children.map((child) => (
                  <div key={child} className="rounded-lg px-2 py-1.5 hover:bg-slate-800/70 hover:text-slate-200">
                    {child}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
