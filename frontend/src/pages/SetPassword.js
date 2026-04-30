import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy: #0a1628;
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --cream: #faf9f7;
    --text-primary: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  .sp-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .sp-card {
    background: #fff;
    width: 100%;
    max-width: 420px;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  }

  .sp-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .sp-header p {
    color: var(--text-muted);
    font-size: 15px;
    margin-bottom: 32px;
  }

  .form-group { margin-bottom: 20px; }
  .form-group label {
    display: block; font-size: 13px; font-weight: 600; color: var(--text-primary);
    margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.02em;
  }
  .form-input {
    width: 100%; padding: 13px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: 0.2s;
  }
  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }

  .btn-primary {
    width: 100%; padding: 14px; background: linear-gradient(135deg, var(--teal), var(--teal-light));
    color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: 0.2s; margin-top: 8px;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(13,148,136,0.35); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .alert { padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; }
  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
`;

function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
    else setError('No invitation token found in the URL. Please check your email link.');
  }, []);

  const handleSubmit = async () => {
    if (!password || !confirm) { setError('Please fill all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true); setError('');
    try {
      await API.post('/auth/set-password', { token, password });
      setSuccess('Password created successfully! Redirecting to login...');
      setTimeout(() => window.location.href = '/', 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-card">
          <div className="sp-header">
            <h2>Set Your Password</h2>
            <p>Welcome! Create a secure password for your MediCore account.</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <div className="form-group">
            <label>New Password</label>
            <input 
              className="form-input" type="password" placeholder="Min. 6 characters" 
              value={password} onChange={e => setPassword(e.target.value)} disabled={!token || success} 
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              className="form-input" type="password" placeholder="Repeat your password" 
              value={confirm} onChange={e => setConfirm(e.target.value)} disabled={!token || success} 
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading || !token || success}>
            {loading ? 'Saving...' : 'Set Password'}
          </button>
        </div>
      </div>
    </>
  );
}

export default SetPassword;
