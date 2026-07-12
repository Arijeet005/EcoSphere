import { Navigate, Route, Routes } from 'react-router-dom';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Summary', path: '/reports/summary' },
  { label: 'Carbon Report', path: '/reports/carbon-report' },
  { label: 'CSR Report', path: '/reports/csr-report' },
  { label: 'Governance Report', path: '/reports/governance-report' },
];

const Placeholder = ({ title, body }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{body}</p>
  </div>
);

const ReportsModule = () => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-400">Exportable oversight views for environmental and governance performance.</p>
      </div>
      <div className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300">Indigo Module</div>
    </div>
    <SubTabBar tabs={tabs} accent="blue" />
    <Routes>
      <Route path="" element={<Navigate to="/reports/summary" replace />} />
      <Route path="summary" element={<Placeholder title="Summary" body="Executive summary report content will appear here." />} />
      <Route path="carbon-report" element={<Placeholder title="Carbon Report" body="Environmental report details will appear here." />} />
      <Route path="csr-report" element={<Placeholder title="CSR Report" body="Social impact report details will appear here." />} />
      <Route path="governance-report" element={<Placeholder title="Governance Report" body="Governance report details will appear here." />} />
    </Routes>
  </div>
);

export default ReportsModule;
