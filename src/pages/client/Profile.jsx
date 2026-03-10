import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Save, User, Lock } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        fullName: 'Raj Entrepreneur',
        email: user?.email || '',
        phone: '+65 9123 4567',
        nationality: 'Indian',
        address: '12 Orchard Road, Singapore 238801',
        dob: '1985-04-12',
    });
    const [saved, setSaved] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">My Profile</h1>
            </div>

            {/* Avatar */}
            <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0891b2, #1a56db)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0,
                }}>
                    {form.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>{form.fullName}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{form.email}</div>
                    <div style={{ marginTop: 6 }}><span className="badge badge-active">Client Portal</span></div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Personal Info */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <User size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">Personal Information</div>
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Full Name</label>
                        <input className="form-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className="form-group"><label className="form-label">Email Address</label>
                        <input className="form-input" type="email" value={form.email} disabled style={{ background: '#f9fafb', color: '#9ca3af' }} />
                    </div>
                    <div className="form-row">
                        <div className="form-group"><label className="form-label">Phone</label>
                            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group"><label className="form-label">Date of Birth</label>
                            <input className="form-input" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Nationality</label>
                        <input className="form-input" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} />
                    </div>
                    <div className="form-group"><label className="form-label">Residential Address</label>
                        <textarea className="form-textarea" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>

                {/* Change Password */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Lock size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">Change Password</div>
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Current Password</label>
                        <input className="form-input" type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} />
                    </div>
                    <div className="form-group"><label className="form-label">New Password</label>
                        <input className="form-input" type="password" placeholder="Min 8 characters" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} />
                    </div>
                    <div className="form-group"><label className="form-label">Confirm New Password</label>
                        <input className="form-input" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
                    </div>
                    <button className="btn btn-outline">
                        <Lock size={15} /> Update Password
                    </button>

                    {/* Account Info */}
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: 12 }}>Account Information</div>
                        {[
                            ['Account Type', 'Client'],
                            ['KYC Status', 'KYC Review'],
                            ['Member Since', '2026-03-01'],
                            ['Last Login', '2026-03-09 10:38'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                                <span style={{ color: '#6b7280' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#374151' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
