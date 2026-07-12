import { useEffect, useMemo, useState } from 'react';
import { approveCsrActivity, fetchCsrActivities, rejectCsrActivity, submitCsrActivity } from '../api/metricsApi';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  title: '',
  description: '',
  hoursSpent: '',
  evidenceRequired: false,
  evidenceUrl: '',
};

const CsrActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const pendingApprovals = useMemo(() => activities.filter((activity) => activity.status === 'PENDING_APPROVAL'), [activities]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await fetchCsrActivities();
      setActivities(response?.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load CSR activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: 'idle', message: '' });
      await submitCsrActivity({
        ...form,
        hoursSpent: Number(form.hoursSpent),
        evidenceRequired: Boolean(form.evidenceRequired),
      });
      setForm(emptyForm);
      setStatus({ type: 'success', message: 'CSR activity submitted for review.' });
      await loadActivities();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to submit CSR activity.' });
    } finally {
      setSaving(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveCsrActivity(id);
      } else {
        await rejectCsrActivity(id);
      }
      await loadActivities();
    } catch (err) {
      setError(err.message || 'Unable to update approval status');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">CSR Activities</h1>
        <p className="mt-1 text-sm text-slate-400">Capture community and social impact efforts and route them through review.</p>
      </div>

      {user?.role === 'MANAGER' && pendingApprovals.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <p className="font-medium">Pending approvals</p>
          <p className="mt-1">{pendingApprovals.length} submission(s) need your review.</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Activity list</h2>
          {loading ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading activities…</div>
          ) : error ? (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
          ) : activities.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No CSR activities recorded yet.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${activity.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-300' : activity.status === 'REJECTED' ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-500/15 text-amber-300'}`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>Participant: {activity.participant?.name || 'Unknown'}</span>
                    <span>Hours: {activity.hoursSpent}</span>
                    <span>{activity.evidenceRequired ? 'Evidence required' : 'No evidence required'}</span>
                  </div>
                  {user?.role === 'MANAGER' && activity.status === 'PENDING_APPROVAL' ? (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => handleApproval(activity.id, 'approve')} className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">Approve</button>
                      <button onClick={() => handleApproval(activity.id, 'reject')} className="rounded bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500">Reject</button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">Submit an activity</h2>
          <p className="mt-2 text-sm text-slate-400">Employees can log participation and upload supporting evidence when required.</p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Activity title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </div>
            <div>
              <textarea className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="3" required />
            </div>
            <div>
              <input type="number" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Hours spent" value={form.hoursSpent} onChange={(event) => setForm({ ...form, hoursSpent: event.target.value })} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.evidenceRequired} onChange={(event) => setForm({ ...form, evidenceRequired: event.target.checked })} />
              Evidence required
            </label>
            {form.evidenceRequired ? (
              <div>
                <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Proof upload URL or reference" value={form.evidenceUrl} onChange={(event) => setForm({ ...form, evidenceUrl: event.target.value })} />
              </div>
            ) : null}
            {status.type === 'success' ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status.message}</p> : null}
            {status.type === 'error' ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{status.message}</p> : null}
            <button className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400" disabled={saving}>
              {saving ? 'Submitting…' : 'Submit activity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CsrActivities;
