import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CarbonTransactionForm from './CarbonTransactionForm';
import EnvironmentalDashboard from './EnvironmentalDashboard';
import SubTabBar from '../components/SubTabBar';

const tabs = [
  { label: 'Carbon Transactions', path: '/environmental/carbon-transactions' },
  { label: 'Emission Factors', path: '/environmental/emission-factors' },
  { label: 'Product ESG Profiles', path: '/environmental/product-esg-profiles' },
  { label: 'Environmental Goals', path: '/environmental/environmental-goals' },
];

const PlaceholderTable = ({ title, columns, rows }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">Sample data aligned to the shell wireframe.</p>
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-800/80">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-left font-medium">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${index}`} className="border-t border-slate-800">
              {columns.map((column) => (
                <td key={`${title}-${index}-${column}`} className="px-4 py-3">{row[column] ?? row[column.toLowerCase()] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EnvironmentalTransactionsPage = () => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
      Live carbon transaction capture and environmental trend visibility.
    </div>
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <EnvironmentalDashboard />
    </div>
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <CarbonTransactionForm />
    </div>
  </div>
);

const EmissionFactorsPage = () => (
  <PlaceholderTable
    title="Emission Factors"
    columns={['Name', 'Category', 'Unit', 'Factor']}
    rows={[
      { Name: 'Electricity', Category: 'Energy', Unit: 'kg CO2e/kWh', Factor: '0.42' },
      { Name: 'Fuel', Category: 'Transport', Unit: 'kg CO2e/L', Factor: '2.31' },
    ]}
  />
);

const ProductEsgProfilesPage = () => (
  <PlaceholderTable
    title="Product ESG Profiles"
    columns={['Product', 'Category', 'ESG Score', 'Carbon Footprint']}
    rows={[
      { Product: 'Eco Bottle', Category: 'Packaging', 'ESG Score': '92', 'Carbon Footprint': '1.4 kg CO2e' },
      { Product: 'Solar Panel', Category: 'Energy', 'ESG Score': '88', 'Carbon Footprint': '3.1 kg CO2e' },
    ]}
  />
);

const EnvironmentalGoalsPage = () => (
  <PlaceholderTable
    title="Environmental Goals"
    columns={['Name', 'Department', 'Target CO2', 'Current CO2', 'Progress', 'Deadline', 'Status']}
    rows={[
      { Name: 'Reduce Scope 1', Department: 'Operations', 'Target CO2': '180 t', 'Current CO2': '210 t', Progress: '70%', Deadline: '2026-09-30', Status: 'On Track' },
      { Name: 'Fleet Efficiency', Department: 'Supply Chain', 'Target CO2': '90 t', 'Current CO2': '102 t', Progress: '55%', Deadline: '2026-10-15', Status: 'Needs Attention' },
    ]}
  />
);

const EnvironmentalModule = () => {
  const location = useLocation();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-white">Environmental</h1>
          <p className="mt-1 text-sm text-slate-400">Track carbon, footprint, and sustainability initiatives.</p>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">Green Module</div>
      </div>
      <SubTabBar tabs={tabs} accent="emerald" />
      {location.pathname === '/environmental' ? <Navigate to="/environmental/carbon-transactions" replace /> : null}
      <Routes>
        <Route path="carbon-transactions" element={<EnvironmentalTransactionsPage />} />
        <Route path="emission-factors" element={<EmissionFactorsPage />} />
        <Route path="product-esg-profiles" element={<ProductEsgProfilesPage />} />
        <Route path="environmental-goals" element={<EnvironmentalGoalsPage />} />
      </Routes>
    </div>
  );
};

export default EnvironmentalModule;
