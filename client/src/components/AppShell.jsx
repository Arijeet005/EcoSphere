import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopTabBar from './TopTabBar';

const AppShell = () => (
  <div className="mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-slate-950/40">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          <TopTabBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AppShell;
