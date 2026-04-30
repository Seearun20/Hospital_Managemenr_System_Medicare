import React, { useState } from 'react';
import API from '../api/axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy: #0a1628;
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --gold: #f59e0b;
    --cream: #faf9f7;
    --text-primary: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
  }

  .signup-left {
    width: 45%;
    background: var(--navy);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 48px;
    position: relative;
    overflow: hidden;
  }

  .signup-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%);
  }

  .signup-left::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%);
  }

  .brand-logo {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--teal), var(--teal-light));
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(13,148,136,0.4);
    font-size: 28px;
    position: relative; z-index: 1;
  }

  .brand-title {
    font-family: 'Playfair Display', serif;
    color: #fff;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    position: relative; z-index: 1;
    margin-bottom: 16px;
  }

  .brand-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    text-align: center;
    line-height: 1.6;
    position: relative; z-index: 1;
    max-width: 280px;
  }

  .steps-list {
    list-style: none;
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative; z-index: 1;
    width: 100%;
    max-width: 280px;
  }

  .steps-list li {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(13,148,136,0.25);
    border: 1px solid rgba(13,148,136,0.5);
    color: var(--teal-light);
    font-size: 13px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .step-text {
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    line-height: 1.5;
    padding-top: 4px;
  }

  .signup-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
  }

  .signup-card {
    width: 100%;
    max-width: 460px;
  }

  .signup-header {
    margin-bottom: 40px;
  }

  .signup-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .signup-header p {
    color: var(--text-muted);
    font-size: 15px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .input-wrapper { position: relative; }

  .input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 15px;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text-primary);
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
  }

  .form-input::placeholder { color: #94a3b8; }

  .form-select {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--text-primary);
    background: #fff;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .form-select:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
  }

  .password-strength {
    margin-top: 8px;
  }

  .strength-bar {
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
  }

  .strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s, background 0.3s;
  }

  .strength-label {
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--teal), var(--teal-light));
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    margin-top: 8px;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(13,148,136,0.35);
  }

  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .signup-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: var(--text-muted);
  }

  .signup-footer a {
    color: var(--teal);
    font-weight: 600;
    text-decoration: none;
  }

  .signup-footer a:hover { text-decoration: underline; }

  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block; vertical-align: middle; margin-right: 8px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .signup-left { display: none; }
    .signup-right { padding: 40px 24px; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#22c55e' },
    { label: 'Strong', color: '#10b981' },
  ];
  return { score, ...map[score] };
}

function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'admin', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const strength = getStrength(form.password);

  const handleSignup = async () => {
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return; }

    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try {
      await API.post('/auth/signup', { email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, role: form.role });
      setSuccess('OTP sent! Please check your email to verify.');
      setStep(2);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) { setError('Please enter the OTP.'); return; }
    setError(''); setLoading(true);
    try {
      await API.post('/auth/verify-signup', { email: form.email, otp });
      setSuccess('Account verified successfully! Redirecting to login...');
      setTimeout(() => window.location.href = '/', 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="signup-left">
          <div className="brand-logo">🏥</div>
          <div className="brand-title">Join<br/>MediCore</div>
          <p className="brand-subtitle">Start managing your hospital efficiently in minutes</p>
          <ol className="steps-list">
            <li><span className="step-num">1</span><span className="step-text">Create your admin account</span></li>
            <li><span className="step-num">2</span><span className="step-num" style={{display:'none'}}></span><span className="step-text">Add your doctors and staff</span></li>
            <li><span className="step-num">3</span><span className="step-text">Register patients and begin scheduling</span></li>
          </ol>
        </div>

        <div className="signup-right">
          <div className="signup-card">
            <div className="signup-header">
              <h2>Create account</h2>
              <p>Set up your hospital management system</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {step === 1 ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input className="form-input" placeholder="John" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input className="form-input" placeholder="Smith" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input className="form-input" type="email" placeholder="admin@hospital.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏷</span>
                    <select className="form-select" value={form.role} onChange={e => update('role', e.target.value)}>
                      <option value="admin">Administrator</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="billing">Billing Staff</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input className="form-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingRight: '44px' }} />
                    <button onClick={() => setShowPw(s => !s)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'16px' }}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {form.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div className="strength-fill" style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}></div>
                      </div>
                      <p className="strength-label" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input className="form-input" type="password" placeholder="Repeat your password" value={form.confirm} onChange={e => update('confirm', e.target.value)} style={{ borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : '' }} />
                  </div>
                </div>

                <button className="btn-primary" onClick={handleSignup} disabled={loading}>
                  {loading ? <><span className="spinner"></span>Creating account…</> : 'Create Account'}
                </button>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Verification Code (OTP)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input className="form-input" type="text" placeholder="Enter 6-digit code" value={otp} onChange={e => setOtp(e.target.value)} style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Sent to <strong>{form.email}</strong>
                  </p>
                </div>
                <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? <><span className="spinner"></span>Verifying...</> : 'Verify Email & Complete Signup'}
                </button>
              </>
            )}

            <div className="signup-footer">
              Already have an account? <a href="/">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;