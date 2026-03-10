import React, { useState } from 'react';
import { Save, Globe, Bell, Shield, Mail } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        companyName: 'Globalisor Pte. Ltd.',
        supportEmail: 'support@globalisor.com',
        acraCode: 'GBLSR-2024-SG',
        appNotifications: true,
        emailNotifications: true,
        kycAlerts: true,
        complianceAlerts: true,
        twoFactor: false,
        sessionTimeout: '30',
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

    const Toggle = ({ val, onToggle }) => (
        <div
            onClick={onToggle}
            style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: val ? '#1a56db' : '#d1d5db',
                position: 'relative', transition: 'background 200ms',
            }}
        >
            <div style={{
                width: 18, height: 18, background: 'white', borderRadius: '50%',
                position: 'absolute', top: 3, left: val ? 23 : 3,
                transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
        </div>
    );

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* General */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Globe size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">General</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input className="form-input" value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Support Email</label>
                        <input className="form-input" type="email" value={settings.supportEmail} onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">ACRA Registration Code</label>
                        <input className="form-input" value={settings.acraCode} onChange={e => setSettings(s => ({ ...s, acraCode: e.target.value }))} />
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Bell size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">Notifications</div>
                        </div>
                    </div>
                    {[
                        { key: 'appNotifications', label: 'Application Updates' },
                        { key: 'emailNotifications', label: 'Email Notifications' },
                        { key: 'kycAlerts', label: 'KYC Alerts' },
                        { key: 'complianceAlerts', label: 'Compliance Alerts' },
                    ].map(n => (
                        <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{n.label}</div>
                            </div>
                            <Toggle val={settings[n.key]} onToggle={() => toggle(n.key)} />
                        </div>
                    ))}
                </div>

                {/* Security */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Shield size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">Security</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Two-Factor Authentication</div>
                        </div>
                        <Toggle val={settings.twoFactor} onToggle={() => toggle('twoFactor')} />
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                        <label className="form-label">Session Timeout (minutes)</label>
                        <select className="form-select" value={settings.sessionTimeout} onChange={e => setSettings(s => ({ ...s, sessionTimeout: e.target.value }))}>
                            {['15', '30', '60', '120'].map(t => <option key={t} value={t}>{t} minutes</option>)}
                        </select>
                    </div>
                </div>

                {/* Email Templates */}
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Mail size={18} style={{ color: 'var(--primary)' }} />
                            <div className="card-title">Email Templates</div>
                        </div>
                    </div>
                    {['Application Received', 'Documents Required', 'KYC Approved', 'Application Approved', 'Company Registered'].map(t => (
                        <div key={t} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 0', borderBottom: '1px solid #f3f4f6',
                        }}>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{t}</span>
                            <button className="btn btn-ghost btn-sm" style={{ color: '#1a56db' }}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
