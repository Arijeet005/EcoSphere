import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Departments', path: '/settings/departments' },
  { label: 'Categories', path: '/settings/categories' },
  { label: 'ESG Configuration', path: '/settings/esg-configuration' },
  { label: 'Notification Settings', path: '/settings/notification-settings' },
];

const Placeholder = ({ title, body }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{body}</p>
  </div>
);

const SettingsModule = () => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Configure departments, categories, and ESG defaults.</p>
      </div>
      <div className="rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 text-sm font-medium text-slate-300">System</div>
    </div>
    <SubTabBar tabs={tabs} accent="emerald" />
    <Routes>
      <Route path="" element={<Navigate to="/settings/departments" replace />} />
      <Route path="departments" element={<Placeholder title="Departments" body="Department configuration will appear here." />} />
      <Route path="categories" element={<Placeholder title="Categories" body="Category management will appear here." />} />
      <Route path="esg-configuration" element={<Placeholder title="ESG Configuration" body="Global ESG configuration will appear here." />} />
      <Route path="notification-settings" element={<Placeholder title="Notification Settings" body="Notification preference controls will appear here." />} />
    </Routes>
  </div>
);

export default SettingsModule;
