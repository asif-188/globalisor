import React from 'react';
import { AlertTriangle, CheckCircle, Calendar, Bell } from 'lucide-react';

const ALERTS = [
    { type: 'warning', icon: <AlertTriangle size={16} />, msg: 'APP-1006 — Annual Return due in 7 days', company: 'BlueSky Ventures', date: '2026-03-16' },
    { type: 'warning', icon: <AlertTriangle size={16} />, msg: 'APP-1003 — Director KYC expiring soon', company: 'PrimeBuild Corp', date: '2026-03-20' },
    { type: 'success', icon: <CheckCircle size={16} />, msg: 'APP-1005 — All compliance tasks complete', company: 'NexusAI Solutions', date: '2026-03-09' },
    { type: 'warning', icon: <AlertTriangle size={16} />, msg: 'APP-1004 — ACRA filing confirmation pending', company: 'FinEdge Capital', date: '2026-03-12' },
];

const CALENDAR = [
    { date: 'Mar 12', task: 'ACRA Submission — FinEdge Capital', type: 'acra' },
    { date: 'Mar 15', task: 'Annual Return — TechNova Pte. Ltd.', type: 'annual' },
    { date: 'Mar 16', task: 'Annual Return — BlueSky Ventures', type: 'annual' },
    { date: 'Mar 20', task: 'Director KYC Renewal — PrimeBuild', type: 'kyc' },
    { date: 'Mar 28', task: 'Corporate Secretary Renewal — Nexus Tech', type: 'cs' },
    { date: 'Apr 05', task: 'AGM Deadline — Green Horizon Ltd.', type: 'agm' },
];

const TYPE_COLORS = { acra: '#1a56db', annual: '#d97706', kyc: '#7c3aed', cs: '#0891b2', agm: '#059669' };
const TYPE_LABELS = { acra: 'ACRA', annual: 'Annual Return', kyc: 'KYC', cs: 'Corp Secretary', agm: 'AGM' };

export default function ComplianceMonitoring() {
    return (
        <div>
            <div className="page-header">
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
                {/* Calendar */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Compliance Calendar (March 2026)</div>
                        <Calendar size={18} style={{ color: 'var(--grey-400)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: '#e5e7eb', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} style={{ background: '#f9fafb', padding: '8px 4px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                                {day}
                            </div>
                        ))}
                        {/* Empty days for March 2026 starts on Sunday */}
                        {Array.from({ length: 31 }).map((_, i) => {
                            const date = i + 1;
                            const events = CALENDAR.filter(c => parseInt(c.date.split(' ')[1]) === date);
                            const isToday = date === 9; // Mock today

                            return (
                                <div key={date} style={{
                                    background: isToday ? '#eff6ff' : 'white',
                                    minHeight: 80, padding: '6px',
                                    borderTop: '1px solid #e5e7eb',
                                    display: 'flex', flexDirection: 'column', gap: 4
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem', fontWeight: isToday ? 700 : 500,
                                        color: isToday ? '#1a56db' : '#374151',
                                        width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isToday ? '#d1e4ff' : 'transparent', borderRadius: '50%'
                                    }}>
                                        {date}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {events.map((e, idx) => (
                                            <div key={idx} title={e.task} style={{
                                                fontSize: '0.65rem', padding: '2px 4px', borderRadius: 4,
                                                background: `${TYPE_COLORS[e.type]}15`, color: TYPE_COLORS[e.type],
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600
                                            }}>
                                                {TYPE_LABELS[e.type]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Alerts */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Compliance Alerts</div>
                        <Bell size={18} style={{ color: 'var(--grey-400)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {ALERTS.map((a, i) => (
                            <div key={i} style={{
                                padding: '12px 14px', borderRadius: 8,
                                background: a.type === 'warning' ? '#fef3c7' : '#d1fae5',
                                border: `1px solid ${a.type === 'warning' ? '#fde68a' : '#6ee7b7'}`,
                                display: 'flex', gap: 10,
                            }}>
                                <div style={{ color: a.type === 'warning' ? '#92400e' : '#065f46', flexShrink: 0, marginTop: 1 }}>
                                    {a.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: a.type === 'warning' ? '#92400e' : '#065f46' }}>
                                        {a.msg}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                                        {a.company} · {a.date}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
