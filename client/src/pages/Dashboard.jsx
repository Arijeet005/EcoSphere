import { useEffect, useMemo, useState } from 'react';
import { fetchMetrics } from '../api/metricsApi';
import ChartPanel from '../components/ChartPanel';
import MetricCard from '../components/MetricCard';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetchMetrics();
        setMetrics(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadMetrics();
  }, []);

  const chartData = useMemo(() => metrics.map((metric) => ({ name: metric.name, value: metric.value })), [metrics]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">ESG Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Track metrics, compliance, and CSR activities from one place.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard title="Metrics captured" value={metrics.length} unit="records" subtitle="Stored in PostgreSQL via Prisma" />
        <MetricCard title="Environmental" value={metrics.filter((item) => item.type === 'ENVIRONMENTAL').length} unit="entries" subtitle="Carbon and resource metrics" />
        <MetricCard title="Governance" value={metrics.filter((item) => item.type === 'GOVERNANCE').length} unit="entries" subtitle="Policy and controls" />
      </div>

      <ChartPanel data={chartData} />
    </div>
  );
};

export default Dashboard;
