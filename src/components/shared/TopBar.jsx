import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppContext.jsx';

export default function TopBar({ title }) {
    const { user } = useAuth();
    const { db, getUnreadCount, markAsRead } = useAppData();
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const unreadCount = getUnreadCount(user?.id);
    const notifications = db.notifications
        .filter(n => n.user_id === user?.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5); // Show top 5

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            // Give them a moment to see the badge, then clear it (optional UX)
            // markAsRead(user?.id); 
        }
    };

    const handleNotificationClick = (n) => {
        setShowNotifications(false);
        if (!user) return;

        let path = '';
        if (user.role === 'admin') {
            if (n.notification_type?.includes('KYC')) path = '/admin/kyc';
            else path = '/admin/applications';
        } else if (user.role === 'staff') {
            if (n.notification_type?.includes('KYC')) path = '/staff/kyc';
            else if (n.notification_type?.includes('Document')) path = '/staff/documents';
            else path = '/staff/queue';
        } else if (user.role === 'client') {
            if (n.notification_type?.includes('Document')) path = '/client/documents';
            else if (n.title?.includes('Message') || n.notification_type?.includes('Follow-up')) path = '/client/messages';
            else path = '/client/track';
        }

        if (path) navigate(path);
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <span className="topbar-title">{title}</span>
            </div>
            <div className="topbar-right">
                <div className="topbar-search">
                    <Search size={15} style={{ color: 'var(--grey-400)', flexShrink: 0 }} />
                    <input type="text" placeholder="Search..." />
                </div>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button className="topbar-icon-btn" onClick={handleBellClick}>
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="topbar-badge">{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: 45, right: 0, width: 320, background: 'white',
                            borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid var(--grey-200)',
                            zIndex: 1000, overflow: 'hidden', display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--grey-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Notifications</span>
                                {unreadCount > 0 && (
                                    <button onClick={() => markAsRead(user?.id)} style={{ fontSize: '0.75rem', color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>No notifications found</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id || n.notification_id} onClick={() => handleNotificationClick(n)} style={{
                                            padding: '12px 16px', borderBottom: '1px solid var(--grey-100)',
                                            background: n.read_status === 'unread' || !n.is_read ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'background 0.2s'
                                        }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = (n.read_status === 'unread' || !n.is_read) ? '#eff6ff' : 'white'}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: n.read_status === 'unread' ? 600 : 500, color: '#1e293b', marginBottom: 4 }}>
                                                {n.message}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{n.created_at.slice(0, 10)}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1a56db' }}>
                                                    <Info size={12} />
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{n.application_id || 'System'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="topbar-avatar"
                    style={{ background: user?.avatarColor || '#1a56db' }}
                    title={user?.name}
                >
                    {user?.initials || '?'}
                </div>
            </div>
        </header>
    );
}
