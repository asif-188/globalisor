import React, { useState, useRef } from 'react';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { FileText, CheckCircle, AlertCircle, Trash2, Upload, UploadCloud } from 'lucide-react';

const DOC_TYPES = [
    { key: 'Passport', label: 'Passport Copy', required: true },
    { key: 'Address Proof', label: 'Address Proof', required: true },
    { key: 'Selfie', label: 'Selfie Verification', required: true },
    { key: 'Business Document', label: 'Business Documents', required: false },
];

export default function UploadDocuments() {
    const { getApplicationsForUser, db, uploadDocument } = useAppData();
    const { user } = useAuth();
    const [uploading, setUploading] = useState({});
    const [dragging, setDragging] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const fileRefs = useRef({});

    const myApps = getApplicationsForUser(user?.id, 'client');
    const application = myApps[0];

    const myDocs = application
        ? db.documents.filter(d => d.application_id === application.application_id)
        : [];

    const getDocStatus = (docType) => {
        const doc = myDocs.find(d => d.document_type === docType);
        return doc ? doc.review_status : 'Not uploaded';
    };

    const processUpload = (docType, file) => {
        if (!application || !file) return;
        setUploadError(null);

        // Size limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            setUploadError(`File ${file.name} exceeds the 5MB size limit.`);
            return;
        }

        setUploading(p => ({ ...p, [docType]: true }));
        // Simulate upload
        setTimeout(() => {
            uploadDocument(application.application_id, user?.id, docType, file.name);
            setUploading(p => ({ ...p, [docType]: false }));
        }, 1200);
    };

    const handleFileChange = (docType, e) => {
        const file = e.target.files?.[0];
        if (file) processUpload(docType, file);
    };

    const handleDragOver = (e, docType) => {
        e.preventDefault();
        setDragging(docType);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(null);
    };

    const handleDrop = (e, docType) => {
        e.preventDefault();
        setDragging(null);
        const file = e.dataTransfer.files?.[0];
        if (file) processUpload(docType, file);
    };

    const STATUS_STYLE = {
        Approved: { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle size={14} /> },
        Pending: { bg: '#fef3c7', color: '#92400e', icon: <AlertCircle size={14} /> },
        Rejected: { bg: '#fee2e2', color: '#991b1b', icon: <AlertCircle size={14} /> },
        Requested: { bg: '#ede9fe', color: '#5b21b6', icon: <AlertCircle size={14} /> },
        'Not uploaded': { bg: '#f3f4f6', color: '#9ca3af', icon: null },
    };

    return (
        <div>
            <div className="page-header">
                <h1>Upload Documents</h1>
            </div>

            {!application && (
                <div className="card" style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
                    Start a business registration to upload documents.
                </div>
            )}

            {application && (
                <>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                        {Object.entries(STATUS_STYLE).filter(([k]) => k !== 'Not uploaded').map(([status, s]) => (
                            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, background: s.bg, padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, color: s.color }}>
                                {s.icon} {status}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {uploadError && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertCircle size={16} /> {uploadError}
                            </div>
                        )}
                        {DOC_TYPES.map(doc => {
                            const status = getDocStatus(doc.key);
                            const st = STATUS_STYLE[status] || STATUS_STYLE['Not uploaded'];
                            const uploaded = status !== 'Not uploaded';
                            const existingDoc = myDocs.find(d => d.document_type === doc.key);
                            const isDragging = dragging === doc.key;

                            return (
                                <div
                                    key={doc.key}
                                    className="card"
                                    onDragOver={(e) => handleDragOver(e, doc.key)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, doc.key)}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 16,
                                        border: isDragging ? '2px dashed #1a56db' : '1px solid #e5e7eb',
                                        background: isDragging ? '#f0f5ff' : 'white',
                                        transition: 'all 0.2s', position: 'relative'
                                    }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isDragging ? <UploadCloud size={20} color="#1a56db" /> : <FileText size={20} color="#1a56db" />}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <div style={{ fontWeight: 600, color: '#374151', fontSize: '1rem' }}>{doc.label}</div>
                                            {!doc.required && <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Optional</span>}
                                        </div>
                                        {existingDoc && (
                                            <div style={{ fontSize: '0.75rem', color: '#1a56db', background: '#f0f5ff', display: 'inline-flex', padding: '2px 8px', borderRadius: 4 }}>
                                                Last upload: {existingDoc.file_name}
                                            </div>
                                        )}
                                        {status === 'Rejected' && existingDoc?.review_comments && (
                                            <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: 4 }}>
                                                <strong>Rejection note:</strong> {existingDoc.review_comments}
                                            </div>
                                        )}
                                        {isDragging && <div style={{ fontSize: '0.8rem', color: '#1a56db', fontWeight: 600, marginTop: 4 }}>Drop file to upload...</div>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: st.bg, color: st.color }}>
                                            {st.icon} {status}
                                        </span>
                                        {(!uploaded || status === 'Rejected') && (
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="file"
                                                    ref={el => fileRefs.current[doc.key] = el}
                                                    style={{ display: 'none' }}
                                                    accept=".pdf,.png,.jpg,.jpeg"
                                                    onChange={(e) => handleFileChange(doc.key, e)}
                                                />
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    disabled={!!uploading[doc.key]}
                                                    onClick={() => fileRefs.current[doc.key]?.click()}
                                                >
                                                    {uploading[doc.key] ? <><UploadCloud size={13} className="animate-pulse" /> Uploading...</> : <><Upload size={13} /> {uploaded ? 'Re-upload' : 'Upload File'}</>}
                                                </button>
                                            </div>
                                        )}
                                        {uploaded && status !== 'Rejected' && status !== 'Approved' && (
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Awaiting review</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 20, padding: '14px 18px', background: '#e8f0fe', borderRadius: 10, fontSize: '0.875rem', color: '#1e40af' }}>
                        <strong>Note:</strong> All uploaded documents are encrypted and stored securely. They are visible to your assigned staff immediately and used solely for ACRA registration.
                    </div>
                </>
            )}
        </div>
    );
}
