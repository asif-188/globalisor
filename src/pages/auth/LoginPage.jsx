import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GlobalisorLogo, GlobalisorLogoIcon } from '../../components/shared/GlobalisorLogo.jsx';


export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const result = login(form.email, form.password);
            if (result.success) {
                navigate(result.redirect, { replace: true });
            } else {
                setError(result.error);
                setLoading(false);
            }
        }, 600);
    };

    const quickLogin = (email) => {
        setForm({ email, password: 'demo123' });
    };

    const DEMO_ACCOUNTS = [
        { label: 'Admin', email: 'admin@globalisor.com', color: '#0055a4' },
        { label: 'Staff', email: 'staff@globalisor.com', color: '#7c3aed' },
        { label: 'Client', email: 'user@globalisor.com', color: '#0891b2' },
    ];

    const getPortalType = () => {
        if (!form.email) return 'Secure Login Server';
        if (form.email.includes('admin')) return 'Admin Portal';
        if (form.email.includes('staff')) return 'Staff Portal';
        return 'Client Portal';
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(135deg, rgba(10,35,64,0.88) 0%, rgba(10,35,64,0.74) 55%, rgba(0,92,156,0.62) 100%), url(/assets/singapore_bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Inter, sans-serif',
        }}>

            {/* Left side content (visible on wide screens) */}
            <div style={{ flex: 1, maxWidth: 500, marginRight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="login-left-panel">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                    <GlobalisorLogo variant="dark" size="md" />
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>
                    Start and Manage Your Business in Singapore
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', lineHeight: 1.75, marginBottom: 32 }}>
                    New generation corporate services for entrepreneurs. ACRA registered, MAS compliant.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {['Company Incorporation', 'KYC Verification', 'Compliance Management', 'ACRA Submission Tracking'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CheckCircle2 size={16} color="#00a3e0" />
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Login Card */}
            <div style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                boxShadow: '0 32px 64px rgba(0,0,0,0.35)',
                padding: '40px',
                width: '100%',
                maxWidth: 440,
                flexShrink: 0,
            }}>
                {/* Card logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.12)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(10,35,64,0.2)' }}>
                        <GlobalisorLogoIcon size={40} />
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, marginBottom: 12 }}>
                        <ShieldCheck size={14} /> {getPortalType()}
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a2340', letterSpacing: '-0.02em' }}>Welcome Back</h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>Sign in to access your Globalisor portal</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            background: '#fee2e2', padding: '12px 14px', borderRadius: 8,
                            marginBottom: 16, color: '#991b1b', fontSize: '0.875rem',
                        }}>
                            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                            <input
                                type="email" className="form-input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                style={{ paddingLeft: 38 }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <a href="#" style={{ fontSize: '0.8rem', color: '#0055a4', fontWeight: 500, textDecoration: 'none' }}>Forgot Password?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                            <input
                                type="password" className="form-input"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={{ paddingLeft: 38 }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%', justifyContent: 'center', padding: '13px',
                            fontSize: '1rem', fontWeight: 700, marginTop: 8, borderRadius: 9,
                            background: loading ? '#6b8db8' : 'linear-gradient(135deg, #0a2340, #0055a4)',
                            color: 'white', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 6px 20px rgba(10,35,64,0.4)',
                            transition: 'all 200ms',
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In…' : <><span>Sign In</span> <ArrowRight size={16} /></>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: '#6b7280', fontSize: '0.75rem' }}>
                        <Lock size={12} color="#10b981" />
                        <span>Your login is protected with secure 256-bit encryption.</span>
                    </div>
                </form>

                {/* Demo Accounts */}
                <div style={{ marginTop: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Demo Access</span>
                        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {DEMO_ACCOUNTS.map(acc => (
                            <button
                                key={acc.email}
                                onClick={() => quickLogin(acc.email)}
                                style={{
                                    flex: 1, padding: '9px 6px', borderRadius: 8,
                                    border: `1.5px solid ${acc.color}30`,
                                    background: `${acc.color}08`,
                                    color: acc.color, fontSize: '0.78rem', fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 150ms',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = `${acc.color}18`; e.currentTarget.style.borderColor = `${acc.color}60`; }}
                                onMouseOut={e => { e.currentTarget.style.background = `${acc.color}08`; e.currentTarget.style.borderColor = `${acc.color}30`; }}
                            >
                                {acc.label}
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>Click a role to autofill credentials, then Sign In</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <a href="/" style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none' }}>← Back to website</a>
                </div>
            </div>
        </div>
    );
}
