import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/shared/StatCard.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import ComplianceReminders from '../../components/shared/ComplianceReminders.jsx';
import { Clock, AlertCircle, CheckCircle, AlertTriangle, MessageSquare, Eye, Activity } from 'lucide-react';

export default function StaffDashboard() {
    const navigate = useNavigate();
    const { getApplicationsForUser, db, getUnreadCount } = useAppData();
    const { user } = useAuth();

    const myApps = getApplicationsForUser(user?.id, 'staff');
    const myKycs = db.kycRecords.filter(k => {
        const app = db.applications.find(a => a.application_id === k.application_id);
        return app?.assigned_staff_id === user?.id;
    });
    const myDocs = db.documents.filter(d => {
        const app = db.applications.find(a => a.application_id === d.application_id);
        return app?.assigned_staff_id === user?.id && d.review_status === 'Pending';
    });
    const myFollowups = db.followups.filter(f => f.assigned_to_user_id === user?.id && f.status === 'Open');
    const completed = myApps.filter(a => a.status === 'Completed');

    const stats = [
        { label: 'My Applications', value: myApps.length, icon: <Clock />, color: '#1a56db' },
        { label: 'KYC Pending', value: myKycs.filter(k => ['Pending', 'Under Review'].includes(k.overall_kyc_status)).length, icon: <AlertCircle />, color: '#d97706' },
        { label: 'Pending Docs', value: myDocs.length, icon: <AlertTriangle />, color: '#7c3aed' },
        { label: 'Completed', value: completed.length, icon: <CheckCircle />, color: '#059669' },
        { label: 'Follow-ups', value: myFollowups.length, icon: <MessageSquare />, color: '#dc2626' },
    ];

    const quickActions = [
        { label: 'Review KYC', path: '/staff/kyc', color: '#7c3aed', count: myKycs.filter(k => ['Pending', 'Under Review'].includes(k.overall_kyc_status)).length },
        { label: 'Pending Documents', path: '/staff/documents', color: '#1a56db', count: myDocs.length },
        { label: 'Client Follow-ups', path: '/staff/followups', color: '#d97706', count: myFollowups.length },
        { label: 'Completed Tasks', path: '/staff/completed', color: '#059669', count: completed.length },
    ];

    const unread = getUnreadCount(user?.id);

    // Calculate avg processing time for completed apps
    const avgProcessingTime = completed.length > 0
        ? Math.round(completed.reduce((acc, app) => acc + (new Date(app.updated_at) - new Date(app.created_at)), 0) / completed.length / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div>


            <div className="stats-grid">
                {stats.map(s => <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                <div className="card" style={{ padding: 0 }}>
                    <div className="card-header" style={{ padding: '20px 24px' }}>
                        <div>
                            <div className="card-title">My Queue (Live)</div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/staff/queue')}>Full Queue</button>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Client</th><th>Business</th><th>KYC</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {myApps.length === 0 && (
                                    <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>No applications assigned yet</td></tr>
                                )}
                                {myApps.slice(0, 5).map(a => (
                                    <tr key={a.application_id}>
                                        <td><span style={{ fontWeight: 700, color: '#1a56db', fontSize: '0.8rem' }}>{a.application_id}</span></td>
                                        <td style={{ fontWeight: 500 }}>{a.client_name}</td>
                                        <td>{a.business_name}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{a.kyc_status || '—'}</td>
                                        <td><StatusBadge status={a.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <ComplianceReminders limit={3} />
                    <div className="card">
                        <div className="card-header"><div className="card-title">Quick Actions</div></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {quickActions.map(a => (
                                <button
                                    key={a.label}
                                    onClick={() => navigate(a.path)}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '12px 14px', borderRadius: 8, border: `1px solid ${a.color}25`,
                                        background: `${a.color}08`, cursor: 'pointer', transition: 'all 150ms', width: '100%',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = `${a.color}15`}
                                    onMouseOut={e => e.currentTarget.style.background = `${a.color}08`}
                                >
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{a.label}</span>
                                    <span style={{
                                        background: a.color, color: 'white', borderRadius: 999,
                                        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 700,
                                    }}>{a.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><div className="card-title">My Performance</div></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Tasks Completed (This Week)</span>
                                    <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 700 }}>{completed.length}</span>
                                </div>
                                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 4 }}>
                                    <div style={{ height: '100%', width: `75%`, background: '#059669', borderRadius: 4 }} />
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>On-time Delivery</span>
                                    <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 700 }}>98%</span>
                                </div>
                                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 4 }}>
                                    <div style={{ height: '100%', width: `98%`, background: '#1a56db', borderRadius: 4 }} />
                                </div>
                            </div>
                            <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: 8, borderRadius: '50%' }}>
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Avg Processing Time</div>
                                    <div style={{ fontSize: '1.1rem', color: '#111827', fontWeight: 700 }}>{avgProcessingTime || 3} Days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
