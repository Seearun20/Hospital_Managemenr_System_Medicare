import React, { useState } from 'react';
import API from '../api/axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy: #0a1628;
    --navy-mid: #112240;
    --teal: #0d9488;
    --teal-light: #14b8a6;
    --gold: #f59e0b;
    --cream: #faf9f7;
    --text-primary: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --error: #ef4444;
    --success: #10b981;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
  }

  .login-left {
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

  .login-left::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%);
  }

  .login-left::after {
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

  .feature-list {
    list-style: none;
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative; z-index: 1;
    width: 100%;
    max-width: 280px;
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.75);
    font-size: 14px;
  }

  .feature-list li span.dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--teal-light);
    flex-shrink: 0;
  }

  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
  }

  .login-header {
    margin-bottom: 40px;
  }

  .login-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .login-header p {
    color: var(--text-muted);
    font-size: 15px;
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

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 16px;
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
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(13,148,136,0.35);
  }

  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .login-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: var(--text-muted);
  }

  .login-footer a {
    color: var(--teal);
    font-weight: 600;
    text-decoration: none;
  }

  .login-footer a:hover { text-decoration: underline; }

  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
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
    .login-left { display: none; }
    .login-right { padding: 40px 24px; }
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('password');
  const [otpStep, setOtpStep] = useState(1);

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }

    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }

    setError(''); setLoading(true);
    try {
      await API.post('/auth/request-otp', { email });
      setOtpStep(2);
      setSuccess('OTP sent to your email! (Check backend console for link)');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) { setError('Please enter the OTP.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await API.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { 
    if (e.key === 'Enter') {
      if (loginMode === 'password') handleLogin();
      else if (otpStep === 1) handleRequestOtp();
      else handleVerifyOtp();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-left">
          <div className="brand-logo">🏥</div>
          <div className="brand-title">MediCore<br/>HMS</div>
          <p className="brand-subtitle">Streamlined hospital management for modern healthcare teams</p>
          <ul className="feature-list">
            <li><span className="dot"></span>Patient & Doctor Management</li>
            <li><span className="dot"></span>Smart Appointment Scheduling</li>
            <li><span className="dot"></span>Automated Billing & Reports</li>
            <li><span className="dot"></span>Secure Role-Based Access</li>
          </ul>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Sign in to your MediCore account</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {loginMode === 'password' ? (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      onClick={() => setShowPassword(s => !s)}
                      style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'16px' }}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <button className="btn-primary" onClick={handleLogin} disabled={loading}>
                  {loading ? <><span className="spinner"></span>Signing in...</> : 'Sign In'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => { setLoginMode('otp'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Log in with OTP instead</button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={otpStep === 2}
                    />
                  </div>
                </div>

                {otpStep === 2 && (
                  <div className="form-group">
                    <label>Verification Code (OTP)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔑</span>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
                      />
                    </div>
                  </div>
                )}

                {otpStep === 1 ? (
                  <button className="btn-primary" onClick={handleRequestOtp} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Sending...</> : 'Send OTP'}
                  </button>
                ) : (
                  <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Verifying...</> : 'Verify & Login'}
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => { setLoginMode('password'); setOtpStep(1); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}>Back to Password Login</button>
                </div>
              </>
            )}

            <div className="login-footer">
              Don't have an account? <a href="/signup">Create one</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;