import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Environmental', path: '/reports/environmental' },
  { label: 'Social', path: '/reports/social' },
  { label: 'Governance', path: '/reports/governance' },
  { label: 'ESG Summary', path: '/reports/esg-summary' },
  { label: 'Custom Builder', path: '/reports/custom-builder' },
];

const reportCards = [
  { icon: '🌿', title: 'Carbon Footprint', description: 'Export emissions and reduction trends across departments.', accent: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' },
  { icon: '🤝', title: 'CSR Impact', description: 'Share community outcomes and volunteer engagement summaries.', accent: 'border-sky-500/30 bg-sky-500/10 text-sky-200' },
  { icon: '🛡️', title: 'Governance Snapshot', description: 'Surface compliance readiness and policy adherence metrics.', accent: 'border-violet-500/30 bg-violet-500/10 text-violet-200' },
  { icon: '📊', title: 'Executive Brief', description: 'Package an executive-ready ESG overview for leadership reviews.', accent: 'border-amber-500/30 bg-amber-500/10 text-amber-200' },
];

const filterOptions = [
  { label: 'Date Range', options: ['Last 30 days', 'Last 90 days', 'Custom range'] },
  { label: 'Department', options: ['Operations', 'Supply Chain', 'HR'] },
  { label: 'Module', options: ['Environmental', 'Social', 'Governance'] },
  { label: 'Employee', options: ['Ava Manager', 'Leo Employee', 'Priya Shah'] },
  { label: 'Challenge', options: ['Zero Waste Week', 'Green Commute Sprint'] },
  { label: 'ESG Category', options: ['Carbon', 'Community', 'Policy'] },
];

const ReportCard = ({ card, onGenerate }) => (
  <div className={`rounded-2xl border p-5 shadow-lg shadow-slate-950/20 ${card.accent}`}>
    <div className="text-3xl">{card.icon}</div>
    <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
    <p className="mt-2 text-sm text-slate-300">{card.description}</p>
    <button onClick={() => onGenerate(card.title)} className="mt-5 rounded-full border border-white/20 bg-slate-950/60 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-900">
      Generate
    </button>
  </div>
);

const Toast = ({ message }) => (
  <div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-amber-500/30 bg-slate-900/95 px-4 py-3 text-sm text-amber-200 shadow-xl shadow-slate-950/30">
    {message}
  </div>
);

const SummaryPage = () => {
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleGenerate = (title) => setToast(`${title} export is coming soon.`);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-xl font-semibold text-white">ESG reporting overview</h3>
        <p className="mt-2 text-sm text-slate-400">Launch exports for the most requested reporting bundles without leaving the workspace.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((card) => (
          <ReportCard key={card.title} card={card} onGenerate={handleGenerate} />
        ))}
      </div>
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
};

const ModulePage = ({ title, body, accent }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
    <div className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${accent}`}>{title}</div>
    <p className="mt-4 text-sm leading-6 text-slate-400">{body}</p>
  </div>
);

const CustomBuilderPage = () => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Custom report builder</h3>
          <p className="mt-2 text-sm text-slate-400">Create an on-demand view across departments, challenges, and ESG categories.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200">Run Report</button>
          <button className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200">Export PDF</button>
          <button className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-200">Export Excel</button>
          <button className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200">Export CSV</button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filterOptions.map((filter) => (
          <label key={filter.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            <span className="mb-2 block font-medium text-slate-100">{filter.label}</span>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
              {filter.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const ReportsModule = () => (
  <div>
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-400">Exportable oversight views for environmental, social, and governance performance.</p>
      </div>
      <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">Indigo Module</div>
    </div>
    <SubTabBar tabs={tabs} accent="blue" />
    <Routes>
      <Route path="" element={<Navigate to="/reports/esg-summary" replace />} />
      <Route path="environmental" element={<ModulePage title="Environmental" body="Track emissions, reductions, and operational hotspots with tailored export views for sustainability teams." accent="border-emerald-500/30 bg-emerald-500/10 text-emerald-200" />} />
      <Route path="social" element={<ModulePage title="Social" body="Summarize volunteer participation, employee engagement, and community impact metrics for leadership reporting." accent="border-sky-500/30 bg-sky-500/10 text-sky-200" />} />
      <Route path="governance" element={<ModulePage title="Governance" body="Highlight policy attestations, audit health, and compliance follow-up progress in a concise format." accent="border-violet-500/30 bg-violet-500/10 text-violet-200" />} />
      <Route path="esg-summary" element={<SummaryPage />} />
      <Route path="custom-builder" element={<CustomBuilderPage />} />
    </Routes>
  </div>
);

export default ReportsModule;
