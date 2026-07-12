import { useEffect, useMemo, useState } from 'react';
import { fetchCarbonSummary, fetchCarbonTransactions } from '../api/metricsApi';
import ChartPanel from '../components/ChartPanel';
import MetricCard from '../components/MetricCard';

const EnvironmentalDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [transactionsResponse, summaryResponse] = await Promise.all([fetchCarbonTransactions(), fetchCarbonSummary(1)]);
        setTransactions(transactionsResponse?.data?.data || []);
        setSummary(summaryResponse?.data?.data || null);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load environmental dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartData = useMemo(() => {
    if (!summary?.trend?.length) return [];
    return summary.trend.map((item) => ({ name: item.date, value: Number(item.emissions.toFixed(1)) }));
  }, [summary]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Environmental Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Track carbon emissions by department and monitor environmental impact trends.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard title="Transactions logged" value={transactions.length} unit="records" subtitle="Carbon entries captured" />
        <MetricCard title="Total emissions" value={summary ? summary.totalEmissions.toFixed(1) : '0.0'} unit="kg CO2e" subtitle="Across tracked activities" />
        <MetricCard title="Active departments" value={new Set(transactions.map((transaction) => transaction.departmentId)).size} unit="teams" subtitle="Visible in the platform" />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">Loading environmental data…</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">No carbon transactions yet. Add your first entry to populate the dashboard.</div>
      ) : (
        <div className="space-y-6">
          <ChartPanel data={chartData} />
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Department</th>
                  <th className="px-4 py-3 text-left font-medium">Emission factor</th>
                  <th className="px-4 py-3 text-left font-medium">Quantity</th>
                  <th className="px-4 py-3 text-left font-medium">Emissions</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{transaction.department?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{transaction.emissionFactor?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{transaction.quantity}</td>
                    <td className="px-4 py-3">{(transaction.quantity * (transaction.emissionFactor?.factor || 0)).toFixed(1)} kg CO2e</td>
                    <td className="px-4 py-3">{new Date(transaction.createdAt).toLocaleDateString()}</td>
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

export default EnvironmentalDashboard;
