import React, { useState } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FileText, CheckCircle, XCircle, MessageSquare, Eye, UploadCloud } from 'lucide-react';

const STATUS_STYLE = {
    Pending: { bg: '#fef3c7', color: '#92400e' },
    Approved: { bg: '#d1fae5', color: '#065f46' },
    Rejected: { bg: '#fee2e2', color: '#991b1b' },
    Requested: { bg: '#ede9fe', color: '#5b21b6' },
};

export default function DocumentReview() {
    const { db, reviewDocument } = useAppData();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    // Documents from applications assigned to me
    const myDocs = db.documents.filter(d => {
        const app = db.applications.find(a => a.application_id === d.application_id);
        return app?.assigned_staff_id === user?.id;
    }).map(d => {
        const app = db.applications.find(a => a.application_id === d.application_id);
        const uploader = db.users.find(u => u.user_id === d.uploaded_by_user_id);
        return { ...d, business_name: app?.business_name, uploader_name: uploader?.full_name };
    });

    const filtered = myDocs.filter(d => filter === 'All' || d.review_status === filter);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Document Review</h1>
            </div>

            <div style={{ marginBottom: 16 }}>
                <div className="filter-bar">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                        <button
                            key={f}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                            onClick={() => setFilter(f)}
                        >{f} ({myDocs.filter(d => f === 'All' || d.review_status === f).length})</button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
                    <UploadCloud size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <div>No documents {filter !== 'All' ? `with status: ${filter}` : 'from your assigned clients'}</div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {filtered.map(doc => {
                    const st = STATUS_STYLE[doc.review_status] || STATUS_STYLE.Pending;
                    return (
                        <div key={doc.document_id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} color="#1a56db" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{doc.document_type}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{doc.file_name}</div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, alignSelf: 'flex-start', background: st.bg, color: st.color }}>
                                    {doc.review_status}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 14 }}>
                                <div><strong style={{ color: '#374151' }}>{doc.uploader_name}</strong> · {doc.application_id}</div>
                                <div>{doc.business_name}</div>
                                <div>Uploaded: {doc.uploaded_at}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button className="btn btn-ghost btn-sm" style={{ color: '#1a56db' }}><Eye size={13} /> Preview</button>
                                {doc.review_status !== 'Approved' && (
                                    <button className="btn btn-success btn-sm" onClick={() => reviewDocument(doc.document_id, 'Approved', user?.id, '')}>
                                        <CheckCircle size={13} /> Approve
                                    </button>
                                )}
                                {doc.review_status !== 'Rejected' && (
                                    <button className="btn btn-danger btn-sm" onClick={() => reviewDocument(doc.document_id, 'Rejected', user?.id, 'Please resubmit a clearer document')}>
                                        <XCircle size={13} /> Reject
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
