import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getUserFromToken } from '../utils/auth';

const SPECIALIZATIONS = [
  'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Gynecology', 'Dermatology', 'ENT', 'Ophthalmology',
  'Psychiatry', 'Radiology', 'Anesthesiology', 'Oncology', 'Urology',
  'Gastroenterology', 'Nephrology', 'Pulmonology', 'Endocrinology', 'Rheumatology'
];

const SPEC_COLORS = {
  'General Medicine': { bg: '#eff6ff', color: '#2563eb' },
  'Cardiology': { bg: '#fff1f2', color: '#e11d48' },
  'Neurology': { bg: '#fdf4ff', color: '#9333ea' },
  'Orthopedics': { bg: '#fff7ed', color: '#c2410c' },
  'Pediatrics': { bg: '#f0fdf4', color: '#16a34a' },
  'Gynecology': { bg: '#fdf2f8', color: '#db2777' },
  'Dermatology': { bg: '#fefce8', color: '#ca8a04' },
  'ENT': { bg: '#f0f9ff', color: '#0284c7' },
  'Ophthalmology': { bg: '#ecfdf5', color: '#059669' },
  'Psychiatry': { bg: '#f8f7ff', color: '#7c3aed' },
};

const getSpecColor = s => SPEC_COLORS[s] || { bg: '#f1f5f9', color: '#475569' };
const getInitials = name => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const AVATAR_COLORS = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#6366f1'];

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
    --sidebar-w: 260px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); }
  .layout { display: flex; min-height: 100vh; }

  .sidebar { width: var(--sidebar-w); background: var(--navy); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
  .sidebar-logo { padding: 28px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--teal), var(--teal-light)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 16px rgba(13,148,136,0.4); }
  .logo-text { font-family: 'Playfair Display', serif; color: #fff; font-size: 18px; font-weight: 700; }
  .logo-sub { color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
  .sidebar-nav { flex: 1; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; }
  .nav-section-label { color: rgba(255,255,255,0.3); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 12px 4px; margin-top: 8px; }
  .nav-link { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
  .nav-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .nav-link.active { background: rgba(13,148,136,0.2); color: var(--teal-light); border: 1px solid rgba(13,148,136,0.3); }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.07); }
  .user-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.05); }
  .user-avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--teal), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; }
  .user-name { color: #fff; font-size: 13px; font-weight: 600; }
  .user-role { color: rgba(255,255,255,0.4); font-size: 11px; }
  .logout-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); cursor: pointer; color: #ef4444; font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px; transition: all 0.2s; margin-left: auto; display: flex; align-items: center; gap: 6px; }
  .logout-btn:hover { background: #ef4444; color: #fff; }

  .main-content { margin-left: var(--sidebar-w); flex: 1; }
  .topbar { background: #fff; border-bottom: 1px solid var(--border); padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--text-primary); }
  .page-content { padding: 32px; }

  .form-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  .form-card-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); margin-bottom: 4px; }
  .form-card-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; align-items: end; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-primary); letter-spacing: 0.04em; text-transform: uppercase; }
  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; pointer-events: none; }
  .form-input { width: 100%; padding: 11px 12px 11px 38px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--cream); transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
  .form-input::placeholder { color: #94a3b8; }
  .form-select { width: 100%; padding: 11px 12px 11px 38px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--cream); appearance: none; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }

  .btn-primary { padding: 11px 24px; background: linear-gradient(135deg, var(--teal), var(--teal-light)); color: #fff; border: none; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: transform 0.15s, box-shadow 0.15s; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(13,148,136,0.3); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-danger { padding: 6px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .btn-danger:hover { background: #fee2e2; }
  .btn-edit { padding: 6px 14px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; margin-right: 6px; }
  .btn-edit:hover { background: #dbeafe; }
  .btn-cancel { padding: 10px 20px; background: var(--cream); color: var(--text-muted); border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }

  /* TOGGLE VIEWS */
  .view-toggle { display: flex; gap: 4px; background: var(--cream); border: 1px solid var(--border); border-radius: 9px; padding: 4px; }
  .view-btn { padding: 6px 14px; border: none; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; color: var(--text-muted); transition: background 0.15s, color 0.15s; }
  .view-btn.active { background: #fff; color: var(--text-primary); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  /* DOCTOR CARDS GRID */
  .doctors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }

  .doctor-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; transition: box-shadow 0.2s, transform 0.2s; }
  .doctor-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .doctor-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .doctor-header { display: flex; align-items: center; gap: 14px; }
  .doctor-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .doctor-id { font-size: 11px; color: var(--text-muted); font-family: monospace; }
  .spec-badge { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .doctor-meta { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
  .doctor-actions { display: flex; gap: 8px; margin-top: auto; }

  /* TABLE */
  .table-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .table-toolbar { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 12px; }
  .table-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); }
  .toolbar-right { display: flex; align-items: center; gap: 12px; }
  .search-wrapper { position: relative; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; }
  .search-input { padding: 9px 14px 9px 36px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--cream); outline: none; width: 220px; transition: border-color 0.2s; }
  .search-input:focus { border-color: var(--teal); background: #fff; }
  .search-input::placeholder { color: #94a3b8; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--cream); }
  th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  td { padding: 14px 20px; font-size: 14px; color: var(--text-primary); border-top: 1px solid var(--border); vertical-align: middle; }
  tr:hover td { background: #f8fafc; }

  .empty-state { text-align: center; padding: 56px 24px; color: var(--text-muted); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .alert { padding: 10px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: #fff; border-radius: 16px; padding: 32px; width: 90%; max-width: 440px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 20px; color: var(--text-primary); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
`;

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', section: 'Overview' },
  { to: '/patients', icon: '👥', label: 'Patients', section: 'Management' },
  { to: '/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/appointments', icon: '📅', label: 'Appointments' },
  { to: '/billing', icon: '💳', label: 'Billing' },
];

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: '', specialization: 'General Medicine', phone: '', email: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);

  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;
  const user = getUserFromToken() || { role: 'admin', fullName: 'Admin User' };

  const allowedNavItems = NAV_ITEMS.filter(item => {
    if (user.role === 'admin') return true;
    if (user.role === 'doctor') return ['/dashboard', '/patients', '/appointments'].includes(item.to);
    if (user.role === 'receptionist') return ['/dashboard', '/patients', '/doctors', '/appointments', '/billing'].includes(item.to);
    if (user.role === 'billing') return ['/dashboard', '/patients', '/billing'].includes(item.to);
    return false;
  });

  const fetchDoctors = async () => {
    setFetching(true);
    try {
      const res = await API.get('/doctors/', { headers: { Authorization: token } });
      setDoctors(res.data);
    } catch { setError('Failed to load doctors.'); }
    finally { setFetching(false); }
  };

  const addDoctor = async () => {
    if (!form.name || !form.specialization || !form.email) { setError('Name, specialization, and email are required.'); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return; }

    const phoneRegex = /^\d{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) { setError('Phone number must be exactly 10 digits.'); return; }

    setLoading(true); setError('');
    try {
      // 1. Send invite via auth service
      const names = form.name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || '';
      await API.post('/auth/invite', { email: form.email, firstName, lastName, role: 'doctor' });

      // 2. Create doctor profile
      await API.post('/doctors/', form, { headers: { Authorization: token } });
      
      setForm({ name: '', specialization: 'General Medicine', phone: '', email: '', experience: '' });
      setSuccess('Doctor profile created! An invitation email has been sent.');
      setTimeout(() => setSuccess(''), 3000);
      fetchDoctors();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add doctor. Email might already exist.'); }
    finally { setLoading(false); }
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      await API.put(`/doctors/${editDoc._id || editDoc.id}`, editDoc, { headers: { Authorization: token } });
      setEditDoc(null); setSuccess('Doctor updated!'); setTimeout(() => setSuccess(''), 3000); fetchDoctors();
    } catch { setError('Failed to update doctor.'); }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/doctors/${deleteDoc._id || deleteDoc.id}`, { headers: { Authorization: token } });
      setDeleteDoc(null); setSuccess('Doctor removed.'); setTimeout(() => setSuccess(''), 3000); fetchDoctors();
    } catch { setError('Failed to delete doctor.'); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🏥</div>
            <div><div className="logo-text">MediCore</div><div className="logo-sub">HMS</div></div>
          </div>
          <nav className="sidebar-nav">
            {allowedNavItems.map((item) => (
              <React.Fragment key={item.to}>
                {item.section && <div className="nav-section-label">{item.section}</div>}
                <Link to={item.to} className={`nav-link${currentPath === item.to ? ' active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>{item.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar-sm">{user.fullName.charAt(0).toUpperCase()}</div>
              <div><div className="user-name">{user.fullName}</div><div className="user-role" style={{ textTransform: 'capitalize' }}>{user.role}</div></div>
              <button className="logout-btn" title="Logout" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}><span>⎋</span> Logout</button>
            </div>
          </div>
        </aside>

        <div className="main-content">
          <div className="topbar">
            <div className="topbar-title">Doctors</div>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{doctors.length} on staff</span>
          </div>

          <div className="page-content">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            <div className="form-card">
              <div className="form-card-title">Add New Doctor</div>
              <div className="form-card-sub">Enter the doctor's professional information</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div className="input-wrapper"><span className="input-icon">🩺</span>
                    <input className="form-input" placeholder="Dr. Name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <div className="input-wrapper"><span className="input-icon">🏥</span>
                    <select className="form-select" value={form.specialization} onChange={e => update('specialization', e.target.value)}>
                      {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (yrs)</label>
                  <div className="input-wrapper"><span className="input-icon">📆</span>
                    <input className="form-input" type="number" placeholder="e.g. 10" value={form.experience} onChange={e => update('experience', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <div className="input-wrapper"><span className="input-icon">📞</span>
                    <input className="form-input" placeholder="+91 99999 99999" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <div className="input-wrapper"><span className="input-icon">✉</span>
                    <input className="form-input" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={addDoctor} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Adding…</> : '+ Add Doctor'}
                  </button>
                </div>
              </div>
            </div>

            {/* GRID/LIST TOGGLE */}
            <div className="table-card">
              <div className="table-toolbar">
                <div>
                  <div className="table-title">Medical Staff</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} of {doctors.length} doctors</div>
                </div>
                <div className="toolbar-right">
                  <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" placeholder="Search doctors…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="view-toggle">
                    <button className={`view-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}>⊞ Grid</button>
                    <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>≡ List</button>
                  </div>
                </div>
              </div>

              {fetching ? (
                <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading staff…</div></div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🩺</div>
                  <div className="empty-title">{search ? 'No results found' : 'No doctors yet'}</div>
                  <div className="empty-sub">{search ? 'Try a different search term' : 'Add your first doctor using the form above'}</div>
                </div>
              ) : view === 'grid' ? (
                <div className="doctors-grid" style={{ padding: 24 }}>
                  {filtered.map((d, i) => {
                    const sc = getSpecColor(d.specialization);
                    const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    return (
                      <div className="doctor-card" key={d._id || d.id}>
                        <div className="doctor-header">
                          <div className="doctor-avatar" style={{ background: avatarColor }}>{getInitials(d.name)}</div>
                          <div>
                            <div className="doctor-name">{d.name}</div>
                            <div className="doctor-id">{d._id || d.id}</div>
                          </div>
                        </div>
                        <span className="spec-badge" style={{ background: sc.bg, color: sc.color }}>{d.specialization}</span>
                        {d.experience && <div className="doctor-meta">📆 {d.experience} years experience</div>}
                        {d.phone && <div className="doctor-meta">📞 {d.phone}</div>}
                        {d.email && <div className="doctor-meta">✉ {d.email}</div>}
                        <div className="doctor-actions">
                          <button className="btn-edit" onClick={() => setEditDoc({ ...d })}>Edit</button>
                          <button className="btn-danger" onClick={() => setDeleteDoc(d)}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => {
                      const sc = getSpecColor(d.specialization);
                      return (
                        <tr key={d._id || d.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div className="doctor-avatar" style={{ width: 34, height: 34, fontSize: 13, background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{getInitials(d.name)}</div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{d.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d._id || d.id}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="spec-badge" style={{ background: sc.bg, color: sc.color }}>{d.specialization}</span></td>
                          <td>{d.experience ? `${d.experience} yrs` : '—'}</td>
                          <td>{d.phone || '—'}</td>
                          <td>{d.email || '—'}</td>
                          <td>
                            <button className="btn-edit" onClick={() => setEditDoc({ ...d })}>Edit</button>
                            <button className="btn-danger" onClick={() => setDeleteDoc(d)}>Remove</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {editDoc && (
          <div className="modal-overlay" onClick={() => setEditDoc(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Edit Doctor</div>
              {['name', 'phone', 'email', 'experience'].map(field => (
                <div className="form-group" key={field} style={{ marginBottom: 14 }}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{field === 'name' ? '🩺' : field === 'phone' ? '📞' : field === 'experience' ? '📆' : '✉'}</span>
                    <input className="form-input" value={editDoc[field] || ''} onChange={e => setEditDoc(d => ({ ...d, [field]: e.target.value }))} />
                  </div>
                </div>
              ))}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">Specialization</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏥</span>
                  <select className="form-select" value={editDoc.specialization} onChange={e => setEditDoc(d => ({ ...d, specialization: e.target.value }))}>
                    {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditDoc(null)}>Cancel</button>
                <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {deleteDoc && (
          <div className="modal-overlay" onClick={() => setDeleteDoc(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Remove Doctor</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{deleteDoc.name}</strong> from staff? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteDoc(null)}>Cancel</button>
                <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={confirmDelete}>Remove Doctor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Doctors;