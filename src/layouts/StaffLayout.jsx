import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar.jsx';
import TopBar from '../components/shared/TopBar.jsx';
import {
    LayoutDashboard, List, ShieldCheck,
    FileText, MessageSquare, CheckCircle, Building2, Archive
} from 'lucide-react';

const NAV = [
    { path: '/staff', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { path: '/staff/queue', label: 'Application Queue', icon: <List size={18} /> },
    { path: '/staff/kyc', label: 'KYC Verification', icon: <ShieldCheck size={18} /> },
    { path: '/staff/documents', label: 'Document Review', icon: <FileText size={18} /> },
    { path: '/staff/followups', label: 'Client Follow-ups', icon: <MessageSquare size={18} /> },
    { path: '/staff/completed', label: 'Completed Tasks', icon: <CheckCircle size={18} /> },
    { path: '/staff/company/C001', label: 'Company Profiles', icon: <Building2 size={18} /> },
    { path: '/staff/vault/C001', label: 'Document Vault', icon: <Archive size={18} /> },
];

const PAGE_TITLES = {
    '/staff': 'Dashboard',
    '/staff/queue': 'Application Queue',
    '/staff/kyc': 'KYC Verification',
    '/staff/documents': 'Document Review',
    '/staff/followups': 'Client Follow-ups',
    '/staff/completed': 'Completed Tasks',
};

export default function StaffLayout() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || 'Staff Portal';

    return (
        <div className="portal-layout">
            <Sidebar navItems={NAV} portalLabel="Staff Portal" avatarColor="#7c3aed" />
            <div className="portal-main">
                <TopBar title={title} />
                <main className="portal-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
