import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = login(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(location.state?.from || '/');
  }

  return (
    <div className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to continue to checkout.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </label>

        <button className="btn btn-primary btn-full" type="submit">Sign in</button>

        <p className="auth-switch">
          New to NEXUS? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
