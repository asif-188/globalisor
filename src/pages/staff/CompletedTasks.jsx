import React from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { CheckCircle, FileText, Clock } from 'lucide-react';

export default function CompletedTasks() {
    const { getApplicationsForUser, db } = useAppData();
    const { user } = useAuth();

    const myApps = getApplicationsForUser(user?.id, 'staff');
    const completedApps = myApps.filter(a => a.status === 'Completed');
    const reviewedDocs = db.documents.filter(d => {
        const app = db.applications.find(a => a.application_id === d.application_id);
        return app?.assigned_staff_id === user?.id && d.reviewed_by_user_id === user?.id;
    });
    const reviewedKyc = db.kycRecords.filter(k => k.reviewed_by_staff_id === user?.id && k.overall_kyc_status === 'Approved');

    const summaryStats = [
        { label: 'Applications Completed', value: completedApps.length, color: '#059669', icon: <CheckCircle size={20} /> },
        { label: 'Documents Reviewed', value: reviewedDocs.length, color: '#1a56db', icon: <FileText size={20} /> },
        { label: 'KYC Approvals', value: reviewedKyc.length, color: '#7c3aed', icon: <CheckCircle size={20} /> },
        { label: 'Total Actions', value: completedApps.length + reviewedDocs.length + reviewedKyc.length, color: '#d97706', icon: <Clock size={20} /> },
    ];

    return (
        <div>
            <div className="page-header">
            </div>

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
                {summaryStats.map(s => (
                    <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completed Applications */}
            <div className="card" style={{ padding: 0, marginBottom: 20 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                    Completed Applications ({completedApps.length})
                </div>
                {completedApps.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No completed applications yet</div>}
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>ID</th><th>Business</th><th>Client</th><th>Submitted</th><th>Completed</th></tr></thead>
                        <tbody>
                            {completedApps.map(a => (
                                <tr key={a.application_id}>
                                    <td><span style={{ fontWeight: 700, color: '#059669', fontSize: '0.8rem' }}>{a.application_id}</span></td>
                                    <td style={{ fontWeight: 500 }}>{a.business_name}</td>
                                    <td>{a.client_name}</td>
                                    <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{a.submitted_at?.slice(0, 10) || '—'}</td>
                                    <td style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>{a.completed_at?.slice(0, 10) || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Documents reviewed */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                    Documents Reviewed ({reviewedDocs.length})
                </div>
                {reviewedDocs.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No reviewed documents yet</div>}
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Document</th><th>File</th><th>Outcome</th><th>Reviewed</th></tr></thead>
                        <tbody>
                            {reviewedDocs.map(d => (
                                <tr key={d.document_id}>
                                    <td style={{ fontWeight: 500 }}>{d.document_type}</td>
                                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{d.file_name}</td>
                                    <td>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: d.review_status === 'Approved' ? '#d1fae5' : '#fee2e2', color: d.review_status === 'Approved' ? '#065f46' : '#991b1b' }}>
                                            {d.review_status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{d.reviewed_at?.slice(0, 10) || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
