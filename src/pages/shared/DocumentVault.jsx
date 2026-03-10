import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    FileText, Search, Download, Eye,
    Filter, ArrowLeft, Building2, History,
    ShieldCheck, CheckCircle2, AlertCircle, FilePlus
} from 'lucide-react';

export default function DocumentVault() {
    const { companyId: id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getCompanyProfile, getCompanyByUserId, db } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');

    const effectiveId = id || (user?.role === 'client' ? getCompanyByUserId(user.user_id)?.company_id : null);
    const company = getCompanyProfile(effectiveId);

    if (!company) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <FileText size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                <h3>Vault Not Found</h3>
                <p style={{ color: '#6b7280' }}>The document vault you are looking for does not exist.</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ mt: 20 }}>
                    Go Back
                </button>
            </div>
        );
    }

    const filteredDocs = company.documents.filter(doc =>
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'white', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                    </div>
                </div>
                <button className="btn btn-primary">
                    <FilePlus size={18} /> Upload New Document
                </button>
            </div>

            {/* Folder / Category Tabs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                {['All Documents', 'Incorporation', 'Compliance', 'KYC', 'Internal'].map((tab, i) => (
                    <button
                        key={tab}
                        style={{
                            padding: '10px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                            whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
                            background: i === 0 ? '#0a2340' : 'white',
                            color: i === 0 ? 'white' : '#6b7280',
                            boxShadow: i === 0 ? '0 4px 12px rgba(10,35,64,0.2)' : 'none',
                            border: i === 0 ? 'none' : '1px solid #e5e7eb'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: 0 }}>
                {/* Search and Filters */}
                <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search documents by name or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: 40, width: '100%' }}
                        />
                    </div>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Document Table */}
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Document Name</th>
                                <th>Category</th>
                                <th>Version</th>
                                <th>Added Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocs.map(doc => (
                                <tr key={doc.doc_id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 8, background: '#f8fafc',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280'
                                            }}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>PDF Format • 2.4 MB</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600, background: '#f3f4f6',
                                            padding: '4px 10px', borderRadius: 6, color: '#4b5563'
                                        }}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>v{doc.version}</span>
                                            <History size={14} color="#9ca3af" />
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                        {doc.added_at}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                            <button className="btn btn-sm btn-outline" style={{ padding: '6px' }} title="Preview">
                                                <Eye size={16} />
                                            </button>
                                            <button className="btn btn-sm btn-outline" style={{ padding: '6px' }} title="Download">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDocs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                        No documents found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Summary / Integrity Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 24 }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', margin: 0 }}>Document Integrity Verified</h4>
                        <p style={{ fontSize: '0.75rem', color: '#166534', opacity: 0.8, marginTop: 4 }}>All documents are encrypted and timestamped via Globalisor's secure audit trail.</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a56db' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', margin: 0 }}>Auto-Sync Enabled</h4>
                        <p style={{ fontSize: '0.75rem', color: '#1e40af', opacity: 0.8, marginTop: 4 }}>This vault is automatically updated when ACRA filings are successfully processed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
