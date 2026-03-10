import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { Search, Send, FilePlus, Calendar } from 'lucide-react';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';

const STATUSES = ['All', 'New', 'KYC Review', 'Pending Documents', 'In Progress', 'Submitted to ACRA', 'Completed', 'Rejected'];

export default function ApplicationQueue() {
    const { getApplicationsForUser, updateApplicationStatus } = useAppData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const myApps = getApplicationsForUser(user?.id, 'staff');

    const filtered = myApps.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = a.application_id.toLowerCase().includes(q) ||
            a.business_name.toLowerCase().includes(q) ||
            (a.client_name || '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || a.status === statusFilter;

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

        return matchSearch && matchStatus && matchDate;
    });

    return (
        <div>
            <div className="page-header">
                <h1>Application Queue</h1>
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
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client / Business</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Docs/KYC</th>
                                <th>Status</th>
                                <th>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No applications in your queue</td></tr>
                            )}
                            {filtered.map(a => {
                                // Calculate simple deadline based on priority (mocking)
                                const deadlineDate = new Date(a.created_at);
                                let daysToAdd = a.priority === 'Emergency' ? 2 : a.priority === 'High' ? 5 : 14;
                                deadlineDate.setDate(deadlineDate.getDate() + daysToAdd);
                                const isOverdue = deadlineDate < new Date() && !['Completed', 'Rejected'].includes(a.status);

                                return (
                                    <tr key={a.application_id}>
                                        <td><span style={{ fontWeight: 700, color: '#1a56db', fontSize: '0.8rem' }}>{a.application_id}</span></td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#111827' }}>{a.business_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{a.client_name}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                                background: a.priority === 'Emergency' ? '#fdf2f8' : a.priority === 'High' ? '#fee2e2' : '#f3f4f6',
                                                color: a.priority === 'Emergency' ? '#9d174d' : a.priority === 'High' ? '#dc2626' : '#6b7280',
                                            }}>{a.priority || 'Standard'}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: isOverdue ? '#dc2626' : '#4b5563', fontSize: '0.8rem', fontWeight: isOverdue ? 600 : 400 }}>
                                                <Calendar size={14} />
                                                {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem', marginBottom: 2 }}>KYC: {a.kyc_status || '—'}</div>
                                            <div style={{ fontSize: '0.8rem', color: a.pending_docs > 0 ? '#d97706' : '#059669', fontWeight: 500 }}>
                                                {a.pending_docs > 0 ? `${a.pending_docs} Docs Pending` : 'All Docs OK'}
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                className="select-filter"
                                                style={{ fontSize: '0.75rem', padding: '3px 6px', maxWidth: 130 }}
                                                value={a.status}
                                                onChange={e => updateApplicationStatus(a.application_id, e.target.value, user?.id)}
                                            >
                                                {STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="Request Follow-up">
                                                    <Send size={14} />
                                                </button>
                                                <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="Request Docs">
                                                    <FilePlus size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
