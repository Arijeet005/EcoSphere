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
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {['Data Privacy Policy', 'Supplier Code of Conduct', 'Anti-Corruption Standard', 'Whistleblower Procedure'].map((policy) => (
        <div key={policy} className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-violet-200">{policy}</div>
      ))}
    </div>
  </div>
);

const PolicyAcknowledgementsPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Policy Acknowledgements</h3>
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-800/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Employee</th>
            <th className="px-4 py-3 text-left font-medium">Policy</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">Priya Shah</td><td className="px-4 py-3">Code of Conduct</td><td className="px-4 py-3 text-emerald-300">Acknowledged</td></tr>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">Leo Chen</td><td className="px-4 py-3">Data Privacy</td><td className="px-4 py-3 text-amber-300">Pending</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const AuditsPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Audits</h3>
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-800/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Department</th>
            <th className="px-4 py-3 text-left font-medium">Auditor</th>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Findings</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">ISO Review</td><td className="px-4 py-3">Operations</td><td className="px-4 py-3">Tara Wells</td><td className="px-4 py-3">2026-06-10</td><td className="px-4 py-3">3 minor observations</td><td className="px-4 py-3 text-amber-300">Planned</td></tr>
          <tr className="border-t border-slate-800"><td className="px-4 py-3">Supplier Risk Check</td><td className="px-4 py-3">Procurement</td><td className="px-4 py-3">Ned Ortiz</td><td className="px-4 py-3">2026-05-24</td><td className="px-4 py-3">1 significant finding</td><td className="px-4 py-3 text-emerald-300">Completed</td></tr>
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
