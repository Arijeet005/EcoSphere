import { useState } from 'react';
import { createMetric } from '../api/metricsApi';

const MetricsForm = () => {
  const [form, setForm] = useState({ type: 'ENVIRONMENTAL', name: '', value: '', unit: '', departmentId: '1' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Metric name is required';
    if (!form.value) nextErrors.value = 'Value is required';
    else if (Number.isNaN(Number(form.value))) nextErrors.value = 'Value must be numeric';
    if (!form.unit.trim()) nextErrors.unit = 'Unit is required';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatus({ type: 'idle', message: '' });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await createMetric({ ...form, value: Number(form.value) });
      setStatus({ type: 'success', message: 'Metric submitted successfully.' });
      setForm({ type: 'ENVIRONMENTAL', name: '', value: '', unit: '', departmentId: '1' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to submit metric.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Add ESG Metric</h1>
        <p className="mt-2 text-sm text-slate-400">Create a new metric entry for the hackathon dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option value="ENVIRONMENTAL">Environmental</option>
              <option value="SOCIAL">Social</option>
              <option value="GOVERNANCE">Governance</option>
            </select>
          </div>

          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Metric name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            {errors.name ? <p className="mt-1 text-sm text-rose-400">{errors.name}</p> : null}
          </div>

          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Value" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} />
            {errors.value ? <p className="mt-1 text-sm text-rose-400">{errors.value}</p> : null}
          </div>

          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} />
            {errors.unit ? <p className="mt-1 text-sm text-rose-400">{errors.unit}</p> : null}
          </div>

          {status.type === 'success' ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status.message}</p> : null}
          {status.type === 'error' ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{status.message}</p> : null}

          <button className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MetricsForm;
