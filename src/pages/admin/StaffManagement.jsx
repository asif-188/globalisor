import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserPlus, Trash2, Search, Edit2, AlertTriangle, X } from 'lucide-react';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';

export default function StaffManagement() {
    const { db, addStaffMember, updateStaffMember, deleteStaffMember } = useAppData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Modals
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [deletingStaff, setDeletingStaff] = useState(null);
    
    const [form, setForm] = useState({ fullName: '', email: '', phone: '' });

    const handleRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const staffUsers = db.users.filter(u => u.role === 'staff' && !u.deleted_at)
        .filter(u => {
            const q = search.toLowerCase();
            const matchesSearch = (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);

            let matchesDate = true;
            if (startDate || endDate) {
                const createdDate = new Date(u.created_at);
                if (startDate) matchesDate = matchesDate && createdDate >= new Date(startDate);
                if (endDate) {
                    const endLimit = new Date(endDate);
                    endLimit.setHours(23, 59, 59, 999);
                    matchesDate = matchesDate && createdDate <= endLimit;
                }
            }
            return matchesSearch && matchesDate;
        });

    const openStaffModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setForm({ fullName: staff.full_name, email: staff.email, phone: staff.phone });
        } else {
            setEditingStaff(null);
            setForm({ fullName: '', email: '', phone: '' });
        }
        setShowStaffModal(true);
    };

    const handleSubmit = () => {
        if (!form.fullName || !form.email) return;
        if (editingStaff) {
            updateStaffMember(editingStaff.user_id, form);
        } else {
            addStaffMember(form);
        }
        setShowStaffModal(false);
    };

    const confirmDelete = (staff) => {
        setDeletingStaff(staff);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deletingStaff) {
            deleteStaffMember(deletingStaff.user_id);
            setShowDeleteModal(false);
            setDeletingStaff(null);
        }
    };

    const getAssignedCount = (staffId) =>
        db.applications.filter(a => a.assigned_staff_id === staffId && a.status !== 'Completed').length;

    const getCompletedCount = (staffId) =>
        db.applications.filter(a => a.assigned_staff_id === staffId && a.status === 'Completed').length;

    return (
        <div>
            <div className="page-header">
                <h1>Staff Management</h1>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="filter-bar">
                        <div className="search-input" style={{ flex: 1, minWidth: 200 }}>
                            <Search size={14} style={{ color: 'var(--grey-400)' }} />
                            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <DateRangeFilter 
                                startDate={startDate} 
                                endDate={endDate} 
                                onRangeChange={handleRangeChange} 
                            />
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => openStaffModal()}>
                            <UserPlus size={14} /> Add Staff
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined</th>
                                <th>Active Cases</th>
                                <th>Completed</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffUsers.length === 0 && (
                                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>No staff found</td></tr>
                            )}
                            {staffUsers.map(s => (
                                <tr key={s.user_id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.avatar_color || '#1a56db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                                {s.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.full_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.email}</td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{s.phone || '—'}</td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
                                        {s.created_at ? new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </td>
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
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                            <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => openStaffModal(s)} title="Edit Staff">
                                                <Edit2 size={14} style={{ color: '#4b5563' }} />
                                            </button>
                                            <button className="btn btn-ghost btn-sm" style={{ padding: 6 }} onClick={() => confirmDelete(s)} title="Delete Staff">
                                                <Trash2 size={14} style={{ color: '#dc2626' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showStaffModal && (
                <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</div>
                            <button className="modal-close" onClick={() => setShowStaffModal(false)}><X size={18} /></button>
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
                            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSubmit}>
                                {editingStaff ? 'Update Staff' : 'Add Staff'}
                            </button>
                            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowStaffModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal (Two-Step Protection) */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <div style={{ width: 48, height: 48, background: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <AlertTriangle size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>Confirm Deletion</h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 24 }}>
                                Are you sure you want to delete <strong>{deletingStaff?.full_name}</strong>? This action will deactivate their account.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626', color: 'white' }} onClick={handleDelete}>
                                Yes, Confirm Delete
                            </button>
                            <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                                No, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
