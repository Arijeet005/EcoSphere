import { useState } from 'react';
import { createMetric } from '../api/metricsApi';

const MetricsForm = () => {
  const [form, setForm] = useState({ type: 'ENVIRONMENTAL', name: '', value: '', unit: '', departmentId: '1' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createMetric(form);
      alert('Metric created');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold text-white">Add ESG Metric</h1>
        <p className="mt-2 text-sm text-slate-400">Create new metric records for the dashboard.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="ENVIRONMENTAL">Environmental</option>
            <option value="SOCIAL">Social</option>
            <option value="GOVERNANCE">Governance</option>
          </select>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Metric name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Department ID" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} />
          <button className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default MetricsForm;
