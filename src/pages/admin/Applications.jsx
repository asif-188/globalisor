import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { Search, Download } from 'lucide-react';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';

const STATUSES = ['All', 'New', 'KYC Review', 'Pending Documents', 'In Progress', 'Submitted to ACRA', 'Completed', 'Rejected'];
const PRIORITIES = ['All', 'Normal', 'High', 'Emergency'];

export default function Applications() {
    const { getApplicationsForUser, updateApplicationStatus, assignStaff, db } = useAppData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');

    const handleRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const applications = getApplicationsForUser(user?.id, 'admin');
    const staffUsers = db.users.filter(u => u.role === 'staff' && u.status === 'active');

    const filtered = applications.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = a.application_id.toLowerCase().includes(q) ||
            a.business_name.toLowerCase().includes(q) ||
            (a.client_name || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;
        const matchPriority = priorityFilter === 'All' || a.priority === priorityFilter;

        let matchDate = true;
        if (startDate || endDate) {
            const createdDate = new Date(a.created_at);
            if (startDate) matchDate = matchDate && createdDate >= new Date(startDate);
            if (endDate) {
                const endLimit = new Date(endDate);
                endLimit.setHours(23, 59, 59, 999);
                matchDate = matchDate && createdDate <= endLimit;
            }
        }

        return matchSearch && matchStatus && matchPriority && matchDate;
    });

    const handleAssign = () => {
        if (selectedApp && selectedStaff) {
            assignStaff(selectedApp.application_id, selectedStaff, user?.id);
            setShowAssignModal(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>All Applications</h1>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="filter-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
                        <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
                            <Search size={14} style={{ color: 'var(--grey-400)' }} />
                            <input placeholder="Search by ID, business, client..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <DateRangeFilter 
                                startDate={startDate} 
                                endDate={endDate} 
                                onRangeChange={handleRangeChange} 
                            />
                        </div>
                        <select className="select-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <select className="select-filter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                        </select>
                        <button className="btn btn-ghost btn-sm"><Download size={14} /> Export</button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>ID</th><th>Business</th><th>Client</th><th>Staff</th><th>Status</th><th>Priority</th><th>KYC</th><th>Docs</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.application_id}>
                                    <td><span style={{ fontWeight: 700, color: '#1a56db', fontSize: '0.8rem' }}>{a.application_id}</span></td>
                                    <td style={{ fontWeight: 600 }}>{a.business_name}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{a.client_name}</td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {a.staff_name
                                            ? <span style={{ color: '#059669' }}>{a.staff_name}</span>
                                            : <span style={{ color: '#9ca3af' }}>Unassigned</span>}
                                    </td>
                                    <td>
                                        <select
                                            className="select-filter"
                                            style={{ fontSize: '0.75rem', padding: '3px 6px' }}
                                            value={a.status}
                                            onChange={e => updateApplicationStatus(a.application_id, e.target.value, user?.id)}
                                        >
                                            {STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                            background: a.priority === 'Emergency' ? '#fdf2f8' : a.priority === 'High' ? '#fee2e2' : '#f3f4f6',
                                            color: a.priority === 'Emergency' ? '#9d174d' : a.priority === 'High' ? '#dc2626' : '#6b7280',
                                        }}>{a.priority}</span>
                                    </td>
                                    <td>
                                        {a.kyc_status
                                            ? <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{a.kyc_status}</span>
                                            : <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>—</span>}
                                    </td>
                                    <td style={{ fontSize: '0.8rem' }}>{a.pending_docs > 0 ? <span style={{ color: '#d97706', fontWeight: 600 }}>{a.pending_docs} pending</span> : <span style={{ color: '#059669' }}>{a.total_docs} ok</span>}</td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" onClick={() => { setSelectedApp(a); setSelectedStaff(a.assigned_staff_id || ''); setShowAssignModal(true); }}>
                                            {a.assigned_staff_id ? 'Reassign' : 'Assign'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No applications found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAssignModal && selectedApp && (
                <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Assign Staff — {selectedApp.application_id}</div>
                            <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Select Staff Member</label>
                            <select className="form-select" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                                <option value="">— Choose staff —</option>
                                {staffUsers.map(s => <option key={s.user_id} value={s.user_id}>{s.full_name}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAssign}>Confirm Assignment</button>
                            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAssignModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
