import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut } from 'lucide-react';
import { GlobalisorLogo } from './GlobalisorLogo.jsx';

export default function Sidebar({ navItems, portalLabel, avatarColor }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <GlobalisorLogo variant="dark" size="sm" />
                {portalLabel && <span className="sidebar-logo-badge" style={{ marginTop: 5, display: 'block' }}>{portalLabel}</span>}
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/admin' && item.path !== '/staff' && item.path !== '/client' &&
                            location.pathname.startsWith(item.path));
                    const exactMatch = location.pathname === item.path;
                    const active = item.exact ? exactMatch : isActive;

                    return (
                        <button
                            key={item.path}
                            className={`sidebar-link ${active ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div
                        className="sidebar-user-avatar"
                        style={{ background: avatarColor || '#1a56db' }}
                    >
                        {user?.initials || '?'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name}</div>
                        <div className="sidebar-user-role">{user?.email}</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
