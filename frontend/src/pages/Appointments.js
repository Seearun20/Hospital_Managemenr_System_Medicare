import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getUserFromToken } from '../utils/auth';

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', bg: '#eff6ff', color: '#2563eb' },
  completed: { label: 'Completed', bg: '#f0fdf4', color: '#16a34a' },
  cancelled: { label: 'Cancelled', bg: '#fef2f2', color: '#dc2626' },
  pending: { label: 'Pending', bg: '#fef3c7', color: '#d97706' },
};

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
  .nav-icon { font-size: 18px; width: 24px; text-align: center; }
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
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; align-items: end; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text-primary); letter-spacing: 0.04em; text-transform: uppercase; }
  .input-wrapper { position: relative; }
  .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 14px; pointer-events: none; }
  .form-select { width: 100%; padding: 11px 12px 11px 38px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--cream); appearance: none; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
  .form-input { width: 100%; padding: 11px 12px 11px 38px; border: 1.5px solid var(--border); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary); background: var(--cream); transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(13,148,136,0.1); background: #fff; }
  .form-input::placeholder { color: #94a3b8; }

  .btn-primary { padding: 11px 24px; background: linear-gradient(135deg, var(--teal), var(--teal-light)); color: #fff; border: none; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: transform 0.15s, box-shadow 0.15s; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(13,148,136,0.3); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-danger { padding: 6px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .btn-danger:hover { background: #fee2e2; }
  .btn-cancel { padding: 10px 20px; background: var(--cream); color: var(--text-muted); border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }

  /* STATUS FILTER */
  .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-tab { padding: 7px 16px; border: 1.5px solid var(--border); border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; background: #fff; color: var(--text-muted); transition: all 0.15s; }
  .filter-tab.active { border-color: var(--teal); color: var(--teal); background: rgba(13,148,136,0.06); }

  .table-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .table-toolbar { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 12px; }
  .table-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); }
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

  .status-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .status-select { padding: 5px 10px; border: 1.5px solid var(--border); border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-primary); background: var(--cream); cursor: pointer; outline: none; }
  .status-select:focus { border-color: var(--teal); }

  .appt-number { width: 32px; height: 32px; border-radius: 50%; background: var(--cream); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }

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

  .btn-print { padding: 6px 14px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; margin-right: 6px; }
  .btn-print:hover { background: #dcfce7; }

  @media screen {
    .print-only { display: none !important; }
  }
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; width: 100%; }
    body { background: white; margin: 0; padding: 0; }
    @page { margin: 15mm; }
  }

  .opd-sheet { font-family: 'DM Sans', sans-serif; color: #000; line-height: 1.5; padding: 20px; }
  .opd-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
  .opd-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 5px; }
  .opd-subtitle { font-size: 14px; color: #444; }
  .opd-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
  .opd-box { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
  .opd-section-title { font-weight: 700; text-transform: uppercase; font-size: 12px; color: #555; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
  .opd-vitals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
  .vital-item { font-size: 13px; }
  .vital-item strong { display: block; font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 2px; }
  .vital-item span { display: inline-block; width: 100%; border-bottom: 1px dashed #999; height: 20px; }
  .opd-blank-area { height: 180px; border-bottom: 1px dashed #ccc; margin-bottom: 20px; }
  .opd-footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
  .signature-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-size: 14px; font-weight: 600; }
`;

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', section: 'Overview' },
  { to: '/patients', icon: '👥', label: 'Patients', section: 'Management' },
  { to: '/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/appointments', icon: '📅', label: 'Appointments' },
  { to: '/billing', icon: '💳', label: 'Billing' },
];

function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteAppt, setDeleteAppt] = useState(null);
  const [consultAppt, setConsultAppt] = useState(null);
  const [consultForm, setConsultForm] = useState({ bp: '', pulse: '', temp: '', weight: '', clinicalNotes: '', prescription: '' });
  const [printData, setPrintData] = useState(null);

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

  const fetchAll = async () => {
    setFetching(true);
    try {
      const headers = { Authorization: token };
      const [p, d, a] = await Promise.all([
        API.get('/patients/', { headers }),
        API.get('/doctors/', { headers }),
        API.get('/appointments/', { headers }),
      ]);
      setPatients(p.data);
      setDoctors(d.data);
      setAppointments(a.data);
    } catch { setError('Failed to load data.'); }
    finally { setFetching(false); }
  };

  const bookAppointment = async () => {
    if (!form.patientId || !form.doctorId) { setError('Please select a patient and doctor.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/appointments/', form, { headers: { Authorization: token } });
      setForm({ patientId: '', doctorId: '', date: '', time: '', reason: '', status: 'scheduled' });
      setSuccess('Appointment booked!');
      setTimeout(() => setSuccess(''), 3000);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || 'Failed to book appointment.'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}`, { status }, { headers: { Authorization: token } });
      setAppointments(prev => prev.map(a => (a._id === id || a.id === id) ? { ...a, status } : a));
    } catch { setError('Failed to update status.'); }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/appointments/${deleteAppt._id || deleteAppt.id}`, { headers: { Authorization: token } });
      setDeleteAppt(null); setSuccess('Appointment removed.'); setTimeout(() => setSuccess(''), 3000); fetchAll();
    } catch { setError('Failed to cancel appointment.'); }
  };

  const saveConsultation = async () => {
    setLoading(true);
    try {
      const updatedData = { 
        status: 'completed', 
        vitals: { bp: consultForm.bp, pulse: consultForm.pulse, temp: consultForm.temp, weight: consultForm.weight },
        clinicalNotes: consultForm.clinicalNotes,
        prescription: consultForm.prescription
      };
      await API.put(`/appointments/${consultAppt._id || consultAppt.id}`, updatedData, { headers: { Authorization: token } });
      setConsultAppt(null); setSuccess('Consultation saved successfully.'); setTimeout(() => setSuccess(''), 3000); fetchAll();
    } catch { setError('Failed to save consultation.'); }
    finally { setLoading(false); }
  };

  const handlePrintOPD = (appt) => {
    setPrintData(appt);
    setTimeout(() => window.print(), 100);
  };

  useEffect(() => { 
    fetchAll(); 
    const handleAfterPrint = () => setPrintData(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const getName = (list, id) => list.find(i => (i._id || i.id) === id)?.name || id;

  const filtered = appointments.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const pName = getName(patients, a.patientId).toLowerCase();
    const dName = getName(doctors, a.doctorId).toLowerCase();
    const matchSearch = !search || pName.includes(search.toLowerCase()) || dName.includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <style>{styles}</style>
      <div className="layout no-print">
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
            <div className="topbar-title">Appointments</div>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{appointments.length} total</span>
          </div>

          <div className="page-content">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            <div className="form-card">
              <div className="form-card-title">Schedule Appointment</div>
              <div className="form-card-sub">Book a new patient-doctor appointment</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Patient *</label>
                  <div className="input-wrapper"><span className="input-icon">👥</span>
                    <select className="form-select" value={form.patientId} onChange={e => update('patientId', e.target.value)}>
                      <option value="">Select patient</option>
                      {patients.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Doctor *</label>
                  <div className="input-wrapper"><span className="input-icon">🩺</span>
                    <select className="form-select" value={form.doctorId} onChange={e => update('doctorId', e.target.value)}>
                      <option value="">Select doctor</option>
                      {doctors.map(d => <option key={d._id || d.id} value={d._id || d.id}>{d.name} {d.specialization ? `— ${d.specialization}` : ''}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <div className="input-wrapper"><span className="input-icon">📅</span>
                    <input className="form-input" type="date" min={today} value={form.date} onChange={e => update('date', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <div className="input-wrapper"><span className="input-icon">🕐</span>
                    <input className="form-input" type="time" value={form.time} onChange={e => update('time', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <div className="input-wrapper"><span className="input-icon">📝</span>
                    <input className="form-input" placeholder="Chief complaint / reason" value={form.reason} onChange={e => update('reason', e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={bookAppointment} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Booking…</> : '📅 Book Appointment'}
                  </button>
                </div>
              </div>
            </div>

            {/* FILTER TABS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div className="filter-tabs">
                {['all', 'scheduled', 'completed', 'pending', 'cancelled'].map(s => (
                  <button key={s} className={`filter-tab${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                    {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                    {s === 'all' ? ` (${appointments.length})` : ` (${appointments.filter(a => a.status === s).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-card">
              <div className="table-toolbar">
                <div>
                  <div className="table-title">Appointment Records</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} shown</div>
                </div>
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" placeholder="Search appointments…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              {fetching ? (
                <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading appointments…</div></div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <div className="empty-title">No appointments found</div>
                  <div className="empty-sub">Try adjusting your filters or book a new appointment above</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, i) => {
                      const sc = STATUS_CONFIG[a.status] || STATUS_CONFIG.scheduled;
                      return (
                        <tr key={a._id || a.id}>
                          <td><div className="appt-number">{i + 1}</div></td>
                          <td style={{ fontWeight: 600 }}>{getName(patients, a.patientId)}</td>
                          <td>{getName(doctors, a.doctorId)}</td>
                          <td>
                            {a.date ? (
                              <div>
                                <div style={{ fontWeight: 500 }}>{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                {a.time && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.time}</div>}
                              </div>
                            ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </td>
                          <td style={{ maxWidth: 160 }}>{a.reason || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                          <td>
                            <select
                              className="status-select"
                              value={a.status || 'scheduled'}
                              onChange={e => updateStatus(a._id || a.id, e.target.value)}
                              style={{ background: sc.bg, color: sc.color, borderColor: 'transparent', fontWeight: 600 }}
                            >
                              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </td>
                          <td>
                            {user.role === 'doctor' && a.status !== 'completed' && (
                              <button className="btn-edit" onClick={() => {
                                setConsultAppt(a);
                                setConsultForm({
                                  bp: a.vitals?.bp || '', pulse: a.vitals?.pulse || '', temp: a.vitals?.temp || '', weight: a.vitals?.weight || '',
                                  clinicalNotes: a.clinicalNotes || '', prescription: a.prescription || ''
                                });
                              }}>🩺 Consult</button>
                            )}
                            <button className="btn-print" onClick={() => handlePrintOPD(a)}>🖨 Print OPD</button>
                            <button className="btn-danger" onClick={() => setDeleteAppt(a)}>Cancel</button>
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

        {deleteAppt && (
          <div className="modal-overlay" onClick={() => setDeleteAppt(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Cancel Appointment</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Are you sure you want to cancel the appointment for <strong>{getName(patients, deleteAppt.patientId)}</strong> with <strong>{getName(doctors, deleteAppt.doctorId)}</strong>?
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteAppt(null)}>Keep It</button>
                <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={confirmDelete}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}

        {consultAppt && (
          <div className="modal-overlay" onClick={() => setConsultAppt(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
              <div className="modal-title">Medical Consultation</div>
              <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-muted)' }}>
                Patient: <strong>{getName(patients, consultAppt.patientId)}</strong>
              </div>
              
              <div className="form-label" style={{ marginBottom: 8 }}>Vitals</div>
              <div className="form-grid" style={{ marginBottom: 16, gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                <div><input className="form-input" placeholder="BP (mmHg)" value={consultForm.bp} onChange={e => setConsultForm({...consultForm, bp: e.target.value})} style={{ padding: '10px' }} /></div>
                <div><input className="form-input" placeholder="Pulse (bpm)" value={consultForm.pulse} onChange={e => setConsultForm({...consultForm, pulse: e.target.value})} style={{ padding: '10px' }} /></div>
                <div><input className="form-input" placeholder="Temp (°F)" value={consultForm.temp} onChange={e => setConsultForm({...consultForm, temp: e.target.value})} style={{ padding: '10px' }} /></div>
                <div><input className="form-input" placeholder="Wt (kg)" value={consultForm.weight} onChange={e => setConsultForm({...consultForm, weight: e.target.value})} style={{ padding: '10px' }} /></div>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Clinical Notes & Diagnosis</label>
                <textarea className="form-input" rows="4" style={{ padding: '12px', resize: 'vertical' }} placeholder="Enter diagnosis and clinical observations..." value={consultForm.clinicalNotes} onChange={e => setConsultForm({...consultForm, clinicalNotes: e.target.value})}></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Rx (Prescription)</label>
                <textarea className="form-input" rows="4" style={{ padding: '12px', resize: 'vertical' }} placeholder="Medication, dosage, and instructions..." value={consultForm.prescription} onChange={e => setConsultForm({...consultForm, prescription: e.target.value})}></textarea>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setConsultAppt(null)}>Cancel</button>
                <button className="btn-primary" onClick={saveConsultation} disabled={loading}>
                  {loading ? 'Saving...' : 'Complete Consultation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {printData && (
        <div className="print-only opd-sheet">
          <div className="opd-header">
            <div className="opd-title">MediCore Hospital</div>
            <div className="opd-subtitle">123 Health Avenue, Medical District • Phone: (555) 123-4567 • Email: info@medicore.com</div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px', textDecoration: 'underline' }}>
            OUTPATIENT CONSULTATION SHEET
          </div>

          <div className="opd-box">
            <div className="opd-row">
              <div><strong>Patient Name:</strong> {getName(patients, printData.patientId)}</div>
              <div><strong>Date:</strong> {printData.date ? new Date(printData.date).toLocaleDateString() : new Date().toLocaleDateString()}</div>
            </div>
            <div className="opd-row">
              <div>
                <strong>Age/Gender:</strong> {patients.find(p => (p._id || p.id) === printData.patientId)?.age || '--'} / {patients.find(p => (p._id || p.id) === printData.patientId)?.gender || '--'}
              </div>
              <div><strong>Time:</strong> {printData.time || '--'}</div>
            </div>
            <div className="opd-row" style={{ marginBottom: 0 }}>
              <div><strong>Blood Group:</strong> {patients.find(p => (p._id || p.id) === printData.patientId)?.bloodGroup || '--'}</div>
              <div><strong>Consulting Doctor:</strong> {getName(doctors, printData.doctorId)}</div>
            </div>
          </div>

          <div className="opd-section-title">Vitals</div>
          <div className="opd-vitals">
            <div className="vital-item"><strong>Blood Pressure</strong><span>{printData.vitals?.bp || ''}</span></div>
            <div className="vital-item"><strong>Pulse Rate</strong><span>{printData.vitals?.pulse || ''}</span></div>
            <div className="vital-item"><strong>Temperature</strong><span>{printData.vitals?.temp || ''}</span></div>
            <div className="vital-item"><strong>Weight (kg)</strong><span>{printData.vitals?.weight || ''}</span></div>
          </div>

          <div className="opd-section-title">Chief Complaints / Reason for Visit</div>
          <div style={{ minHeight: '40px', padding: '10px', background: '#f8fafc', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
            {printData.reason || '___________________________________________________________________'}
          </div>

          <div className="opd-section-title">Clinical Notes & Diagnosis</div>
          <div className={printData.clinicalNotes ? '' : 'opd-blank-area'} style={{ padding: printData.clinicalNotes ? '10px' : 0, marginBottom: '20px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {printData.clinicalNotes || ''}
          </div>

          <div className="opd-section-title">Rx (Prescription)</div>
          <div className={printData.prescription ? '' : 'opd-blank-area'} style={{ padding: printData.prescription ? '10px' : 0, marginBottom: '20px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {printData.prescription || ''}
          </div>

          <div className="opd-footer">
            <div style={{ fontSize: '12px', color: '#666' }}>
              Printed on: {new Date().toLocaleString()}<br/>
              Valid for 7 days from consultation.
            </div>
            <div className="signature-line">
              Doctor's Signature & Stamp
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Appointments;