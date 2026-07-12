import { useEffect, useMemo, useState } from 'react';
import { createCarbonTransaction, fetchDepartments, fetchEmissionFactors } from '../api/metricsApi';

const CarbonTransactionForm = () => {
  const [form, setForm] = useState({ departmentId: '', emissionFactorId: '', quantity: '' });
  const [departments, setDepartments] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [departmentsResponse, factorsResponse] = await Promise.all([fetchDepartments(), fetchEmissionFactors()]);
        setDepartments(departmentsResponse?.data?.data || []);
        setEmissionFactors(factorsResponse?.data?.data || []);
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Unable to load carbon options.' });
      }
    };

    loadOptions();
  }, []);

  const selectedFactor = useMemo(
    () => emissionFactors.find((factor) => Number(factor.id) === Number(form.emissionFactorId)) || null,
    [emissionFactors, form.emissionFactorId],
  );

  const validate = () => {
    const nextErrors = {};
    if (!form.departmentId) nextErrors.departmentId = 'Department is required';
    if (!form.emissionFactorId) nextErrors.emissionFactorId = 'Emission factor is required';
    if (!form.quantity) nextErrors.quantity = 'Quantity is required';
    else if (Number.isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) nextErrors.quantity = 'Quantity must be a positive number';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatus({ type: 'idle', message: '' });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await createCarbonTransaction({
        ...form,
        departmentId: Number(form.departmentId),
        emissionFactorId: Number(form.emissionFactorId),
        quantity: Number(form.quantity),
      });
      setStatus({ type: 'success', message: 'Carbon transaction recorded successfully.' });
      setForm({ departmentId: '', emissionFactorId: '', quantity: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to submit carbon transaction.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Record Carbon Transaction</h1>
        <p className="mt-2 text-sm text-slate-400">Capture a department-level emission activity using the standard carbon-tracking schema.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Department</label>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })}>
              <option value="">Select a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
            {errors.departmentId ? <p className="mt-1 text-sm text-rose-400">{errors.departmentId}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Emission factor</label>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.emissionFactorId} onChange={(event) => setForm({ ...form, emissionFactorId: event.target.value })}>
              <option value="">Select an emission factor</option>
              {emissionFactors.map((factor) => (
                <option key={factor.id} value={factor.id}>{factor.name} ({factor.unit})</option>
              ))}
            </select>
            {errors.emissionFactorId ? <p className="mt-1 text-sm text-rose-400">{errors.emissionFactorId}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Quantity</label>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="e.g. 120" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
            {selectedFactor ? <p className="mt-1 text-sm text-slate-400">Factor: {selectedFactor.factor} {selectedFactor.unit}</p> : null}
            {errors.quantity ? <p className="mt-1 text-sm text-rose-400">{errors.quantity}</p> : null}
          </div>

          {status.type === 'success' ? <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{status.message}</p> : null}
          {status.type === 'error' ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{status.message}</p> : null}

          <button className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarbonTransactionForm;
