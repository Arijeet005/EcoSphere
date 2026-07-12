import { NavLink } from 'react-router-dom';

const SubTabBar = ({ tabs, accent = 'emerald' }) => {
  const accentClasses = {
    emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    blue: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    purple: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `rounded-full border px-3 py-1.5 text-sm transition ${isActive ? `${accentClasses[accent]} shadow-sm` : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white'}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SubTabBar;
