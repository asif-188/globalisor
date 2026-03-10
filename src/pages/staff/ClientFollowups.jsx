import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';

const TYPE_COLORS = {
    'Document Request': '#d97706',
    'KYC Clarification': '#7c3aed',
    'Payment': '#dc2626',
    'Client Communication': '#1a56db',
    'ACRA Query': '#0891b2',
    'General': '#6b7280',
};

export default function ClientFollowups() {
    const { db, addFollowup } = useAppData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newFollowup, setNewFollowup] = useState({ applicationId: '', type: 'Document Request', notes: '', dueDate: '' });

    // My open follow-ups (assigned to me) + follow-ups I created
    const myFollowups = db.followups.filter(f =>
        f.assigned_to_user_id === user?.id || f.created_by_user_id === user?.id
    ).map(f => {
        const app = db.applications.find(a => a.application_id === f.application_id);
        const assignee = db.users.find(u => u.user_id === f.assigned_to_user_id);
        const creator = db.users.find(u => u.user_id === f.created_by_user_id);
        return { ...f, business_name: app?.business_name, assignee_name: assignee?.full_name, creator_name: creator?.full_name };
    });

    // Applications I'm assigned to (for the modal dropdown)
    const myApps = db.applications.filter(a => a.assigned_staff_id === user?.id);

    const handleAddFollowup = () => {
        if (!newFollowup.applicationId || !newFollowup.notes) return;
        const app = db.applications.find(a => a.application_id === newFollowup.applicationId);
        addFollowup(
            newFollowup.applicationId,
            user?.id,
            app?.client_user_id || null,
            newFollowup.type,
            newFollowup.notes,
            newFollowup.dueDate
        );
        setShowModal(false);
        setNewFollowup({ applicationId: '', type: 'Document Request', notes: '', dueDate: '' });
    };

    const openCount = myFollowups.filter(f => f.status === 'Open').length;

    return (
        <div>
            <div className="page-header">
                <h1>Client Follow-ups</h1>
            </div>

            {openCount > 0 && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={16} color="#d97706" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400e' }}>{openCount} open follow-up{openCount > 1 ? 's' : ''} require attention</span>
                </div>
            )}

            <div className="card" style={{ padding: 0 }}>
                <div className="card-header" style={{ padding: '16px 20px' }}>
                    <div className="card-title">Follow-ups ({myFollowups.length})</div>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Add Follow-up</button>
                </div>

                {myFollowups.length === 0 && (
                    <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No follow-ups yet. Add one to notify your client.</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {myFollowups.map(f => {
                        const typeColor = TYPE_COLORS[f.followup_type] || '#6b7280';
                        return (
                            <div key={f.followup_id} style={{
                                padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
                                display: 'flex', alignItems: 'flex-start', gap: 14,
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                    background: f.status === 'Closed' ? '#d1fae5' : f.status === 'Open' ? '#fee2e2' : '#fef3c7',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {f.status === 'Closed' ? <CheckCircle size={16} color="#059669" /> : <Clock size={16} color={f.status === 'Open' ? '#dc2626' : '#d97706'} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${typeColor}15`, color: typeColor }}>{f.followup_type}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{f.application_id} · {f.business_name}</span>
                                        {f.due_date && <span style={{ fontSize: '0.72rem', color: '#dc2626' }}>Due: {f.due_date}</span>}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: 4 }}>{f.notes}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        Created by {f.creator_name} → {f.assignee_name || 'Unassigned'} · {f.created_at}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, flexShrink: 0,
                                    background: f.status === 'Open' ? '#fee2e2' : f.status === 'Closed' ? '#d1fae5' : '#fef3c7',
                                    color: f.status === 'Open' ? '#991b1b' : f.status === 'Closed' ? '#065f46' : '#92400e',
                                }}>
                                    {f.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Add Follow-up</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Application</label>
                            <select className="form-select" value={newFollowup.applicationId} onChange={e => setNewFollowup(p => ({ ...p, applicationId: e.target.value }))}>
                                <option value="">— Select application —</option>
                                {myApps.map(a => <option key={a.application_id} value={a.application_id}>{a.application_id} — {a.business_name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select className="form-select" value={newFollowup.type} onChange={e => setNewFollowup(p => ({ ...p, type: e.target.value }))}>
                                {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-textarea" rows={3} value={newFollowup.notes} onChange={e => setNewFollowup(p => ({ ...p, notes: e.target.value }))} placeholder="Describe the action required..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input type="date" className="form-input" value={newFollowup.dueDate} onChange={e => setNewFollowup(p => ({ ...p, dueDate: e.target.value }))} />
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddFollowup}>
                                <Send size={14} /> Send Follow-up
                            </button>
                            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
