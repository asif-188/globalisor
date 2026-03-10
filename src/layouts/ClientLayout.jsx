import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar.jsx';
import TopBar from '../components/shared/TopBar.jsx';
import {
    LayoutDashboard, PlusCircle, Upload,
    MapPin, MessageSquare, User, Building2, Archive
} from 'lucide-react';

const NAV = [
    { path: '/client', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { path: '/client/register', label: 'Register Business', icon: <PlusCircle size={18} /> },
    { path: '/client/documents', label: 'Upload Documents', icon: <Upload size={18} /> },
    { path: '/client/track', label: 'Track Application', icon: <MapPin size={18} /> },
    { path: '/client/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { path: '/client/profile', label: 'Profile', icon: <User size={18} /> },
    { path: '/client/company', label: 'My Company', icon: <Building2 size={18} /> },
    { path: '/client/vault', label: 'Document Vault', icon: <Archive size={18} /> },
];

const PAGE_TITLES = {
    '/client': 'Dashboard',
    '/client/register': 'Register a Business',
    '/client/documents': 'Upload Documents',
    '/client/track': 'Track Application',
    '/client/messages': 'Messages',
    '/client/profile': 'My Profile',
};

export default function ClientLayout() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || 'Client Portal';

    return (
        <div className="portal-layout">
            <Sidebar navItems={NAV} portalLabel="Client Portal" avatarColor="#0891b2" />
            <div className="portal-main">
                <TopBar title={title} />
                <main className="portal-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
