import { useEffect, useMemo, useState } from 'react';
import { createComplianceItem, fetchComplianceItems, updateComplianceItem } from '../api/metricsApi';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  id: '',
  title: '',
  framework: '',
  dueDate: '',
  severity: 'MEDIUM',
  owner: '',
  description: '',
};

const Compliance = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const overdueIssues = useMemo(() => issues.filter((issue) => issue.isOverdue), [issues]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await fetchComplianceItems();
      setIssues(response?.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load compliance issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: 'idle', message: '' });
      if (form.id) {
        await updateComplianceItem({ ...form, id: Number(form.id) });
        setStatus({ type: 'success', message: 'Compliance issue updated.' });
      } else {
        await createComplianceItem({ ...form, departmentId: 1 });
        setStatus({ type: 'success', message: 'Compliance issue created.' });
      }
      setForm(emptyForm);
      await loadIssues();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to save compliance issue.' });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (issue) => {
    setForm({
      id: issue.id,
      title: issue.title,
      framework: issue.framework,
      dueDate: issue.dueDate?.slice(0, 10) || '',
      severity: issue.severity || 'MEDIUM',
      owner: issue.owner || '',
      description: issue.description || '',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">Compliance</h1>
        <p className="mt-1 text-sm text-slate-400">Review regulatory obligations, priorities, and ownership.</p>
      </div>

      {overdueIssues.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          <p className="font-medium">Overdue issues detected</p>
          <p className="mt-1">{overdueIssues.length} item(s) need immediate attention.</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Issue list</h2>
          {loading ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading compliance issues…</div>
          ) : error ? (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
          ) : issues.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No compliance issues found.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className={`rounded-xl border p-4 ${issue.isOverdue ? 'border-rose-500/40 bg-rose-500/10' : 'border-slate-800 bg-slate-950/70'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{issue.title}</p>
                        {issue.isOverdue ? <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-300">Overdue</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{issue.description}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${issue.severity === 'HIGH' ? 'bg-rose-500/15 text-rose-300' : issue.severity === 'MEDIUM' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>Owner: {issue.owner}</span>
                    <span>Framework: {issue.framework}</span>
                    <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                    <span>Status: {issue.status}</span>
                  </div>
                  {user?.role === 'MANAGER' ? (
                    <button onClick={() => startEdit(issue)} className="mt-3 rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">Edit issue</button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">{form.id ? 'Edit issue' : 'Create issue'}</h2>
          <p className="mt-2 text-sm text-slate-400">Managers can manage outstanding compliance items.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Issue title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </div>
            <div>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Framework" value={form.framework} onChange={(event) => setForm({ ...form, framework: event.target.value })} required />
            </div>
            <div>
              <input type="date" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
            </div>
            <div>
              <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Owner" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} required />
            </div>
            <div>
              <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="3" required />
            </div>
            {status.type === 'success' ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status.message}</p> : null}
            {status.type === 'error' ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{status.message}</p> : null}
            {user?.role === 'MANAGER' ? (
              <button className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400" disabled={saving}>
                {saving ? 'Saving…' : form.id ? 'Update issue' : 'Create issue'}
              </button>
            ) : (
              <p className="text-sm text-slate-400">Manager access is required to manage compliance issues.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
