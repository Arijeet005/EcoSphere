import { Navigate, Route, Routes } from 'react-router-dom';
import CsrActivities from './CsrActivities';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'CSR Activities', path: '/social/csr-activities' },
  { label: 'Employee Participation', path: '/social/employee-participation' },
  { label: 'Diversity Dashboard', path: '/social/diversity-dashboard' },
];

const EmployeeParticipationPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Employee Participation</h3>
    <p className="mt-2 text-sm text-slate-400">Manager approval queue and participation tracking live here.</p>
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">This content is routed from the existing CSR approval workflow.</div>
  </div>
);

const DiversityDashboardPage = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">Diversity Dashboard</h3>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4 text-sky-200">78% participation</div>
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-violet-200">92% training completion</div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">24 inclusive events</div>
    </div>
  </div>
);

const SocialModule = () => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold text-white">Social</h1>
        <p className="mt-1 text-sm text-slate-400">Coordinate community programs, participation, and diversity insights.</p>
      </div>
      <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300">Blue Module</div>
    </div>
    <SubTabBar tabs={tabs} accent="blue" />
    <Routes>
      <Route path="" element={<Navigate to="/social/csr-activities" replace />} />
      <Route path="csr-activities" element={<CsrActivities />} />
      <Route path="employee-participation" element={<EmployeeParticipationPage />} />
      <Route path="diversity-dashboard" element={<DiversityDashboardPage />} />
    </Routes>
  </div>
);

export default SocialModule;
