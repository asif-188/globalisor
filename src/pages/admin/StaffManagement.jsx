import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserPlus, Trash2, Search } from 'lucide-react';

export default function StaffManagement() {
    const { db, addStaffMember } = useAppData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '' });

    // All staff from shared users table
    const staffUsers = db.users.filter(u => u.role === 'staff' && !u.deleted_at)
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

    const handleAdd = () => {
        if (!form.fullName || !form.email) return;
        addStaffMember({ fullName: form.fullName, email: form.email, phone: form.phone });
        setForm({ fullName: '', email: '', phone: '' });
        setShowModal(false);
    };

    const getAssignedCount = (staffId) =>
        db.applications.filter(a => a.assigned_staff_id === staffId && a.status !== 'Completed').length;

    const getCompletedCount = (staffId) =>
        db.applications.filter(a => a.assigned_staff_id === staffId && a.status === 'Completed').length;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Staff</h1>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="filter-bar">
                        <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
                            <Search size={14} style={{ color: 'var(--grey-400)' }} />
                            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginRight: 'auto' }}>
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
                        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                            <UserPlus size={14} /> Add Staff
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Active Cases</th><th>Completed</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {staffUsers.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>No staff found</td></tr>
                            )}
                            {staffUsers.map(s => (
                                <tr key={s.user_id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.avatar_color || '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                                {s.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.full_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.email}</td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.phone || '—'}</td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: '#1a56db' }}>{getAssignedCount(s.user_id)}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700, color: '#059669' }}>{getCompletedCount(s.user_id)}</span>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                            background: s.status === 'active' ? '#d1fae5' : '#f3f4f6',
                                            color: s.status === 'active' ? '#065f46' : '#6b7280',
                                        }}>{s.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">Add Staff Member</div>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-input" placeholder="e.g. David Wong" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input className="form-input" type="email" placeholder="e.g. david@globalisor.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" placeholder="+65 8xxx xxxx" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div className="flex gap-3">
                            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}>
                                <UserPlus size={14} /> Add Staff
                            </button>
                            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
