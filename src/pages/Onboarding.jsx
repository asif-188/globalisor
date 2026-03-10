import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        nationality: '',
        docType: 'Passport',
    });

    const nextStep = () => {
        if (step === 1 && !formData.fullName) {
            alert('Official Full Name is required for ACRA compliance.');
            return;
        }
        setStep(s => s + 1);
    };
    const prevStep = () => setStep(s => s - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="page-content">
            <header className="onboarding-header">
                <span className="breadcrumb">Onboarding / New Client Enrollment</span>
                <h1>Entity Onboarding</h1>
                <p className="text-muted">Standardized Singapore KYC and document collection workflow.</p>
            </header>

            <div className="onboarding-container">
                <div className="stepper-sidebar">
                    {[1, 2, 3].map(item => (
                        <div key={item} className={`step-nav-item ${step === item ? 'active' : ''} ${step > item ? 'completed' : ''}`}>
                            <div className="step-nav-circle">
                                {step > item ? '✓' : item}
                            </div>
                            <div className="step-nav-text">
                                <p className="step-nav-label">Step {item}</p>
                                <p className="step-nav-title">
                                    {item === 1 ? 'Personal Profile' : item === 2 ? 'Identity Verification' : 'Compliance Review'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="onboarding-content">
                    <div className="card onboarding-card">
                        {step === 1 && (
                            <div className="form-section">
                                <h3 className="mb-6">Personal Profile</h3>
                                <div className="form-grid">
                                    <div className="input-field full-width">
                                        <label>Full Legal Name (as per Passport)</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="e.g. TAN AH KOW"
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tan.ahkow@example.sg"
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+65 9XXX XXXX"
                                            className="premium-input"
                                        />
                                    </div>
                                    <div className="input-field full-width">
                                        <label>Nationality / Residency Status</label>
                                        <select name="nationality" value={formData.nationality} onChange={handleChange} className="premium-input">
                                            <option value="">Select Status</option>
                                            <option value="Singapore Citizen">Singapore Citizen</option>
                                            <option value="PR">Permanent Resident (PR)</option>
                                            <option value="Employment Pass">Employment Pass (EP)</option>
                                            <option value="Other">Foreign National</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-section">
                                <h3 className="mb-6">Identity Verification (KYC)</h3>
                                <div className="kyc-notice">
                                    <p>Under ACRA regulations, we must verify the identity of all entity officers.</p>
                                </div>
                                <div className="upload-grid mt-6">
                                    <div className="upload-item">
                                        <div className="upload-icon">🪪</div>
                                        <div className="upload-info">
                                            <p className="upload-label">Primary ID Document</p>
                                            <p className="upload-hint">Passport or NRIC (Color Copy)</p>
                                        </div>
                                        <button className="btn btn-outline btn-sm">Attach File</button>
                                    </div>
                                    <div className="upload-item">
                                        <div className="upload-icon">🧾</div>
                                        <div className="upload-info">
                                            <p className="upload-label">Proof of Residency</p>
                                            <p className="upload-hint">Utility Bill or Bank Statement</p>
                                        </div>
                                        <button className="btn btn-outline btn-sm">Attach File</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-section">
                                <h3 className="mb-6">Compliance Review</h3>
                                <div className="review-summary">
                                    <div className="review-row">
                                        <span className="review-label">Name</span>
                                        <span className="review-value">{formData.fullName}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Email</span>
                                        <span className="review-value">{formData.email}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Status</span>
                                        <span className="review-value">{formData.nationality}</span>
                                    </div>
                                </div>
                                <div className="declaration mt-6">
                                    <label className="flex items-center gap-2 checkbox-label">
                                        <input type="checkbox" />
                                        <span>I declare that the information provided is accurate for ACRA filing purpose.</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="onboarding-footer mt-8 pt-6 border-t flex justify-between">
                            <button
                                className="btn btn-light"
                                onClick={prevStep}
                                disabled={step === 1}
                                style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                            >
                                Back
                            </button>
                            <button className="btn btn-primary" onClick={step === 3 ? () => onComplete(formData) : nextStep}>
                                {step === 3 ? 'Authorize & Submit' : 'Continue to Next Step'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .onboarding-header { margin-bottom: 4rem; }
        .breadcrumb { font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.5rem; }
        
        .onboarding-container { display: flex; gap: 4rem; }
        .stepper-sidebar { width: 220px; flex-shrink: 0; }
        .onboarding-content { flex: 1; max-width: 800px; }
        
        .step-nav-item { display: flex; gap: 1rem; margin-bottom: 2.5rem; position: relative; }
        .step-nav-item:not(:last-child)::after {
            content: ''; position: absolute; left: 16px; top: 40px; height: 36px; width: 2px;
            background: var(--border);
        }
        .step-nav-item.completed:not(:last-child)::after { background: var(--secondary); }
        
        .step-nav-circle {
            width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 0.8rem; background: white; transition: all 0.3s;
        }
        .step-nav-item.active .step-nav-circle { border-color: var(--primary); background: var(--primary); color: white; }
        .step-nav-item.completed .step-nav-circle { border-color: var(--secondary); background: var(--secondary); color: white; }
        
        .step-nav-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px; }
        .step-nav-title { font-size: 0.9rem; font-weight: 700; color: var(--text-muted); }
        .step-nav-item.active .step-nav-title { color: var(--text-bold); }
        
        .onboarding-card { padding: 3rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .full-width { grid-column: span 2; }
        
        .premium-input {
            width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--border); border-radius: 8px;
            background: #F8FAFC; font-size: 0.95rem; transition: border-color 0.2s;
        }
        .premium-input:focus { outline: none; border-color: var(--accent); background: white; }
        
        .kyc-notice { background: #F1F5F9; padding: 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500; color: var(--text-main); }
        .upload-item { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 1rem; }
        .upload-icon { font-size: 1.5rem; }
        .upload-label { font-weight: 700; font-size: 0.9rem; margin-bottom: 2px; }
        .upload-hint { font-size: 0.75rem; color: var(--text-muted); }
        
        .review-summary { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .review-row { display: flex; justify-content: space-between; padding: 1.25rem; background: white; border-bottom: 1px solid var(--border); }
        .review-row:last-child { border-bottom: none; }
        .review-label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
        .review-value { font-size: 0.85rem; font-weight: 700; color: var(--text-bold); }
        
        .checkbox-label { font-size: 0.85rem; font-weight: 500; color: var(--text-main); }
        .btn-light { background: #F1F5F9; color: var(--text-main); }
        .border-t { border-top: 1px solid var(--border); }
        .pt-6 { padding-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }
      `}} />
        </div>
    );
};

export default Onboarding;
