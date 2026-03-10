import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/shared/StatCard.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import ComplianceReminders from '../../components/shared/ComplianceReminders.jsx';
import { Users, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, UserPlus, Building2, Calendar, File, History, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { getAdminStats, getAdminTodayStats, getStaffWorkload, getApplicationsForUser, assignStaff, db } = useAppData();
    const { user } = useAuth();

    const stats = getAdminStats();
    const todayStats = getAdminTodayStats();
    const staffWorkload = getStaffWorkload();
    const applications = getApplicationsForUser(user?.id, 'admin');
    const recentApps = [...applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
    const recentActivities = [...(db.activityLogs || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');

    // For Application Detail Modal
    const [selectedAppDetails, setSelectedAppDetails] = useState(null);

    const staffUsers = db.users.filter(u => u.role === 'staff' && u.status === 'active');

    const handleAssign = () => {
        if (selectedApp && selectedStaff) {
            assignStaff(selectedApp.application_id, selectedStaff, user?.id);
            setShowAssignModal(false);
            setSelectedApp(null);
            setSelectedStaff('');
        }
    };

    const statCards = [
        { label: 'Total Clients', value: stats.total_clients, icon: <Users />, color: '#1a56db' },
        { label: 'Total Staff', value: stats.total_staff, icon: <UserPlus />, color: '#7c3aed' },
        { label: 'Pending KYC', value: stats.kyc_review, icon: <Clock />, color: '#d97706' },
        { label: 'In Progress', value: stats.in_progress, icon: <TrendingUp />, color: '#059669' },
        { label: 'Completed', value: stats.completed, icon: <CheckCircle />, color: '#059669' },
        { label: 'High Priority', value: stats.high_priority, icon: <AlertTriangle />, color: '#dc2626' },
        { label: 'Emergency', value: stats.emergency, icon: <AlertTriangle />, color: '#991b1b' },
    ];

    // Bar chart widths for status summary
    const statusBars = [
        { label: 'New', count: stats.new, color: '#6b7280' },
        { label: 'KYC Review', count: stats.kyc_review, color: '#d97706' },
        { label: 'Pending Docs', count: stats.pending_docs, color: '#f59e0b' },
        { label: 'In Progress', count: stats.in_progress, color: '#1a56db' },
        { label: 'Submitted/ACRA', count: stats.submitted_acra, color: '#7c3aed' },
        { label: 'Completed', count: stats.completed, color: '#059669' },
        { label: 'Rejected', count: stats.rejected, color: '#dc2626' },
    ];
    const maxBar = Math.max(...statusBars.map(b => b.count), 1);

    const todayCards = [
        { label: 'Applications Today', value: todayStats.apps_today, icon: <FileText size={20} />, color: '#1a56db' },
        { label: 'KYC Approved Today', value: todayStats.kyc_approved_today, icon: <CheckCircle size={20} />, color: '#059669' },
        { label: 'Docs Requested Today', value: todayStats.docs_requested_today, icon: <AlertTriangle size={20} />, color: '#d97706' },
        { label: 'ACRA Submissions', value: todayStats.acra_today, icon: <Building2 size={20} />, color: '#7c3aed' },
    ];

    const getAppFullDetails = (appId) => {
        const app = db.applications.find(a => a.application_id === appId);
        const client = db.users.find(u => u.user_id === app.client_user_id);
        const kyc = db.kycRecords.find(k => k.application_id === appId);
        const docs = db.documents.filter(d => d.application_id === appId);
        const timeline = db.statusHistory.filter(h => h.application_id === appId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const activities = db.activityLogs.filter(a => a.application_id === appId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return { app, client, kyc, docs, timeline, activities };
    };

    return (
        <div>

            <div className="stats-grid">
                {statCards.map(s => (
                    <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
                ))}
            </div>

            <div className="card-title" style={{ marginBottom: 12, marginTop: 12 }}>Today's Activity</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
                {todayCards.map(s => (
                    <div key={s.label} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ background: `${s.color}15`, color: s.color, padding: 10, borderRadius: 10 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
                {/* Recent Applications */}
                <div className="card" style={{ padding: 0 }}>
                    <div className="card-header" style={{ padding: '20px 24px' }}>
                        <div>
                            <div className="card-title">Applications (Live)</div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/applications')}>View All</button>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Business</th><th>Client</th><th>Assigned Staff</th><th>Status</th><th>Priority</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {recentApps.map(a => (
                                    <tr key={a.application_id}>
                                        <td>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                style={{ fontWeight: 700, color: '#1a56db', fontSize: '0.8rem', padding: '4px 8px' }}
                                                onClick={() => setSelectedAppDetails(getAppFullDetails(a.application_id))}
                                            >
                                                {a.application_id}
                                            </button>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{a.business_name}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{a.client_name}</td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            {a.staff_name
                                                ? <span style={{ color: '#059669', fontWeight: 500 }}>{a.staff_name}</span>
                                                : <span style={{ color: '#9ca3af' }}>Unassigned</span>}
                                        </td>
                                        <td><StatusBadge status={a.status} /></td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                                background: a.priority === 'Emergency' ? '#fdf2f8' : a.priority === 'High' ? '#fee2e2' : '#f3f4f6',
                                                color: a.priority === 'Emergency' ? '#9d174d' : a.priority === 'High' ? '#dc2626' : '#6b7280',
                                            }}>{a.priority}</span>
                                        </td>
                                        <td>
                                            <button className="btn btn-outline btn-sm" onClick={() => { setSelectedApp(a); setShowAssignModal(true); }}>
                                                {a.assigned_staff_id ? 'Reassign' : 'Assign'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <ComplianceReminders limit={3} />
                    {/* Status Overview */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 16 }}>Status Overview</div>
                        {statusBars.map(b => (
                            <div key={b.label} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                                    <span style={{ color: '#374151' }}>{b.label}</span>
                                    <span style={{ fontWeight: 700, color: b.color }}>{b.count}</span>
                                </div>
                                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                                    <div style={{ height: '100%', width: `${(b.count / maxBar) * 100}%`, background: b.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 16 }}>Staff Workload</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {staffWorkload.length === 0 ? <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>No staff found</div> : null}
                            {staffWorkload.map(staff => (
                                <div key={staff.staff_name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: staff.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}>
                                        {staff.staff_name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                                            <span style={{ fontWeight: 600, color: '#374151' }}>{staff.staff_name}</span>
                                            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{staff.active_cases} cases</span>
                                        </div>
                                        <div style={{ height: 6, background: '#f3f4f6', borderRadius: 4 }}>
                                            <div style={{ height: '100%', width: `${Math.min((staff.active_cases / 10) * 100, 100)}%`, background: staff.avatar_color, borderRadius: 4 }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 16 }}>Activity Log</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {recentActivities.map(act => (
                                <div key={act.log_id} style={{ fontSize: '0.85rem', paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, color: '#1a56db' }}>{act.application_id}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div style={{ color: '#374151', fontSize: '0.8rem' }}>{act.details}</div>
                                </div>
                            ))}
                            {recentActivities.length === 0 && <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No recent activity.</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Staff Modal */}
            {showAssignModal && selectedApp && (
                <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Assign Staff</div>
                            <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
                        </div>
                        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#f0f5ff', borderRadius: 8 }}>
                            <div style={{ fontWeight: 600, color: '#1a56db' }}>{selectedApp.application_id}</div>
                            <div style={{ fontSize: '0.875rem', color: '#374151' }}>{selectedApp.business_name}</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Select Staff Member</label>
                            <select className="form-select" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                                <option value="">— Choose staff —</option>
                                {staffUsers.map(s => <option key={s.user_id} value={s.user_id}>{s.full_name} ({s.email})</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAssign}>Assign</button>
                            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAssignModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Details Modal */}
            {selectedAppDetails && (
                <div className="modal-overlay" onClick={() => setSelectedAppDetails(null)}>
                    <div className="modal" style={{ maxWidth: 800, width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, paddingBottom: 16, borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <div className="modal-title">{selectedAppDetails.app.business_name}</div>
                                    <StatusBadge status={selectedAppDetails.app.status} />
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>ID: {selectedAppDetails.app.application_id} • Created: {selectedAppDetails.app.created_at.slice(0, 10)}</div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedAppDetails(null)}>×</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}><Users size={16} color="#1a56db" /> Client Details</h4>
                                <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8, fontSize: '0.85rem', color: '#374151' }}>
                                    <div style={{ marginBottom: 8 }}><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>Name:</strong> {selectedAppDetails.client.full_name}</div>
                                    <div style={{ marginBottom: 8 }}><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>Email:</strong> {selectedAppDetails.client.email}</div>
                                    <div><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>Phone:</strong> {selectedAppDetails.client.phone || 'N/A'}</div>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}><Building2 size={16} color="#1a56db" /> Business Details</h4>
                                <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8, fontSize: '0.85rem', color: '#374151' }}>
                                    <div style={{ marginBottom: 8 }}><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>Type:</strong> {selectedAppDetails.app.business_type}</div>
                                    <div style={{ marginBottom: 8 }}><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>Structure:</strong> {selectedAppDetails.app.business_structure || 'Private Limited'}</div>
                                    <div><strong style={{ color: '#6b7280', display: 'inline-block', width: 80 }}>ACRA Ref:</strong> {selectedAppDetails.app.acra_ref_number || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}><FileText size={16} color="#1a56db" /> Documents & KYC</h4>
                            <div className="table-wrapper">
                                <table>
                                    <thead><tr><th>Document Type</th><th>File Name</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {selectedAppDetails.docs.map(d => (
                                            <tr key={d.document_id}>
                                                <td style={{ fontWeight: 500, fontSize: '0.85rem' }}>{d.document_type}</td>
                                                <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{d.file_name}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: d.review_status === 'Approved' ? '#059669' : d.review_status === 'Rejected' ? '#dc2626' : '#d97706' }}>
                                                        {d.review_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedAppDetails.docs.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: '#9ca3af' }}>No documents uploaded yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}><Activity size={16} color="#1a56db" /> Activity Timeline</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 8, borderLeft: '2px solid #e5e7eb' }}>
                                {selectedAppDetails.activities.map((act, i) => (
                                    <div key={act.log_id} style={{ position: 'relative', paddingLeft: 16 }}>
                                        <div style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#1a56db' : '#9ca3af', border: '2px solid white' }} />
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{act.action_type}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{act.details}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>{act.created_at.slice(0, 16).replace('T', ' ')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
