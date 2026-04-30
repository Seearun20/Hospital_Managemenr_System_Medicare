import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getUserFromToken } from '../utils/auth';

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

  .sidebar {
    width: var(--sidebar-w);
    background: var(--navy);
    display: flex;
    flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .sidebar-logo {
    padding: 28px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 12px;
  }

  .logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--teal), var(--teal-light));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 16px rgba(13,148,136,0.4);
  }

  .logo-text { font-family: 'Playfair Display', serif; color: #fff; font-size: 18px; font-weight: 700; }
  .logo-sub { color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }

  .sidebar-nav { flex: 1; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }

  .nav-section-label {
    color: rgba(255,255,255,0.3);
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 8px 12px 4px; margin-top: 8px;
  }

  .nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 10px;
    color: rgba(255,255,255,0.6);
    text-decoration: none; font-size: 14px; font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }

  .nav-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .nav-link.active { background: rgba(13,148,136,0.2); color: var(--teal-light); border: 1px solid rgba(13,148,136,0.3); }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; }

  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.07); }
  .user-card { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,0.05); }
  .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--teal), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 700; }
  .user-name { color: #fff; font-size: 13px; font-weight: 600; }
  .user-role { color: rgba(255,255,255,0.4); font-size: 11px; }
  .logout-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); cursor: pointer; color: #ef4444; font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 6px; transition: all 0.2s; margin-left: auto; display: flex; align-items: center; gap: 6px; }
  .logout-btn:hover { background: #ef4444; color: #fff; }

  .main-content { margin-left: var(--sidebar-w); flex: 1; }

  .topbar {
    background: #fff; border-bottom: 1px solid var(--border);
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }

  .topbar-title { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--text-primary); }
  .page-content { padding: 32px; }

  /* FORM CARD */
  .form-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 24px;
  }

  .form-card-header {
    margin-bottom: 24px;
  }

  .form-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .form-card-sub { color: var(--text-muted); font-size: 13px; }

  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end; }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-primary); letter-spacing: 0.04em; text-transform: uppercase; }

  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; pointer-events: none; }

  .form-input {
    width: 100%;
    padding: 11px 12px 11px 38px;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    background: var(--cream);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
  .form-input::placeholder { color: #94a3b8; }

  .form-select {
    width: 100%;
    padding: 11px 12px 11px 38px;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    background: var(--cream);
    appearance: none; cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .form-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }

  .btn-primary {
    padding: 11px 24px;
    background: linear-gradient(135deg, var(--teal), var(--teal-light));
    color: #fff; border: none; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(13,148,136,0.3); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-danger {
    padding: 6px 14px;
    background: #fef2f2; color: #dc2626;
    border: 1px solid #fecaca; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.15s;
  }

  .btn-danger:hover { background: #fee2e2; }

  .btn-edit {
    padding: 6px 14px;
    background: #eff6ff; color: #2563eb;
    border: 1px solid #bfdbfe; border-radius: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.15s; margin-right: 6px;
  }

  .btn-edit:hover { background: #dbeafe; }

  /* TABLE */
  .table-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }

  .table-toolbar {
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap; gap: 12px;
  }

  .table-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); }
  .record-count { font-size: 13px; color: var(--text-muted); }

  .search-wrapper { position: relative; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; }
  .search-input {
    padding: 9px 14px 9px 36px;
    border: 1.5px solid var(--border); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--text-primary); background: var(--cream);
    outline: none; width: 240px;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--teal); background: #fff; }
  .search-input::placeholder { color: #94a3b8; }

  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--cream); }
  th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  td { padding: 14px 20px; font-size: 14px; color: var(--text-primary); border-top: 1px solid var(--border); vertical-align: middle; }
  tr:hover td { background: #f8fafc; }

  .patient-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #2563eb;
    flex-shrink: 0;
  }

  .patient-name-cell { display: flex; align-items: center; gap: 12px; }
  .patient-id { font-size: 11px; color: var(--text-muted); margin-top: 2px; font-family: monospace; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
  }

  .badge-blue { background: #eff6ff; color: #2563eb; }
  .badge-green { background: #f0fdf4; color: #16a34a; }
  .badge-orange { background: #fff7ed; color: #c2410c; }

  .empty-state { text-align: center; padding: 56px 24px; color: var(--text-muted); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert { padding: 10px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: #fff; border-radius: 16px; padding: 32px; width: 90%; max-width: 440px; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 20px; color: var(--text-primary); }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
  .btn-cancel { padding: 10px 20px; background: var(--cream); color: var(--text-muted); border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }
`;

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', section: 'Overview' },
  { to: '/patients', icon: '👥', label: 'Patients', section: 'Management' },
  { to: '/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/appointments', icon: '📅', label: 'Appointments' },
  { to: '/billing', icon: '💳', label: 'Billing' },
];

function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', phone: '', email: '', bloodGroup: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [editPatient, setEditPatient] = useState(null);
  const [deletePatient, setDeletePatient] = useState(null);

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

  const fetchPatients = async () => {
    setFetching(true);
    try {
      const res = await API.get('/patients/', { headers: { Authorization: token } });
      setPatients(res.data);
    } catch (err) { setError('Failed to load patients.'); }
    finally { setFetching(false); }
  };

  const addPatient = async () => {
    if (!form.name || !form.age) { setError('Name and age are required.'); return; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return; }
    
    const phoneRegex = /^\d{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) { setError('Phone number must be exactly 10 digits.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/patients/', form, { headers: { Authorization: token } });
      setForm({ name: '', age: '', gender: 'Male', phone: '', email: '', bloodGroup: '' });
      setSuccess('Patient added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPatients();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add patient.'); }
    finally { setLoading(false); }
  };

  const saveEdit = async () => {
    if (!editPatient.name || !editPatient.age) { setError('Name and age are required.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editPatient.email && !emailRegex.test(editPatient.email)) { setError('Please enter a valid email address.'); return; }
    
    const phoneRegex = /^\d{10}$/;
    if (editPatient.phone && !phoneRegex.test(editPatient.phone)) { setError('Phone number must be exactly 10 digits.'); return; }

    setLoading(true);
    try {
      await API.put(`/patients/${editPatient._id || editPatient.id}`, editPatient, { headers: { Authorization: token } });
      setEditPatient(null);
      setSuccess('Patient updated!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPatients();
    } catch { setError('Failed to update patient.'); }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/patients/${deletePatient._id || deletePatient.id}`, { headers: { Authorization: token } });
      setDeletePatient(null);
      setSuccess('Patient removed.');
      setTimeout(() => setSuccess(''), 3000);
      fetchPatients();
    } catch { setError('Failed to delete patient.'); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const getInitials = name => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
            {allowedNavItems.map((item, i) => (
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
              <div className="user-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
              <div><div className="user-name">{user.fullName}</div><div className="user-role" style={{ textTransform: 'capitalize' }}>{user.role}</div></div>
              <button className="logout-btn" title="Logout" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}><span>⎋</span> Logout</button>
            </div>
          </div>
        </aside>

        <div className="main-content">
          <div className="topbar">
            <div className="topbar-title">Patients</div>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{patients.length} registered</span>
          </div>

          <div className="page-content">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {/* ADD FORM */}
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-title">Register New Patient</div>
                <div className="form-card-sub">Fill in the patient's details below</div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input className="form-input" placeholder="Patient name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🎂</span>
                    <input className="form-input" type="number" placeholder="Age" value={form.age} onChange={e => update('age', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <div className="input-wrapper">
                    <span className="input-icon">⚧</span>
                    <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📞</span>
                    <input className="form-input" placeholder="+91 99999 99999" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input className="form-input" type="email" placeholder="patient@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🩸</span>
                    <select className="form-select" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                      <option value="">Unknown</option>
                      {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={addPatient} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Adding…</> : '+ Add Patient'}
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-card">
              <div className="table-toolbar">
                <div>
                  <div className="table-title">Patient Records</div>
                  <div className="record-count">{filtered.length} of {patients.length} patients</div>
                </div>
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" placeholder="Search patients…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              {fetching ? (
                <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading patients…</div></div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <div className="empty-title">{search ? 'No results found' : 'No patients yet'}</div>
                  <div className="empty-sub">{search ? 'Try a different search term' : 'Add your first patient using the form above'}</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Blood Group</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p._id || p.id}>
                        <td>
                          <div className="patient-name-cell">
                            <div className="patient-avatar">{getInitials(p.name)}</div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <div className="patient-id">{p._id || p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.age} yrs</td>
                        <td>
                          <span className="badge badge-blue">{p.gender || 'N/A'}</span>
                        </td>
                        <td>
                          {p.bloodGroup ? <span className="badge badge-orange">{p.bloodGroup}</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                        <td>{p.phone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>{p.email || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>
                          <button className="btn-edit" onClick={() => setEditPatient({ ...p })}>Edit</button>
                          <button className="btn-danger" onClick={() => setDeletePatient(p)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editPatient && (
          <div className="modal-overlay" onClick={() => setEditPatient(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Edit Patient</div>
              {['name','age','phone','email'].map(field => (
                <div className="form-group" key={field} style={{ marginBottom: 14 }}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <div className="input-wrapper">
                    <span className="input-icon">{field === 'name' ? '👤' : field === 'age' ? '🎂' : field === 'phone' ? '📞' : '✉'}</span>
                    <input className="form-input" value={editPatient[field] || ''} onChange={e => setEditPatient(p => ({ ...p, [field]: e.target.value }))} />
                  </div>
                </div>
              ))}
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEditPatient(null)}>Cancel</button>
                <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deletePatient && (
          <div className="modal-overlay" onClick={() => setDeletePatient(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Confirm Deletion</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{deletePatient.name}</strong> from patient records? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeletePatient(null)}>Cancel</button>
                <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={confirmDelete}>Delete Patient</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Patients;