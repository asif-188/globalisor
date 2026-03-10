import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar.jsx';
import TopBar from '../components/shared/TopBar.jsx';
import {
    LayoutDashboard, FolderOpen, Users, UserCheck,
    ShieldCheck, BarChart3, FileText, Settings, Building2, Archive
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const NAV = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { path: '/admin/applications', label: 'Applications', icon: <FolderOpen size={18} /> },
    { path: '/admin/staff', label: 'Staff', icon: <Users size={18} /> },
    { path: '/admin/users', label: 'Users', icon: <UserCheck size={18} /> },
    { path: '/admin/kyc', label: 'KYC Review', icon: <ShieldCheck size={18} /> },
    { path: '/admin/compliance', label: 'Compliance', icon: <BarChart3 size={18} /> },
    { path: '/admin/reports', label: 'Reports', icon: <FileText size={18} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
    { path: '/admin/company/C001', label: 'Company Profiles', icon: <Building2 size={18} /> },
    { path: '/admin/vault/C001', label: 'Document Vault', icon: <Archive size={18} /> },
];

const PAGE_TITLES = {
    '/admin': 'Dashboard',
    '/admin/applications': 'Applications',
    '/admin/staff': 'Staff',
    '/admin/users': 'Users',
    '/admin/kyc': 'KYC Review',
    '/admin/compliance': 'Compliance Monitoring',
    '/admin/reports': 'Reports',
    '/admin/settings': 'Settings',
};

export default function AdminLayout() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || 'Admin';

    return (
        <div className="portal-layout">
            <Sidebar navItems={NAV} portalLabel="Admin Portal" avatarColor="#1a56db" />
            <div className="portal-main">
                <TopBar title={title} />
                <main className="portal-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
