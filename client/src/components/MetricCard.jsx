const MetricCard = ({ title, value, unit, subtitle }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
    <p className="text-sm text-slate-400">{title}</p>
    <div className="mt-2 flex items-end justify-between">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <span className="text-sm text-emerald-400">{unit}</span>
    </div>
    {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
  </div>
);

export default MetricCard;
