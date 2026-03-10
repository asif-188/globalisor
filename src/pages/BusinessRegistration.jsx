import React, { useState } from 'react';

const BusinessRegistration = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [ssic, setSsic] = useState('');

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <span className="breadcrumb">Services / Formation</span>
                    <h1>Business Registration</h1>
                    <p className="text-muted">Initiate name reservation and business entity setup with ACRA.</p>
                </div>
                <div className="header-actions">
                    <span className="badge badge-info">ACRA Status: Connected</span>
                </div>
            </header>

            <div className="grid-layout">
                <div className="main-col">
                    <div className="card registration-card">
                        <section className="form-section">
                            <div className="section-title">
                                <span className="step-badge">01</span>
                                <h3>Proposed Business Name</h3>
                            </div>
                            <div className="input-group-premium mt-6">
                                <label>Official Business Name</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Nexus Technology Solutions"
                                        className="premium-input flex-1"
                                    />
                                    <button className="btn btn-secondary" onClick={() => alert('Name is available!')}>Check Availability</button>
                                </div>
                                <p className="input-hint">Company names must be unique and comply with ACRA naming guidelines.</p>
                            </div>
                        </section>

                        <section className="form-section mt-10 pt-10 border-t">
                            <div className="section-title">
                                <span className="step-badge">02</span>
                                <h3>Business Activities</h3>
                            </div>
                            <div className="input-group-premium mt-6">
                                <label>Primary SSIC Code</label>
                                <select className="premium-input w-full" value={ssic} onChange={(e) => setSsic(e.target.value)}>
                                    <option value="">Select Primary Activity</option>
                                    <option value="62011">62011 - Software development</option>
                                    <option value="62021">62021 - Computer consultancy</option>
                                    <option value="70201">70201 - Management consultancy</option>
                                </select>
                            </div>
                            <div className="input-group-premium mt-6">
                                <label>Principal Activity Description</label>
                                <textarea placeholder="Provide a detailed description of your business operations..." rows="4" className="premium-input w-full p-4"></textarea>
                            </div>
                        </section>

                        <div className="form-footer mt-10 pt-6 border-t flex justify-end gap-3">
                            <button className="btn btn-light">Save as Draft</button>
                            <button className="btn btn-primary" onClick={() => {
                                if (!name) return alert('Business name is required.');
                                onSubmit({ name, ssic });
                            }}>Submit for Reservation</button>
                        </div>
                    </div>
                </div>

                <div className="side-col">
                    <div className="card summary-card">
                        <h4>Registration Workflow</h4>
                        <div className="workflow-steps mt-4">
                            <div className="wf-item active">Name Availability Check</div>
                            <div className="wf-item">SSIC Classification</div>
                            <div className="wf-item">KYC Documentation</div>
                            <div className="wf-item">Share Capital Declaration</div>
                            <div className="wf-item">Officer Appointment</div>
                        </div>
                    </div>
                    <div className="card mt-6 help-box">
                        <h4>Expert Support</h4>
                        <p className="text-sm text-muted">Our compliance officers are ready to assist with your SSIC classification.</p>
                        <button className="btn-text p-0 mt-3">Start Live Consultation →</button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .page-header { margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .breadcrumb { font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.5rem; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2.5rem; }
        .registration-card { padding: 3rem; }
        
        .section-title { display: flex; align-items: center; gap: 1rem; }
        .step-badge { width: 28px; height: 28px; background: #F1F5F9; color: var(--primary); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; }
        
        .input-group-premium label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-bold); margin-bottom: 0.5rem; }
        .premium-input { padding: 0.85rem 1.25rem; border: 1px solid var(--border); border-radius: 8px; background: #F8FAFC; font-family: inherit; font-size: 0.95rem; }
        .premium-input:focus { border-color: var(--accent); outline: none; background: white; }
        .input-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }
        
        .mt-10 { margin-top: 2.5rem; }
        .pt-10 { padding-top: 2.5rem; }
        .w-full { width: 100%; box-sizing: border-box; }
        .border-t { border-top: 1px solid var(--border); }
        .btn-light { background: #F1F5F9; color: var(--primary); }
        
        .summary-card { padding: 1.5rem; }
        .workflow-steps { display: flex; flex-direction: column; gap: 0.5rem; }
        .wf-item { padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); border: 1px solid transparent; }
        .wf-item.active { background: #F1F5F9; color: var(--primary); border-color: var(--border); }
        
        .help-box { background: var(--primary); color: white; border: none; }
        .help-box h4 { color: white; }
        .btn-text { background: none; border: none; color: var(--secondary); font-weight: 700; font-size: 0.85rem; cursor: pointer; }
      `}} />
        </div>
    );
};

export default BusinessRegistration;
