import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchActivityFeed, fetchDepartmentRankings, fetchEmissionsTrend, fetchOverallScores } from '../api/metricsApi';

const scoreTiles = [
  { key: 'environmentalScore', label: 'Environmental Score', border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' },
  { key: 'socialScore', label: 'Social Score', border: 'border-violet-500/40 bg-violet-500/10 text-violet-200' },
  { key: 'governanceScore', label: 'Governance Score', border: 'border-sky-500/40 bg-sky-500/10 text-sky-200' },
  { key: 'overallScore', label: 'Overall ESG Score', border: 'border-amber-500/40 bg-amber-500/10 text-amber-200' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [scoresResponse, trendResponse, rankingsResponse, activitiesResponse] = await Promise.all([
          fetchOverallScores(),
          fetchEmissionsTrend(),
          fetchDepartmentRankings(),
          fetchActivityFeed(),
        ]);

        setScores(scoresResponse?.data?.data || null);
        setTrendData(trendResponse?.data?.data || []);
        setRankingData(rankingsResponse?.data?.data || []);
        setActivities(activitiesResponse?.data?.data || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const rankingChartData = useMemo(() => rankingData.map((item) => ({ name: item.name, score: item.score })), [rankingData]);

  const renderSectionState = (isLoading, isEmpty, emptyMessage, content) => {
    if (isLoading) {
      return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">Loading…</div>;
    }

    if (isEmpty) {
      return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">{emptyMessage}</div>;
    }

    return content;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Executive Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Monitor ESG performance, carbon impact, and team engagement at a glance.</p>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">Live Overview</div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scoreTiles.map((tile) => {
          const value = scores?.[tile.key] ?? null;
          return (
            <div key={tile.label} className={`rounded-2xl border p-5 shadow-lg shadow-slate-950/20 ${tile.border}`}>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">{tile.label}</p>
              {loading ? (
                <div className="mt-4 h-12 w-24 animate-pulse rounded-lg bg-slate-900/70" />
              ) : value == null ? (
                <p className="mt-4 text-sm text-slate-400">No score available</p>
              ) : (
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold">{value}</span>
                  <span className="text-lg text-slate-300">/ 100</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Emissions Trend</h2>
              <p className="mt-1 text-sm text-slate-400">Rolling 12-month emissions snapshot</p>
            </div>
          </div>
          {renderSectionState(
            loading,
            trendData.length === 0,
            'No emissions trend data available yet.',
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="emissions" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>,
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-400">Jump into operations and reporting workflows.</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => navigate('/environmental/carbon-transactions')} className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-left text-emerald-200 transition hover:bg-emerald-500/20">
              <span className="font-medium">+ Log Carbon Data</span>
              <span>→</span>
            </button>
            <button onClick={() => navigate('/gamification/challenges')} className="flex w-full items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-amber-200 transition hover:bg-amber-500/20">
              <span className="font-medium">Start Challenge</span>
              <span>→</span>
            </button>
            <button onClick={() => navigate('/reports/summary')} className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-left text-slate-200 transition hover:bg-slate-700">
              <span className="font-medium">View Reports</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Department ESG Ranking</h2>
            <p className="mt-1 text-sm text-slate-400">Compare departments by their latest ESG score</p>
          </div>
          {renderSectionState(
            loading,
            rankingChartData.length === 0,
            'No department rankings available yet.',
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingChartData}>
                  <CartesianGrid stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#818cf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>,
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-400">Latest sustainability and governance milestones</p>
          </div>
          {renderSectionState(
            loading,
            activities.length === 0,
            'No recent activity yet.',
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{activity.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{activity.category}</p>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>,
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
