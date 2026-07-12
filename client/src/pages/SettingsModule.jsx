import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';
import { fetchDepartments } from '../api/metricsApi';
import api from '../api/axiosInstance';

const tabs = [
  { label: 'Departments', path: '/settings/departments' },
  { label: 'Categories', path: '/settings/categories' },
  { label: 'ESG Configuration', path: '/settings/esg-configuration' },
  { label: 'Notification Settings', path: '/settings/notification-settings' },
];

const categories = [
  { name: 'Carbon', owner: 'Environmental', status: 'Active' },
  { name: 'Community', owner: 'Social', status: 'Active' },
  { name: 'Compliance', owner: 'Governance', status: 'Review' },
];

const ToggleRow = ({ label, description, checked, onToggle }) => (
  <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4">
    <div>
      <p className="font-medium text-white">{label}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
    <button type="button" onClick={onToggle} className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </label>
);

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetchDepartments();
      setDepartments(response?.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, { name });
        setStatusMessage('Department updated');
      } else {
        await api.post('/departments', { name });
        setStatusMessage('Department created');
      }
      setName('');
      setEditingId('');
      await loadDepartments();
    } catch (err) {
      setError(err.message || 'Unable to save department');
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setName(department.name);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      await loadDepartments();
      setStatusMessage('Department removed');
    } catch (err) {
      setError(err.message || 'Unable to delete department');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-xl font-semibold text-white">Department directory</h3>
        <p className="mt-2 text-sm text-slate-400">Manage operational units connected to ESG data and reporting.</p>
        {loading ? (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading departments…</div>
        ) : error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
        ) : (
          <div className="mt-4 space-y-3">
            {departments.map((department) => (
              <div key={department.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{department.name}</p>
                  <p className="text-sm text-slate-400">Active ESG workspace</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(department)} className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-200">Edit</button>
                  <button onClick={() => handleDelete(department.id)} className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-xl font-semibold text-white">{editingId ? 'Edit department' : 'Add department'}</h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department name</label>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Procurement" required />
          </div>
          {statusMessage ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{statusMessage}</p> : null}
          <div className="flex gap-3">
            <button className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">Save</button>
            {editingId ? <button type="button" onClick={() => { setEditingId(''); setName(''); }} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200">Cancel</button> : null}
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoriesPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-800/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">Owner Module</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.name} className="border-t border-slate-800">
              <td className="px-4 py-3">{category.name}</td>
              <td className="px-4 py-3">{category.owner}</td>
              <td className="px-4 py-3">{category.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ESGConfigurationPage = () => {
  const [settings, setSettings] = useState({
    autoEmission: true,
    evidenceRequired: true,
    badges: true,
    alerts: false,
  });

  const toggleSetting = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h3 className="text-xl font-semibold text-white">Global ESG configuration</h3>
      <div className="mt-5 space-y-3">
        <ToggleRow label="Enable auto emission calculation" description="Automatically calculate emissions from logged activities." checked={settings.autoEmission} onToggle={() => toggleSetting('autoEmission')} />
        <ToggleRow label="Require evidence for all CSR activities" description="Ensure every submitted social activity includes supporting proof." checked={settings.evidenceRequired} onToggle={() => toggleSetting('evidenceRequired')} />
        <ToggleRow label="Auto-award badges on challenge completion" description="Instantly grant recognition after successful challenge completion." checked={settings.badges} onToggle={() => toggleSetting('badges')} />
        <ToggleRow label="Email alerts for new compliance issues" description="Notify managers immediately when potential issues are recorded." checked={settings.alerts} onToggle={() => toggleSetting('alerts')} />
      </div>
    </div>
  );
};

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({
    weeklyDigest: true,
    reportReady: true,
    milestoneAlerts: false,
    systemUpdates: true,
  });

  const toggleSetting = (key) => setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <h3 className="text-xl font-semibold text-white">Notification preferences</h3>
      <div className="mt-5 space-y-3">
        <ToggleRow label="Weekly ESG digest" description="Receive a curated report of key metrics and milestones every week." checked={settings.weeklyDigest} onToggle={() => toggleSetting('weeklyDigest')} />
        <ToggleRow label="Report ready alerts" description="Get notified when a report is generated and ready to review." checked={settings.reportReady} onToggle={() => toggleSetting('reportReady')} />
        <ToggleRow label="Milestone alerts" description="Prompt notifications for challenge completions and badge milestones." checked={settings.milestoneAlerts} onToggle={() => toggleSetting('milestoneAlerts')} />
        <ToggleRow label="System updates" description="Receive product updates and workflow announcements from EcoSphere." checked={settings.systemUpdates} onToggle={() => toggleSetting('systemUpdates')} />
      </div>
    </div>
  );
};

const SettingsModule = () => (
  <div>
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Configure departments, categories, and ESG defaults.</p>
      </div>
      <div className="rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 text-sm font-medium text-slate-300">System</div>
    </div>
    <SubTabBar tabs={tabs} accent="emerald" />
    <Routes>
      <Route path="" element={<Navigate to="/settings/departments" replace />} />
      <Route path="departments" element={<DepartmentsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="esg-configuration" element={<ESGConfigurationPage />} />
      <Route path="notification-settings" element={<NotificationSettingsPage />} />
    </Routes>
  </div>
);

export default SettingsModule;
