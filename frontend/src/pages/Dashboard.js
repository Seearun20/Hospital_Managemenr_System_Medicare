import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getUserFromToken } from '../utils/auth';

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
    --sidebar-w: 260px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); }

  .layout { display: flex; min-height: 100vh; }

  /* SIDEBAR */
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
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.1;
  }

  .logo-sub {
    font-family: 'DM Sans', sans-serif;
    color: rgba(255,255,255,0.4);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .sidebar-nav {
    flex: 1;
    padding: 24px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }

  .nav-section-label {
    color: rgba(255,255,255,0.3);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 8px 12px 4px;
    margin-top: 8px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }

  .nav-link:hover {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.9);
  }

  .nav-link.active {
    background: rgba(13,148,136,0.2);
    color: var(--teal-light);
    border: 1px solid rgba(13,148,136,0.3);
  }

  .nav-icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }

  .user-card {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
  }

  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), var(--gold));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 14px; font-weight: 700;
    flex-shrink: 0;
  }

  .user-info { flex: 1; min-width: 0; }
  .user-name { color: #fff; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { color: rgba(255,255,255,0.4); font-size: 11px; }

  .logout-btn {
    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
    cursor: pointer; color: #ef4444; font-size: 12px; font-weight: 600;
    padding: 6px 10px; border-radius: 6px; transition: all 0.2s;
    margin-left: auto; display: flex; align-items: center; gap: 6px;
  }

  .logout-btn:hover { background: #ef4444; color: #fff; }

  /* MAIN */
  .main-content {
    margin-left: var(--sidebar-w);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    background: #fff;
    border-bottom: 1px solid var(--border);
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }

  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--text-primary);
  }

  .topbar-right {
    display: flex; align-items: center; gap: 16px;
  }

  .badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  .page-content { padding: 32px; }

  /* STAT CARDS */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .stat-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .stat-body { flex: 1; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 13px; color: var(--text-muted); }
  .stat-trend { font-size: 12px; font-weight: 600; margin-top: 6px; }
  .trend-up { color: #16a34a; }
  .trend-neutral { color: var(--text-muted); }

  /* QUICK NAV CARDS */
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .quick-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 24px;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    cursor: pointer;
  }

  .quick-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    transform: translateY(-2px);
    border-color: var(--teal);
  }

  .quick-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }

  .quick-label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .quick-desc {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .quick-arrow {
    color: var(--teal);
    font-size: 18px;
    margin-top: auto;
  }

  /* ACTIVITY */
  .section-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .section-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--text-primary);
  }

  .section-action {
    color: var(--teal);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
  }

  .activity-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .activity-item:last-child { border-bottom: none; }

  .activity-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .activity-text { flex: 1; font-size: 14px; color: var(--text-primary); }
  .activity-time { font-size: 12px; color: var(--text-muted); }

  .empty-state {
    text-align: center;
    padding: 32px 16px;
    color: var(--text-muted);
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }
`;

const NAV_ITEMS = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', section: 'Overview' },
  { to: '/patients', icon: '👥', label: 'Patients', section: 'Management' },
  { to: '/doctors', icon: '🩺', label: 'Doctors', section: '' },
  { to: '/appointments', icon: '📅', label: 'Appointments', section: '' },
  { to: '/billing', icon: '💳', label: 'Billing', section: '' },
];

const QUICK_LINKS = [
  { to: '/patients', icon: '👥', bg: '#eff6ff', iconColor: '#3b82f6', label: 'Patients', desc: 'Manage patient records & history' },
  { to: '/doctors', icon: '🩺', bg: '#f0fdf4', iconColor: '#16a34a', label: 'Doctors', desc: 'View & add medical staff' },
  { to: '/appointments', icon: '📅', bg: '#fef3c7', iconColor: '#d97706', label: 'Appointments', desc: 'Schedule & track appointments' },
  { to: '/billing', icon: '💳', bg: '#fdf4ff', iconColor: '#9333ea', label: 'Billing', desc: 'Generate bills & track payments' },
];

function Dashboard() {
  const [stats, setStats] = useState({ patients: '-', doctors: '-', appointments: '-', bills: '-' });
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

  useEffect(() => {
    const headers = { Authorization: token };
    Promise.allSettled([
      API.get('/patients/', { headers }),
      API.get('/doctors/', { headers }),
      API.get('/appointments/', { headers }),
      API.get('/billing/', { headers }),
    ]).then(([p, d, a, b]) => {
      setStats({
        patients: p.status === 'fulfilled' ? p.value.data.length : '—',
        doctors: d.status === 'fulfilled' ? d.value.data.length : '—',
        appointments: a.status === 'fulfilled' ? a.value.data.length : '—',
        bills: b.status === 'fulfilled' ? b.value.data.length : '—',
      });
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const STAT_CARDS = [
    { icon: '👥', bg: '#eff6ff', value: stats.patients, label: 'Total Patients', trend: 'Active records' },
    { icon: '🩺', bg: '#f0fdf4', value: stats.doctors, label: 'Doctors', trend: 'On staff' },
    { icon: '📅', bg: '#fef3c7', value: stats.appointments, label: 'Appointments', trend: 'Scheduled' },
    { icon: '💳', bg: '#fdf4ff', value: stats.bills, label: 'Bills Generated', trend: 'Total invoices' },
  ];

  const allowedStatCards = STAT_CARDS.filter(s => {
    if (user.role === 'admin' || user.role === 'receptionist') return true;
    if (user.role === 'doctor') return ['Total Patients', 'Appointments'].includes(s.label);
    if (user.role === 'billing') return ['Total Patients', 'Bills Generated'].includes(s.label);
    return false;
  });

  const allowedQuickLinks = QUICK_LINKS.filter(q => {
    if (user.role === 'admin' || user.role === 'receptionist') return true;
    if (user.role === 'doctor') return ['/patients', '/appointments'].includes(q.to);
    if (user.role === 'billing') return ['/patients', '/billing'].includes(q.to);
    return false;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🏥</div>
            <div>
              <div className="logo-text">MediCore</div>
              <div className="logo-sub">HMS</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {allowedNavItems.map((item, i) => (
              <React.Fragment key={item.to}>
                {item.section && <div className="nav-section-label">{item.section}</div>}
                <Link to={item.to} className={`nav-link${currentPath === item.to ? ' active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user.fullName}</div>
                <div className="user-role" style={{ textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout"><span>⎋</span> Logout</button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-content">
          <div className="topbar">
            <div className="topbar-title">Dashboard</div>
            <div className="topbar-right">
              <span className="badge badge-success">● System Active</span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="page-content">
            {/* STATS */}
            <div className="stats-grid">
              {allowedStatCards.map((s, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="stat-body">
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-trend trend-neutral">{s.trend}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK NAV */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Quick Access</div>
              </div>
              <div className="quick-grid">
                {allowedQuickLinks.map(q => (
                  <Link to={q.to} className="quick-card" key={q.to}>
                    <div className="quick-icon" style={{ background: q.bg }}>{q.icon}</div>
                    <div className="quick-label">{q.label}</div>
                    <div className="quick-desc">{q.desc}</div>
                    <div className="quick-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Recent Activity</div>
                <Link to="/appointments" className="section-action">View all →</Link>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#14b8a6' }}></div>
                <div className="activity-text">System loaded successfully</div>
                <div className="activity-time">Just now</div>
              </div>
              <div className="activity-item">
                <div className="activity-dot" style={{ background: '#3b82f6' }}></div>
                <div className="activity-text">Dashboard stats refreshed</div>
                <div className="activity-time">1 min ago</div>
              </div>
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <div className="empty-text">No recent appointments yet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;