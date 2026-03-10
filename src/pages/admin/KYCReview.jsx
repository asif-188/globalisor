import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';

function Field({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{value || '—'}</span>
        </div>
    );
}

export default function KYCReview() {
    const { db, updateKYC } = useAppData();
    const { user } = useAuth();
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Build enriched KYC list
    const kycList = db.kycRecords.map(k => {
        const app = db.applications.find(a => a.application_id === k.application_id);
        const client = db.users.find(u => u.user_id === k.client_user_id);
        return { ...k, business_name: app?.business_name, client_name: client?.full_name, client_email: client?.email, created_at: app?.created_at };
    }).filter(k => {
        const q = search.toLowerCase();
        const matchSearch = (k.business_name || '').toLowerCase().includes(q) || (k.client_name || '').toLowerCase().includes(q);

        let matchDate = true;
        if (startDate || endDate) {
            const createdDate = new Date(k.created_at);
            if (startDate) matchDate = matchDate && createdDate >= new Date(startDate);
            if (endDate) {
                const endLimit = new Date(endDate);
                endLimit.setHours(23, 59, 59, 999);
                matchDate = matchDate && createdDate <= endLimit;
            }
        }
        return matchSearch && matchDate;
    });

    const currentKyc = selected ? db.kycRecords.find(k => k.kyc_id === selected.kyc_id) : null;
    // Merge enriched data with current state
    const enrichedSelected = currentKyc ? { ...selected, ...currentKyc, business_name: selected.business_name, client_name: selected.client_name, client_email: selected.client_email } : null;

    const handleKYC = (applicationId, newStatus) => {
        updateKYC(applicationId, newStatus, user?.id, '');
        // Update selected enriched view
        setSelected(prev => prev ? { ...prev, overall_kyc_status: newStatus } : null);
    };

    return (
        <div>
            <div className="page-header flex flex-wrap justify-between items-center gap-4">
                <h1>KYC Review</h1>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div className="search-input" style={{ width: 240 }}>
                        <Search size={14} style={{ color: 'var(--grey-400)' }} />
                        <input placeholder="Search business or client..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <DateRangeFilter 
                        startDate={startDate} 
                        endDate={endDate} 
                        onRangeChange={handleRangeChange} 
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 0, alignSelf: 'start' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--grey-200)', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                        KYC Submissions ({kycList.length})
                    </div>
                    {kycList.map(k => (
                        <div
                            key={k.kyc_id}
                            onClick={() => setSelected(k)}
                            style={{
                                padding: '14px 16px', cursor: 'pointer',
                                background: enrichedSelected?.kyc_id === k.kyc_id ? '#f0f5ff' : 'white',
                                borderLeft: enrichedSelected?.kyc_id === k.kyc_id ? '3px solid #1a56db' : '3px solid transparent',
                                borderBottom: '1px solid #f3f4f6', transition: 'all 150ms',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{k.client_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{k.kyc_id} · {k.application_id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>{k.business_name}</div>
                                </div>
                                <StatusBadge status={k.overall_kyc_status} />
                            </div>
                        </div>
                    ))}
                    {kycList.length === 0 && (
                        <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No KYC submissions yet</div>
                    )}
                </div>

                {enrichedSelected ? (
                    <div className="card">
                        <div className="card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%', background: '#e8f0fe', color: '#1a56db',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                                }}>
                                    {(enrichedSelected.client_name || '?').split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{enrichedSelected.client_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{enrichedSelected.kyc_id} · {enrichedSelected.application_id}</div>
                                </div>
                            </div>
                            <StatusBadge status={enrichedSelected.overall_kyc_status} />
                        </div>

                        {/* Application */}
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Application</h3>
                        <Field label="Business" value={enrichedSelected.business_name} />
                        <Field label="Application ID" value={enrichedSelected.application_id} />

                        {/* KYC Checks */}
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Compliance Checks</h3>
                        <Field label="PEP Status" value={enrichedSelected.pep_status} />
                        <Field label="Sanctions Check" value={enrichedSelected.sanctions_check_status} />
                        <Field label="Identity Verification" value={enrichedSelected.identity_verification_status} />
                        <Field label="Address Verification" value={enrichedSelected.address_verification_status} />

                        {/* Documents from this application */}
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Uploaded Documents</h3>
                        {db.documents.filter(d => d.application_id === enrichedSelected.application_id).length > 0 ? (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                                {db.documents.filter(d => d.application_id === enrichedSelected.application_id).map(d => (
                                    <div key={d.document_id} style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        background: d.review_status === 'Approved' ? '#d1fae5' : '#f0f5ff',
                                        padding: '6px 12px', borderRadius: 6,
                                        fontSize: '0.8rem', color: d.review_status === 'Approved' ? '#065f46' : '#1a56db', fontWeight: 500,
                                    }}>
                                        <Eye size={13} /> {d.document_type} ({d.review_status})
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: 20 }}>No documents uploaded yet</div>
                        )}

                        {(enrichedSelected.overall_kyc_status === 'Pending' || enrichedSelected.overall_kyc_status === 'Under Review') && (
                            <div className="flex gap-3">
                                <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleKYC(enrichedSelected.application_id, 'Approved')}>
                                    <CheckCircle size={16} /> Approve KYC
                                </button>
                                <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleKYC(enrichedSelected.application_id, 'Rejected')}>
                                    <XCircle size={16} /> Reject KYC
                                </button>
                            </div>
                        )}
                        {!['Pending', 'Under Review'].includes(enrichedSelected.overall_kyc_status) && (
                            <div style={{ padding: '12px 16px', background: '#f9fafb', borderRadius: 8, textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                KYC Status: <strong>{enrichedSelected.overall_kyc_status}</strong>
                                {enrichedSelected.overall_kyc_status === 'Approved' && ' — Application advanced to In Progress automatically'}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
                            <div>Select a KYC submission from the list</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
