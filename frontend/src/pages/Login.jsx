import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    // Temporary client-side session until the Neon-backed auth API is ready.
    localStorage.setItem('globetrotter_user', JSON.stringify({
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0],
    }));
    setError('');
    navigate('/dashboard');
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <p className="brand-name">GlobeTrotter</p>
        <h1 id="login-heading">Welcome back</h1>
        <p className="auth-subtitle">Plan your next great journey.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit">Log in</button>
        </form>

        <p className="signup-note">Don&apos;t have an account? <span>Sign up coming soon</span></p>
      </section>
    </main>
  );
}
