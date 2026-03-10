import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Upload, Building2, User, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const STEPS = ['Business Details', 'Director Info', 'KYC Form', 'Documents', 'Review'];

function StepBar({ current }) {
    return (
        <div className="step-indicator">
            {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                    <div className={`step-dot ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
                        {i < current ? <Check size={11} strokeWidth={3} /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function RegisterBusiness() {
    const navigate = useNavigate();
    const { submitApplication } = useAppData();
    const { user } = useAuth();
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [newAppId, setNewAppId] = useState(null);

    const [bizForm, setBizForm] = useState({
        type: 'Private Limited (Pte. Ltd.)', name: '', nature: '', address: '', capital: '1000', currency: 'SGD',
    });
    const [dirForm, setDirForm] = useState({
        name: '', nationality: '', passport: '', address: '', appointment: '',
    });
    const [kycForm, setKycForm] = useState({
        fullName: '', gender: '', dob: '', nationality: '', address: '', passportId: '', expiry: '',
    });
    const [docs, setDocs] = useState({ passport: false, addressProof: false, selfie: false });

    const next = () => { if (step < STEPS.length - 1) setStep(step + 1); };
    const prev = () => { if (step > 0) setStep(step - 1); };

    const handleSubmit = () => {
        // Write to shared AppContext — immediately visible in Admin + Staff portals
        const appId = submitApplication(user?.id, {
            businessName: bizForm.name || 'New Company Pte. Ltd.',
            businessType: bizForm.type,
            natureOfBusiness: bizForm.nature,
            registeredAddress: bizForm.address,
            shareCapital: bizForm.capital,
            currency: bizForm.currency,
        });
        setNewAppId(appId);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '64px 24px' }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: '#d1fae5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                }}>
                    <CheckCircle size={40} color="#059669" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                    Application Submitted!
                </h2>
                <p style={{ color: '#6b7280', maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
                    Your application for <strong>{bizForm.name || 'your company'}</strong> has been received.
                    Our team will review it and contact you shortly.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary" onClick={() => navigate('/client/track')}>
                        <ArrowRight size={16} /> Track Application
                    </button>
                    <button className="btn btn-ghost" onClick={() => navigate('/client')}>Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <StepBar current={step} />

                <div className="card">
                    {/* Step 0: Business Details */}
                    {step === 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <Building2 size={20} color="#1a56db" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Business Information</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Business Type *</label>
                                <select className="form-select" value={bizForm.type} onChange={e => setBizForm({ ...bizForm, type: e.target.value })}>
                                    {['Private Limited (Pte. Ltd.)', 'Sole Proprietorship', 'Partnership', 'Limited Liability Partnership (LLP)'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Proposed Business Name *</label>
                                <input className="form-input" placeholder="e.g. TechNova" value={bizForm.name} onChange={e => setBizForm({ ...bizForm, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nature of Business *</label>
                                <input className="form-input" placeholder="e.g. Software Development & IT Consulting" value={bizForm.nature} onChange={e => setBizForm({ ...bizForm, nature: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Registered Address *</label>
                                <textarea className="form-textarea" placeholder="Full Singapore address" value={bizForm.address} onChange={e => setBizForm({ ...bizForm, address: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Share Capital</label>
                                    <input className="form-input" type="number" value={bizForm.capital} onChange={e => setBizForm({ ...bizForm, capital: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Currency</label>
                                    <select className="form-select" value={bizForm.currency} onChange={e => setBizForm({ ...bizForm, currency: e.target.value })}>
                                        <option>SGD</option><option>USD</option><option>EUR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Director */}
                    {step === 1 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <User size={20} color="#7c3aed" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Director Details</h3>
                            </div>
                            {[
                                { key: 'name', label: 'Director Full Name *', placeholder: 'As shown on passport' },
                                { key: 'nationality', label: 'Nationality *', placeholder: 'e.g. Singaporean, Indian, British' },
                                { key: 'passport', label: 'Passport Number *', placeholder: 'e.g. A12345678' },
                                { key: 'address', label: 'Residential Address *', placeholder: 'Full address including country' },
                                { key: 'appointment', label: 'Date of Appointment *', placeholder: '', type: 'date' },
                            ].map(f => (
                                <div className="form-group" key={f.key}>
                                    <label className="form-label">{f.label}</label>
                                    <input
                                        className="form-input"
                                        type={f.type || 'text'}
                                        placeholder={f.placeholder}
                                        value={dirForm[f.key]}
                                        onChange={e => setDirForm({ ...dirForm, [f.key]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 2: KYC */}
                    {step === 2 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <ShieldCheck size={20} color="#059669" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Identity Verification</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input className="form-input" placeholder="As per ID" value={kycForm.fullName} onChange={e => setKycForm({ ...kycForm, fullName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender *</label>
                                    <select className="form-select" value={kycForm.gender} onChange={e => setKycForm({ ...kycForm, gender: e.target.value })}>
                                        <option value="">Select</option>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Date of Birth *</label>
                                    <input className="form-input" type="date" value={kycForm.dob} onChange={e => setKycForm({ ...kycForm, dob: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nationality *</label>
                                    <input className="form-input" placeholder="e.g. Indian" value={kycForm.nationality} onChange={e => setKycForm({ ...kycForm, nationality: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Residential Address *</label>
                                <textarea className="form-textarea" value={kycForm.address} onChange={e => setKycForm({ ...kycForm, address: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Passport / ID Number *</label>
                                    <input className="form-input" value={kycForm.passportId} onChange={e => setKycForm({ ...kycForm, passportId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ID Expiry Date *</label>
                                    <input className="form-input" type="date" value={kycForm.expiry} onChange={e => setKycForm({ ...kycForm, expiry: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {step === 3 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <Upload size={20} color="#d97706" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Document Upload</h3>
                            </div>
                            {[
                                { key: 'passport', label: 'Passport Copy *' },
                                { key: 'addressProof', label: 'Address Proof *' },
                                { key: 'selfie', label: 'Selfie Verification *' },
                            ].map(d => (
                                <div key={d.key} style={{ marginBottom: 14 }}>
                                    <label className="form-label">{d.label}</label>
                                    <div
                                        className="upload-zone"
                                        style={docs[d.key] ? { borderColor: '#059669', background: '#d1fae5' } : {}}
                                        onClick={() => setDocs({ ...docs, [d.key]: true })}
                                    >
                                        <div className="upload-zone-icon">
                                            {docs[d.key] ? <CheckCircle size={22} color="#059669" /> : <Upload size={22} color="#1a56db" />}
                                        </div>
                                        <div className="upload-zone-title">
                                            {docs[d.key] ? 'File uploaded ✓' : 'Click to upload or drag and drop'}
                                        </div>
                                        <div className="upload-zone-sub" style={{ marginTop: 4, fontSize: '0.7rem' }}>PDF, JPG, PNG — max 10MB</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                                <FileText size={20} color="#1a56db" />
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Review & Submit</h3>
                            </div>
                            {[
                                {
                                    section: 'Business Details', items: [
                                        ['Type', bizForm.type], ['Name', bizForm.name || '—'], ['Nature', bizForm.nature || '—'],
                                        ['Address', bizForm.address || '—'], ['Share Capital', `${bizForm.currency} ${bizForm.capital}`],
                                    ]
                                },
                                {
                                    section: 'Director Details', items: [
                                        ['Name', dirForm.name || '—'], ['Nationality', dirForm.nationality || '—'],
                                        ['Passport', dirForm.passport || '—'], ['Appointment', dirForm.appointment || '—'],
                                    ]
                                },
                                {
                                    section: 'KYC Details', items: [
                                        ['Full Name', kycForm.fullName || '—'], ['Gender', kycForm.gender || '—'],
                                        ['DOB', kycForm.dob || '—'], ['Nationality', kycForm.nationality || '—'],
                                        ['Passport ID', kycForm.passportId || '—'],
                                    ]
                                },
                            ].map(sec => (
                                <div key={sec.section} style={{ marginBottom: 20 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                                        {sec.section}
                                    </div>
                                    {sec.items.map(([label, val]) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div style={{ background: '#e8f0fe', border: '1px solid #c7d9fe', borderRadius: 8, padding: '12px 16px', fontSize: '0.8rem', color: '#1e40af' }}>
                                By submitting, you confirm all information is accurate and authorize Globalisor to file on your behalf.
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                        <button className="btn btn-ghost" onClick={prev} disabled={step === 0}>
                            <ArrowLeft size={16} /> Previous
                        </button>
                        {step < STEPS.length - 1 ? (
                            <button className="btn btn-primary" onClick={next}>
                                Next Step <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleSubmit} style={{ background: '#059669' }}>
                                <CheckCircle size={16} /> Submit Application
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
