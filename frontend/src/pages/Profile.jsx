import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getMe, updateMe } from '../services/authService.js';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe().then((response) => { setUser(response.user); setName(response.user.name); }).catch((requestError) => setError(requestError.message));
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true); setError(''); setNotice('');
    try {
      const response = await updateMe({ name });
      setUser(response.user);
      localStorage.setItem('globetrotter_user', JSON.stringify(response.user));
      setName(response.user.name);
      setNotice('Profile updated.');
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }

  function logout() {
    localStorage.removeItem('globetrotter_user');
    localStorage.removeItem('globetrotter_token');
    navigate('/login');
  }

  return <div className="app-shell"><Navbar /><main style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}><h1>Profile</h1>{error && <p role="alert">{error}</p>}{!user && !error ? <p role="status">Loading profile...</p> : user && <><p>Email: {user.email}</p><form onSubmit={save}><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required /><button disabled={saving} type="submit">{saving ? 'Saving...' : 'Save name'}</button></form>{notice && <p role="status">{notice}</p>}<button type="button" onClick={logout}>Log out</button></>}</main></div>;
}
