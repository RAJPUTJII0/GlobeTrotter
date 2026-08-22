import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError('Please complete all fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('globetrotter_accounts') || '[]');
    if (accounts.some((account) => account.email === email)) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    const user = { id: crypto.randomUUID(), name, email };
    // Demo-only storage. Passwords will never be stored in the browser once Neon auth is connected.
    localStorage.setItem('globetrotter_accounts', JSON.stringify([...accounts, user]));
    localStorage.setItem('globetrotter_user', JSON.stringify(user));
    navigate('/dashboard');
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-heading">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <p className="brand-name">GlobeTrotter</p>
        <h1 id="signup-heading">Create your account</h1>
        <p className="auth-subtitle">Your next adventure starts here.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={updateField} />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={updateField} />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={updateField} />
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter password" value={form.confirmPassword} onChange={updateField} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit">Create account</button>
        </form>
        <p className="signup-note">Already have an account? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
