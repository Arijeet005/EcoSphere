import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ChartPanel = ({ data, type = 'metrics' }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{type === 'metrics' ? 'ESG metrics overview' : 'Overview'}</h3>
      <span className="text-sm text-slate-400">Grouped by ESG type</span>
    </div>

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="value" fill="#34d399" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartPanel;
