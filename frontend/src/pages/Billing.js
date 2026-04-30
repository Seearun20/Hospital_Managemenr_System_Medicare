import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getUserFromToken } from '../utils/auth';

const PAYMENT_STATUS = {
  unpaid: { label: 'Unpaid', bg: '#fef2f2', color: '#dc2626' },
  paid: { label: 'Paid', bg: '#f0fdf4', color: '#16a34a' },
  partial: { label: 'Partial', bg: '#fef3c7', color: '#d97706' },
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

  /* SUMMARY CARDS */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
  .stat-label { font-size: 12px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-size: 26px; font-weight: 700; color: var(--text-primary); }
  .stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

  .form-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  .form-card-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); margin-bottom: 4px; }
  .form-card-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; align-items: end; }
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
  .btn-print { padding: 6px 14px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; margin-right: 6px; }
  .btn-print:hover { background: #dcfce7; }
  .btn-cancel { padding: 10px 20px; background: var(--cream); color: var(--text-muted); border: 1.5px solid var(--border); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; }

  /* FILTER */
  .filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
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

  .pay-status-select { padding: 5px 10px; border: 1.5px solid var(--border); border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-primary); background: var(--cream); cursor: pointer; outline: none; }

  .invoice-num { font-family: monospace; font-size: 12px; color: var(--text-muted); background: var(--cream); padding: 3px 8px; border-radius: 5px; border: 1px solid var(--border); }
  .amount-cell { font-size: 16px; font-weight: 700; color: var(--text-primary); }

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

  /* PRINT INVOICE */
  @media screen {
    .print-only { display: none !important; }
  }
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; width: 100%; }
    body { background: white; margin: 0; padding: 0; }
    @page { margin: 15mm; }
  }

  .invoice-sheet { font-family: 'DM Sans', sans-serif; color: #000; line-height: 1.6; padding: 20px; }
  .inv-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
  .inv-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; margin-bottom: 5px; }
  .inv-subtitle { font-size: 14px; color: #555; }
  .inv-type { text-align: center; font-size: 20px; font-weight: 700; letter-spacing: 2px; margin-bottom: 30px; text-decoration: underline; }
  .inv-details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 15px; }
  .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .inv-table th { border-bottom: 2px solid #000; text-align: left; padding: 12px 8px; font-weight: 700; color: #000; font-size: 14px; }
  .inv-table td { border-bottom: 1px solid #ccc; padding: 12px 8px; color: #000; }
  .inv-total { display: flex; justify-content: flex-end; font-size: 20px; font-weight: 700; margin-bottom: 40px; }
  .inv-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; font-size: 14px; }
  .inv-sign { border-top: 1px solid #000; width: 250px; text-align: center; padding-top: 8px; font-weight: 600; }
`;

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', section: 'Overview' },
  { to: '/patients', icon: '👥', label: 'Patients', section: 'Management' },
  { to: '/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/appointments', icon: '📅', label: 'Appointments' },
  { to: '/billing', icon: '💳', label: 'Billing' },
];

const SERVICE_TYPES = ['Consultation', 'Emergency', 'Surgery', 'Lab Test', 'Imaging', 'Physiotherapy', 'Pharmacy', 'Room Charges', 'ICU Charges', 'Other'];

function Billing() {
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({ patientId: '', amount: '', serviceType: 'Consultation', description: '', paymentStatus: 'unpaid' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteBill, setDeleteBill] = useState(null);
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
      const [p, b] = await Promise.all([
        API.get('/patients/', { headers }),
        API.get('/billing/', { headers }),
      ]);
      setPatients(p.data);
      setBills(b.data);
    } catch { setError('Failed to load billing data.'); }
    finally { setFetching(false); }
  };

  const generateBill = async () => {
    if (!form.patientId || !form.amount) { setError('Patient and amount are required.'); return; }
    if (isNaN(form.amount) || Number(form.amount) <= 0) { setError('Please enter a valid amount.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/billing/', { ...form, amount: Number(form.amount) }, { headers: { Authorization: token } });
      setForm({ patientId: '', amount: '', serviceType: 'Consultation', description: '', paymentStatus: 'unpaid' });
      setSuccess('Bill generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || 'Failed to generate bill.'); }
    finally { setLoading(false); }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await API.put(`/billing/${id}`, { paymentStatus }, { headers: { Authorization: token } });
      setBills(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, paymentStatus } : b));
    } catch { setError('Failed to update payment status.'); }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/billing/${deleteBill._id || deleteBill.id}`, { headers: { Authorization: token } });
      setDeleteBill(null); setSuccess('Bill removed.'); setTimeout(() => setSuccess(''), 3000); fetchAll();
    } catch { setError('Failed to delete bill.'); }
  };

  const handlePrintBill = (bill) => {
    setPrintData(bill);
    setTimeout(() => window.print(), 100);
  };

  useEffect(() => { 
    fetchAll(); 
    const handleAfterPrint = () => setPrintData(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const getPatientName = id => patients.find(p => (p._id || p.id) === id)?.name || id;
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = bills.filter(b => {
    const matchStatus = statusFilter === 'all' || b.paymentStatus === statusFilter;
    const name = getPatientName(b.patientId).toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = bills.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? Number(b.amount) : 0), 0);
  const totalPending = bills.reduce((sum, b) => sum + (b.paymentStatus === 'unpaid' ? Number(b.amount) : 0), 0);
  const totalBills = bills.length;
  const paidCount = bills.filter(b => b.paymentStatus === 'paid').length;

  const generateInvoiceNumber = (id, index) => `INV-${String(index + 1).padStart(4, '0')}`;

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
            <div className="topbar-title">Billing</div>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{totalBills} invoices</span>
          </div>

          <div className="page-content">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {/* STATS */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value" style={{ color: '#16a34a' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="stat-sub">{paidCount} paid bills</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Outstanding</div>
                <div className="stat-value" style={{ color: '#dc2626' }}>₹{totalPending.toLocaleString('en-IN')}</div>
                <div className="stat-sub">{bills.filter(b => b.paymentStatus === 'unpaid').length} unpaid bills</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Invoices</div>
                <div className="stat-value">{totalBills}</div>
                <div className="stat-sub">All time</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Collection Rate</div>
                <div className="stat-value" style={{ color: 'var(--teal)' }}>
                  {totalBills > 0 ? Math.round((paidCount / totalBills) * 100) : 0}%
                </div>
                <div className="stat-sub">Bills paid</div>
              </div>
            </div>

            {/* FORM */}
            <div className="form-card">
              <div className="form-card-title">Generate Bill</div>
              <div className="form-card-sub">Create a new billing invoice for a patient</div>
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
                  <label className="form-label">Service Type</label>
                  <div className="input-wrapper"><span className="input-icon">🏥</span>
                    <select className="form-select" value={form.serviceType} onChange={e => update('serviceType', e.target.value)}>
                      {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹) *</label>
                  <div className="input-wrapper"><span className="input-icon">₹</span>
                    <input className="form-input" type="number" placeholder="0.00" min="0" value={form.amount} onChange={e => update('amount', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <div className="input-wrapper"><span className="input-icon">📝</span>
                    <input className="form-input" placeholder="Optional notes" value={form.description} onChange={e => update('description', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <div className="input-wrapper"><span className="input-icon">💳</span>
                    <select className="form-select" value={form.paymentStatus} onChange={e => update('paymentStatus', e.target.value)}>
                      {Object.entries(PAYMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={generateBill} disabled={loading}>
                    {loading ? <><span className="spinner"></span>Generating…</> : '🧾 Generate Bill'}
                  </button>
                </div>
              </div>
            </div>

            {/* FILTERS */}
            <div className="filter-tabs">
              {['all', 'unpaid', 'paid', 'partial'].map(s => (
                <button key={s} className={`filter-tab${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                  {s === 'all' ? `All (${bills.length})` : `${PAYMENT_STATUS[s]?.label} (${bills.filter(b => b.paymentStatus === s).length})`}
                </button>
              ))}
            </div>

            <div className="table-card">
              <div className="table-toolbar">
                <div>
                  <div className="table-title">Invoices</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{filtered.length} shown</div>
                </div>
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" placeholder="Search by patient…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              {fetching ? (
                <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-title">Loading invoices…</div></div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💳</div>
                  <div className="empty-title">No bills found</div>
                  <div className="empty-sub">Generate your first bill using the form above</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => {
                      const ps = PAYMENT_STATUS[b.paymentStatus] || PAYMENT_STATUS.unpaid;
                      return (
                        <tr key={b._id || b.id}>
                          <td><span className="invoice-num">{generateInvoiceNumber(b._id || b.id, i)}</span></td>
                          <td style={{ fontWeight: 600 }}>{getPatientName(b.patientId)}</td>
                          <td>{b.serviceType || 'Consultation'}</td>
                          <td style={{ color: 'var(--text-muted)', maxWidth: 140 }}>{b.description || '—'}</td>
                          <td><span className="amount-cell">₹{Number(b.amount).toLocaleString('en-IN')}</span></td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td>
                            <select
                              className="pay-status-select"
                              value={b.paymentStatus || 'unpaid'}
                              onChange={e => updatePayment(b._id || b.id, e.target.value)}
                              style={{ background: ps.bg, color: ps.color, borderColor: 'transparent', fontWeight: 600 }}
                            >
                              {Object.entries(PAYMENT_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </td>
                          <td>
                            <button className="btn-print" onClick={() => handlePrintBill(b)}>🖨 Print</button>
                            <button className="btn-danger" onClick={() => setDeleteBill(b)}>Delete</button>
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

        {deleteBill && (
          <div className="modal-overlay" onClick={() => setDeleteBill(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Delete Invoice</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                Delete bill of <strong>₹{Number(deleteBill.amount).toLocaleString('en-IN')}</strong> for <strong>{getPatientName(deleteBill.patientId)}</strong>? This cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteBill(null)}>Cancel</button>
                <button className="btn-danger" style={{ padding: '10px 20px' }} onClick={confirmDelete}>Delete Bill</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {printData && (
        <div className="print-only invoice-sheet">
          <div className="inv-header">
            <div className="inv-title">MediCore Hospital</div>
            <div className="inv-subtitle">123 Health Avenue, Medical District • Phone: (555) 123-4567 • Email: billing@medicore.com</div>
          </div>

          <div className="inv-type">TAX INVOICE / RECEIPT</div>

          <div className="inv-details">
            <div>
              <strong>Patient Name:</strong> {getPatientName(printData.patientId)}<br/>
              <strong>Patient ID:</strong> {printData.patientId.substring(0, 8).toUpperCase()}<br/>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>Invoice No:</strong> {printData._id ? printData._id.substring(printData._id.length - 6).toUpperCase() : 'INV-TEMP'}<br/>
              <strong>Date:</strong> {printData.createdAt ? new Date(printData.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}<br/>
              <strong>Status:</strong> <span style={{ textTransform: 'uppercase', color: printData.paymentStatus === 'paid' ? '#16a34a' : '#dc2626' }}>{printData.paymentStatus}</span>
            </div>
          </div>

          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service Type</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{printData.serviceType || 'Consultation'}</td>
                <td>{printData.description || 'Standard medical service charges'}</td>
                <td style={{ textAlign: 'right' }}>₹{Number(printData.amount).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <div className="inv-total">
            Total Amount: ₹{Number(printData.amount).toLocaleString('en-IN')}
          </div>

          <div className="inv-footer">
            <div>
              <strong>Terms & Conditions:</strong><br/>
              1. This is a computer generated invoice.<br/>
              2. For any billing queries, please contact the accounts desk.
            </div>
            <div className="inv-sign">
              Authorized Signatory<br/>
              <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#555' }}>MediCore Hospital Accounts Dept.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Billing;