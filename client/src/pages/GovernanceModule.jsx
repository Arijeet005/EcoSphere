import { Navigate, Route, Routes } from 'react-router-dom';
import Compliance from './Compliance';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Policies', path: '/governance/policies' },
  { label: 'Policy Acknowledgements', path: '/governance/policy-acknowledgements' },
  { label: 'Audits', path: '/governance/audits' },
  { label: 'Compliance Issues', path: '/governance/compliance-issues' },
];

const PoliciesPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Policies</h3>
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">Data Privacy Policy</div>
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">Supplier Code of Conduct</div>
    </div>
  </div>
);

const PolicyAcknowledgementsPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Policy Acknowledgements</h3>
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Acknowledgement status is tracked here.</div>
  </div>
);

const AuditsPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Audits</h3>
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-800/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Audit</th>
            <th className="px-4 py-3 text-left font-medium">Scope</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">ISO Review</td><td className="px-4 py-3">Operations</td><td className="px-4 py-3">Planned</td></tr>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">Supplier Risk Check</td><td className="px-4 py-3">Procurement</td><td className="px-4 py-3">Completed</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const GovernanceModule = () => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-white">Governance</h1>
        <p className="mt-1 text-sm text-slate-400">Monitor policies, audits, and compliance obligations.</p>
      </div>
      <div className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">Purple Module</div>
    </div>
    <SubTabBar tabs={tabs} accent="purple" />
    <Routes>
      <Route path="" element={<Navigate to="/governance/compliance-issues" replace />} />
      <Route path="policies" element={<PoliciesPage />} />
      <Route path="policy-acknowledgements" element={<PolicyAcknowledgementsPage />} />
      <Route path="audits" element={<AuditsPage />} />
      <Route path="compliance-issues" element={<Compliance />} />
    </Routes>
  </div>
);

export default GovernanceModule;
