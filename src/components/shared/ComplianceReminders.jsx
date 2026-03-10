import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    AlertCircle, Clock, Bell, ArrowRight,
    Calendar, ShieldCheck, CheckCircle2
} from 'lucide-react';

export default function ComplianceReminders({ limit = 5, showHeader = true }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getComplianceReminders, db } = useAppData();

    const reminders = getComplianceReminders(user?.user_id, user?.role);

    // Sort by deadline (closest first)
    const sortedReminders = [...reminders].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const visibleReminders = sortedReminders.slice(0, limit);

    if (visibleReminders.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <CheckCircle2 size={32} color="#059669" style={{ marginBottom: 12, opacity: 0.5 }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0a2340', margin: 0 }}>All Compliant</h4>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>No upcoming deadlines found.</p>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Urgent': return '#dc2626';
            case 'Pending': return '#d97706';
            case 'Upcoming': return '#0055a4';
            default: return '#6b7280';
        }
    };

    const getStatusBg = (status) => {
        switch (status) {
            case 'Urgent': return '#fef2f2';
            case 'Pending': return '#fffbeb';
            case 'Upcoming': return '#eff6ff';
            default: return '#f9fafb';
        }
    };

    return (
        <div className="card" style={{ padding: 0 }}>
            {showHeader && (
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Bell size={18} color="var(--primary)" />
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a2340' }}>Compliance Reminders</span>
                    </div>
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {visibleReminders.map((r, i) => {
                    const company = db.companies.find(c => c.company_id === r.company_id);
                    return (
                        <div
                            key={r.event_id}
                            style={{
                                padding: '16px 20px',
                                borderBottom: i === visibleReminders.length - 1 ? 'none' : '1px solid #f3f4f6',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 14,
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => navigate(`/company/${r.company_id}`)}
                        >
                            <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: getStatusBg(r.status),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: getStatusColor(r.status),
                                flexShrink: 0
                            }}>
                                {r.status === 'Urgent' ? <AlertCircle size={20} /> : <Clock size={20} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {r.type}
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 800,
                                        padding: '2px 8px', borderRadius: 999,
                                        background: getStatusBg(r.status),
                                        color: getStatusColor(r.status),
                                        textTransform: 'uppercase'
                                    }}>
                                        {r.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                                    {company?.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: '0.75rem', color: r.status === 'Urgent' ? '#dc2626' : '#6b7280', fontWeight: r.status === 'Urgent' ? 600 : 400 }}>
                                    <Calendar size={12} />
                                    Deadline: {new Date(r.deadline).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', alignSelf: 'center' }}>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
            {reminders.length > limit && (
                <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                    <button
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        View All {reminders.length} Reminders
                    </button>
                </div>
            )}
        </div>
    );
}
