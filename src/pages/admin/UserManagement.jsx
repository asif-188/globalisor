import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { Search } from 'lucide-react';

export default function UserManagement() {
    const { db } = useAppData();
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const clients = db.users.filter(u => u.role === 'client' && !u.deleted_at)
        .filter(u => {
            const q = search.toLowerCase();
            const matchesSearch = u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

            let matchesDate = true;
            if (startDate || endDate) {
                const createdDate = new Date(u.created_at);
                if (startDate) matchesDate = matchesDate && createdDate >= new Date(startDate);
                if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    matchesDate = matchesDate && createdDate <= end;
                }
            }

            return matchesSearch && matchesDate;
        });

    const getAppCount = (userId) =>
        db.applications.filter(a => a.client_user_id === userId).length;

    const getLatestApp = (userId) =>
        db.applications.filter(a => a.client_user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Users</h1>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="filter-bar">
                        <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
                            <Search size={14} style={{ color: 'var(--grey-400)' }} />
                            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>From:</span>
                            <input type="date" className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontWeight: 500, fontSize: '0.8rem' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>To:</span>
                            <input type="date" className="btn btn-outline btn-sm" style={{ padding: '6px 10px', fontWeight: 500, fontSize: '0.8rem' }} value={endDate} onChange={e => setEndDate(e.target.value)} />
                            {(startDate || endDate) && (
                                <button className="btn btn-ghost btn-sm" onClick={() => { setStartDate(''); setEndDate(''); }} style={{ color: '#dc2626', padding: '4px 8px' }}>
                                    Clear
                                </button>
                            )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 'auto' }}>{clients.length} clients</div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Client</th><th>Email</th><th>Phone</th><th>Applications</th><th>Latest Status</th><th>Joined</th><th>Account</th></tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 && (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>No clients found</td></tr>
                            )}
                            {clients.map(c => {
                                const latestApp = getLatestApp(c.user_id);
                                return (
                                    <tr key={c.user_id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.avatar_color || '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                                    {c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.full_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{c.email}</td>
                                        <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{c.phone || '—'}</td>
                                        <td style={{ fontWeight: 700, color: '#1a56db', textAlign: 'center' }}>{getAppCount(c.user_id)}</td>
                                        <td>
                                            {latestApp
                                                ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{latestApp.status}</span>
                                                : <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>No applications</span>}
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{c.created_at?.slice(0, 10) || '—'}</td>
                                        <td>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                                background: c.status === 'active' ? '#d1fae5' : '#f3f4f6',
                                                color: c.status === 'active' ? '#065f46' : '#6b7280',
                                            }}>{c.status}</span>
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
