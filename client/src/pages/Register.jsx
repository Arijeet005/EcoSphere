import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = useMemo(() => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email';
    if (!form.password.trim()) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    return nextErrors;
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(validate);
    setSubmitError('');

    if (Object.keys(validate).length > 0) {
      return;
    }

    try {
      const response = await registerRequest(form);
      const userData = response?.data?.user || { ...form, role: form.role || 'EMPLOYEE' };
      login(userData, response?.data?.token || 'mock-token');
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Unable to create your account right now.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Join the ESG workspace and start collaborating.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            {errors.name ? <p className="mt-1 text-sm text-rose-400">{errors.name}</p> : null}
          </div>

          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            {errors.email ? <p className="mt-1 text-sm text-rose-400">{errors.email}</p> : null}
          </div>

          <div>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {errors.password ? <p className="mt-1 text-sm text-rose-400">{errors.password}</p> : null}
          </div>

          <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>

          {submitError ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{submitError}</p> : null}

          <button className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400">Register</button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account? <Link className="text-emerald-400" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
