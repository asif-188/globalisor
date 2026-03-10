import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import ComplianceReminders from '../../components/shared/ComplianceReminders.jsx';
import { PlusCircle, MapPin, ShieldCheck, Upload, Bell, ArrowRight, MessageSquare, User, CalendarDays } from 'lucide-react';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const { getApplicationsForUser, db, getUnreadCount, markNotificationsRead } = useAppData();
    const { user } = useAuth();

    const myApps = getApplicationsForUser(user?.id, 'client');
    const latestApp = myApps[0] || null;
    const unread = getUnreadCount(user?.id);
    const myNotifs = db.notifications.filter(n => n.user_id === user?.id).slice(0, 5);

    const cards = [
        { icon: <PlusCircle size={28} />, color: '#1a56db', title: 'Register Business', path: '/client/register' },
        { icon: <MapPin size={28} />, color: '#7c3aed', title: 'Track Application', path: '/client/track' },
        { icon: <Upload size={28} />, color: '#d97706', title: 'Upload Documents', path: '/client/documents' },
        { icon: <ShieldCheck size={28} />, color: '#059669', title: 'Messages', path: '/client/messages' },
    ];

    const NOTIF_COLORS = {
        'KYC Approved': '#d1fae5', 'Document Approved': '#d1fae5', 'Application Completed': '#d1fae5',
        'KYC Rejected': '#fee2e2', 'Document Rejected': '#fee2e2',
        'Document Required': '#fef3c7', 'Follow-up Required': '#fef3c7',
        'Staff Assigned': '#e8f0fe', 'Application Submitted': '#e8f0fe', 'Status Changed': '#e8f0fe',
    };

    const calculateProgress = (status) => {
        switch (status) {
            case 'New': return 10;
            case 'KYC Review': return 25;
            case 'Pending Documents': return 40;
            case 'In Progress': return 65;
            case 'Submitted to ACRA': return 85;
            case 'Completed': return 100;
            case 'Rejected': return 100;
            default: return 0;
        }
    };

    const progress = latestApp ? calculateProgress(latestApp.status) : 0;
    const isCompleted = latestApp?.status === 'Completed';
    const isRejected = latestApp?.status === 'Rejected';

    return (
        <div>
            <div className="page-header">
                <h1>Client Dashboard</h1>
                <div style={{ flex: 1 }} />
                {unread > 0 && (
                    <button
                        style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                        onClick={() => markNotificationsRead(user?.id)}
                    >
                        🔔 {unread} new notification{unread > 1 ? 's' : ''} — mark all read
                    </button>
                )}
            </div>

            {/* Latest Application Banner */}
            {latestApp && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a56db, #0ea5e9)',
                        borderRadius: 16, padding: '24px 28px',
                        display: 'flex', flexDirection: 'column', gap: 20,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>

                                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>{latestApp.business_name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <StatusBadge status={latestApp.status} />
                                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <CalendarDays size={14} /> Est. Completion: {isCompleted ? 'Done' : '3-5 Business Days'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/client/track')}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.4)', color: 'white',
                                    padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                Track Progress <ArrowRight size={14} />
                            </button>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600 }}>
                                <span>Application Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${progress}%`,
                                    background: isRejected ? '#ef4444' : isCompleted ? '#10b981' : 'white',
                                    borderRadius: 4, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* Dedicated Account Manager Card */}
                    {latestApp.staff_name ? (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #e0e7ff', background: '#f8fafc' }}>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 600, fontSize: '1.2rem' }}>
                                    {latestApp.staff_name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.05rem' }}>{latestApp.staff_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Globalisor Staff</div>
                                </div>
                            </div>
                            <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, borderColor: '#4f46e5', color: '#4f46e5' }} onClick={() => navigate('/client/messages')}>
                                <MessageSquare size={16} /> Message {latestApp.staff_name.split(' ')[0]}
                            </button>
                        </div>
                    ) : (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#f9fafb', border: '1px dashed #d1d5db' }}>
                            <div style={{ background: '#f3f4f6', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: '#9ca3af' }}>
                                <User size={20} />
                            </div>
                            <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>Awaiting Assignment</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 4 }}>An expert will be assigned to your case shortly.</div>
                        </div>
                    )}
                </div>
            )}

            {!latestApp && (
                <div style={{ background: '#f0f5ff', borderRadius: 16, padding: '24px 28px', marginBottom: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a56db', marginBottom: 8 }}>No applications yet</div>
                    <button className="btn btn-primary" onClick={() => navigate('/client/register')}>
                        <PlusCircle size={16} /> Register Your Business
                    </button>
                </div>
            )}

            {/* Quick Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
                {cards.map((c, i) => (
                    <div
                        key={i} onClick={() => navigate(c.path)}
                        style={{ background: 'white', borderRadius: 12, padding: '20px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 200ms', display: 'flex', flexDirection: 'column', gap: 10 }}
                        onMouseOver={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${c.color}40`; }}
                        onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: 10, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: 4 }}>{c.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{c.desc}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.color, fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>Open <ArrowRight size={13} /></div>
                    </div>
                ))}
            </div>

            {/* Compliance Reminders & Notifications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <ComplianceReminders limit={5} />

                {/* Notifications from AppContext */}
                <div className="card" style={{ padding: 0 }}>
                    <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Bell size={18} color="var(--primary)" />
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a2340' }}>Recent Notifications</span>
                        </div>
                    </div>
                    <div style={{ padding: '0 20px 20px' }}>
                        {myNotifs.length === 0 && <div style={{ color: '#9ca3af', fontSize: '0.875rem', padding: 20 }}>No notifications yet</div>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                            {myNotifs.map(n => (
                                <div key={n.notification_id} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 8,
                                    background: n.is_read ? '#f9fafb' : (NOTIF_COLORS[n.notification_type] || '#e8f0fe'),
                                    border: `1px solid ${n.is_read ? '#e5e7eb' : '#d1d5db'}`,
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: n.is_read ? 400 : 600, color: '#374151' }}>{n.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{n.message}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>{n.created_at}</div>
                                    </div>
                                    {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a56db', flexShrink: 0, marginTop: 4 }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
