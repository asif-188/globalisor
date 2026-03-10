import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

function Field({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{value || '—'}</span>
        </div>
    );
}

export default function KYCVerification() {
    const { db, updateKYC } = useAppData();
    const { user } = useAuth();
    const [selectedId, setSelectedId] = useState(null);

    // KYC records for applications I'm assigned to
    const kycList = db.kycRecords.map(k => {
        const app = db.applications.find(a => a.application_id === k.application_id);
        const client = db.users.find(u => u.user_id === k.client_user_id);
        return { ...k, business_name: app?.business_name, assigned_staff_id: app?.assigned_staff_id, client_name: client?.full_name };
    }).filter(k => k.assigned_staff_id === user?.id);

    const selected = selectedId ? kycList.find(k => k.kyc_id === selectedId) : (kycList[0] || null);

    const handleKYC = (status) => {
        if (!selected) return;
        updateKYC(selected.application_id, status, user?.id, '');
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">KYC Verification</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 0, alignSelf: 'start' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--grey-200)', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                        My KYC Queue ({kycList.length})
                    </div>
                    {kycList.length === 0 && (
                        <div style={{ padding: 20, color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>No KYC submissions assigned to you</div>
                    )}
                    {kycList.map(k => (
                        <div
                            key={k.kyc_id}
                            onClick={() => setSelectedId(k.kyc_id)}
                            style={{
                                padding: '14px 16px', cursor: 'pointer',
                                background: selected?.kyc_id === k.kyc_id ? '#f0f5ff' : 'white',
                                borderBottom: '1px solid #f3f4f6',
                                borderLeft: selected?.kyc_id === k.kyc_id ? '3px solid #7c3aed' : '3px solid transparent',
                                transition: 'all 150ms',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{k.client_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{k.application_id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 1 }}>{k.business_name}</div>
                                </div>
                                <StatusBadge status={k.overall_kyc_status} />
                            </div>
                        </div>
                    ))}
                </div>

                {selected ? (
                    <div className="card">
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e8f0fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                    {(selected.client_name || '?').split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{selected.client_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{selected.kyc_id} · {selected.application_id}</div>
                                </div>
                            </div>
                            <StatusBadge status={selected.overall_kyc_status} />
                        </div>

                        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>KYC Checks</h3>
                        <Field label="PEP Status" value={selected.pep_status} />
                        <Field label="Sanctions Check" value={selected.sanctions_check_status} />
                        <Field label="Identity Verification" value={selected.identity_verification_status} />
                        <Field label="Address Verification" value={selected.address_verification_status} />
                        {selected.remarks && <Field label="Remarks" value={selected.remarks} />}

                        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Uploaded Documents</h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                            {db.documents.filter(d => d.application_id === selected.application_id).length === 0
                                ? <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No documents uploaded</span>
                                : db.documents.filter(d => d.application_id === selected.application_id).map(d => (
                                    <div key={d.document_id} style={{
                                        display: 'flex', alignItems: 'center', gap: 6, background: '#f0f5ff',
                                        padding: '6px 12px', borderRadius: 6, fontSize: '0.8rem', color: '#1a56db', fontWeight: 500,
                                    }}>
                                        <Eye size={13} /> {d.document_type} — {d.review_status}
                                    </div>
                                ))}
                        </div>

                        {['Pending', 'Under Review'].includes(selected.overall_kyc_status) && (
                            <div className="flex gap-3">
                                <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleKYC('Approved')}>
                                    <CheckCircle size={16} /> Approve KYC
                                </button>
                                <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleKYC('Rejected')}>
                                    <XCircle size={16} /> Reject KYC
                                </button>
                            </div>
                        )}
                        {!['Pending', 'Under Review'].includes(selected.overall_kyc_status) && (
                            <div style={{ padding: '12px', background: '#f9fafb', borderRadius: 8, textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                KYC {selected.overall_kyc_status}
                                {selected.overall_kyc_status === 'Approved' && ' — Application advanced to In Progress automatically ✓'}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🔍</div>
                            <div>Select a KYC submission from the list</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
