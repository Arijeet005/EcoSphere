import { useEffect, useMemo, useState } from 'react';
import { fetchMetrics } from '../api/metricsApi';
import ChartPanel from '../components/ChartPanel';
import MetricCard from '../components/MetricCard';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetchMetrics();
        setMetrics(response?.data?.data || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const chartData = useMemo(() => {
    const grouped = metrics.reduce((acc, metric) => {
      const key = metric.type?.toLowerCase() || 'other';
      acc[key] = (acc[key] || 0) + Number(metric.value || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [metrics]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">ESG Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Track ESG metrics, compliance, and CSR activity from one place.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard title="Metrics captured" value={metrics.length} unit="records" subtitle="Mock-backed for hackathon demos" />
        <MetricCard title="Environmental" value={metrics.filter((item) => item.type === 'ENVIRONMENTAL').length} unit="entries" subtitle="Energy and emissions" />
        <MetricCard title="Governance" value={metrics.filter((item) => item.type === 'GOVERNANCE').length} unit="entries" subtitle="Policy and controls" />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">Loading metrics…</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
      ) : metrics.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">No metrics yet. Add your first ESG metric to populate the dashboard.</div>
      ) : (
        <div className="space-y-6">
          <ChartPanel data={chartData} />
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Value</th>
                  <th className="px-4 py-3 text-left font-medium">Unit</th>
                  <th className="px-4 py-3 text-left font-medium">Submitted by</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{metric.name}</td>
                    <td className="px-4 py-3">{metric.type}</td>
                    <td className="px-4 py-3">{metric.value}</td>
                    <td className="px-4 py-3">{metric.unit}</td>
                    <td className="px-4 py-3">{metric.submittedBy?.name || 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
