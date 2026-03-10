import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    Building2, Users, MapPin, ShieldCheck,
    Calendar, FileText, ArrowLeft, ExternalLink,
    AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import StatusBadge from '../../components/shared/StatusBadge.jsx';

export default function CompanyProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getCompanyProfile, getCompanyByUserId } = useAppData();

    // If no ID is provided, and we're a client, show their own company
    const effectiveId = id || (user?.role === 'client' ? getCompanyByUserId(user.user_id)?.company_id : null);
    const company = getCompanyProfile(effectiveId);

    if (!company) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Building2 size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
                <h3>Company Profile Not Found</h3>
                <p style={{ color: '#6b7280' }}>The company profile you are looking for does not exist or has not been incorporated yet.</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ mt: 20 }}>
                    Go Back
                </button>
            </div>
        );
    }

    const sections = [
        { id: 'overview', label: 'Overview', icon: <Building2 size={18} /> },
        { id: 'directors', label: 'Directors', icon: <Users size={18} /> },
        { id: 'shareholders', label: 'Shareholders', icon: <Users size={18} /> },
        { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={18} /> },
    ];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'white', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>UEN: {company.uen}</span>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d1d5db' }} />
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Inc. Date: {company.incorporation_date}</span>
                        <StatusBadge status={company.status} size="sm" />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Key Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1fb8c315', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1fb8c3' }}>
                                <MapPin size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Registered Address</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', marginTop: 2, lineHeight: 1.4 }}>{company.registered_address}</div>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#7c3aed15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Compliance Status</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: company.compliance_status === 'Compliant' ? '#059669' : '#d97706' }}>
                                        {company.compliance_status}
                                    </span>
                                    {company.compliance_status === 'Compliant' ? <CheckCircle2 size={14} color="#059669" /> : <AlertCircle size={14} color="#d97706" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Directors Section */}
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Users size={18} color="var(--primary)" />
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a2340' }}>Board of Directors</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>
                                {company.directors.length} Directors
                            </span>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Director Name</th>
                                        <th>Nationality</th>
                                        <th>Appointed Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {company.directors.map(d => (
                                        <tr key={d.director_id}>
                                            <td style={{ fontWeight: 600 }}>{d.name}</td>
                                            <td>{d.nationality}</td>
                                            <td>{d.appointed_date}</td>
                                            <td>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 999 }}>{d.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shareholders Section */}
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Users size={18} color="#7c3aed" />
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a2340' }}>Shareholding Structure</span>
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Shareholder</th>
                                        <th>Ordinary Shares</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {company.shareholders.map(s => (
                                        <tr key={s.shareholder_id}>
                                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                                            <td>{s.shares.toLocaleString()} {company.share_currency}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 4, width: 60 }}>
                                                        <div style={{ width: s.percentage, height: '100%', background: '#7c3aed', borderRadius: 4 }} />
                                                    </div>
                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{s.percentage}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Compliance Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card" style={{ background: '#0a2340', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <ShieldCheck size={20} color="#7dd3fc" />
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Compliance Timeline</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {company.complianceEvents.map(event => (
                                <div key={event.event_id} style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: 16, position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%',
                                        background: event.status === 'Urgent' ? '#f07020' : '#1fb8c3'
                                    }} />
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{event.type}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                                        Deadline: {event.deadline}
                                    </div>
                                    <div style={{
                                        display: 'inline-block', marginTop: 8, fontSize: '0.65rem', fontWeight: 800,
                                        padding: '2px 8px', borderRadius: 4,
                                        background: event.status === 'Urgent' ? 'rgba(240,112,32,0.2)' : 'rgba(31,184,195,0.2)',
                                        color: event.status === 'Urgent' ? '#f07020' : '#1fb8c3',
                                        textTransform: 'uppercase'
                                    }}>
                                        {event.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            View Compliance Calendar
                        </button>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Official Documents</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {company.documents.slice(0, 3).map(doc => (
                                <div key={doc.doc_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                                    <FileText size={18} color="#6b7280" />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.type}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>v{doc.version} • {doc.added_at}</div>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-outline btn-sm"
                            style={{ width: '100%', marginTop: 16 }}
                            onClick={() => navigate(`/vault/${effectiveId}`)}
                        >
                            Open Document Vault
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
