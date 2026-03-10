import React from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import ProgressTracker from '../../components/shared/ProgressTracker.jsx';
import { Clock } from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge.jsx';

const STATUS_STEPS = ['New', 'KYC Review', 'In Progress', 'Submitted to ACRA', 'Completed'];

function stepIndex(status) {
    const map = { 'New': 0, 'KYC Review': 1, 'Pending Documents': 1, 'In Progress': 2, 'Submitted to ACRA': 3, 'Completed': 4, 'Rejected': 0 };
    return map[status] ?? 0;
}

export default function TrackApplication() {
    const { getApplicationsForUser, db } = useAppData();
    const { user } = useAuth();

    const myApps = getApplicationsForUser(user?.id, 'client');
    const app = myApps[0] || null;

    const staffUser = app?.assigned_staff_id ? db.users.find(u => u.user_id === app.assigned_staff_id) : null;
    const statusLogs = db.activityLogs
        .filter(l => l.application_id === app?.application_id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    if (!app) {
        return (
            <div>
                <div className="page-header"></div>
                <div className="card" style={{ textAlign: 'center', padding: 64, color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>No applications yet</div>
                    <div>Register a business to start tracking your application status</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>Track Application</h1>
            </div>

            {/* App Info */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Application ID</div><div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a56db' }}>{app.application_id}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Company Name</div><div style={{ fontWeight: 700, color: '#111827' }}>{app.business_name}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Submitted</div><div style={{ fontWeight: 600, color: '#374151' }}>{app.submitted_at?.slice(0, 10) || '—'}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Assigned Staff</div><div style={{ fontWeight: 600, color: staffUser ? '#374151' : '#9ca3af' }}>{staffUser?.full_name || 'Pending assignment'}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Priority</div><div style={{ fontWeight: 600, color: app.priority === 'High' ? '#dc2626' : '#374151' }}>{app.priority}</div></div>
                    <div><div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>Current Status</div><StatusBadge status={app.status} /></div>
                </div>
            </div>

            {/* Progress */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title" style={{ marginBottom: 20 }}>Application Progress</div>
                <ProgressTracker steps={STATUS_STEPS} currentStep={stepIndex(app.status)} />

                {app.status === 'Rejected' && (
                    <div style={{ background: '#fee2e2', borderRadius: 8, padding: '12px 16px', marginTop: 20, color: '#991b1b', fontSize: '0.875rem' }}>
                        <strong>Application Rejected</strong> — Please contact your assigned staff for more information.
                    </div>
                )}
                {app.status === 'Completed' && (
                    <div style={{ background: '#d1fae5', borderRadius: 8, padding: '12px 16px', marginTop: 20, color: '#065f46', fontSize: '0.875rem' }}>
                        🎉 <strong>Congratulations!</strong> {app.business_name} is officially registered with ACRA!
                        {app.acra_ref_number && <div>ACRA Reference: <strong>{app.acra_ref_number}</strong></div>}
                    </div>
                )}
                {['KYC Review', 'Pending Documents'].includes(app.status) && (
                    <div style={{ background: '#fef3c7', borderRadius: 8, padding: '12px 16px', marginTop: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <Clock size={16} color="#92400e" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <div style={{ fontWeight: 600, color: '#92400e', fontSize: '0.875rem' }}>Action Required</div>
                            <div style={{ color: '#78350f', fontSize: '0.8rem', marginTop: 2 }}>
                                {app.status === 'KYC Review' ? 'Your KYC documents are under review. Our team will notify you once complete.' : 'Please upload the requested documents to continue.'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Activity Timeline from AppContext */}
            <div className="card">
                <div className="card-title" style={{ marginBottom: 20 }}>Activity Timeline</div>
                {statusLogs.length === 0 && <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No activity logged yet</div>}
                <div style={{ position: 'relative' }}>
                    {statusLogs.map((t, i) => (
                        <div key={t.log_id} style={{ display: 'flex', gap: 16, marginBottom: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#1a56db', flexShrink: 0, zIndex: 1, border: '2px solid white', boxShadow: '0 0 0 2px #1a56db', marginTop: 2 }} />
                                {i < statusLogs.length - 1 && <div style={{ width: 2, flex: 1, background: '#e5e7eb', margin: '4px 0' }} />}
                            </div>
                            <div style={{ paddingBottom: i < statusLogs.length - 1 ? 20 : 0, flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{t.action_type}</div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{t.action_description}</div>
                                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{t.created_at}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
