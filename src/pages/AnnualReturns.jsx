import React from 'react';

const AnnualReturns = () => {
    const filings = [
        { id: 'AR-2023-01', company: 'Nexus Tech Pte. Ltd.', fy: '2023', dueDate: '2023-12-31', status: 'Pending Documents' },
        { id: 'AR-2023-02', company: 'Quantum Labs', fy: '2023', dueDate: '2023-11-15', status: 'Overdue' },
        { id: 'AR-2022-45', company: 'Blue Horizon Ltd.', fy: '2022', dueDate: '2022-12-31', status: 'Filed' },
    ];

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <span className="breadcrumb">Compliance / Filing</span>
                    <h1>Annual Returns</h1>
                    <p className="text-muted">Manage financial year filings and ACRA annual returns.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">Send Reminders</button>
                    <button className="btn btn-primary" style={{ marginLeft: '1rem' }}>+ New Filing</button>
                </div>
            </header>

            <div className="alert-banner alert-overdue mb-8">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                    <strong>Filing Alert:</strong> One (1) entity is currently overdue. Immediate action is required to avoid ACRA penalties.
                </div>
            </div>

            <div className="card table-card">
                <div className="card-header p-6">
                    <h3>Filing Registry</h3>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Filing ID</th>
                            <th style={{ width: '25%' }}>Company Name</th>
                            <th style={{ width: '15%' }}>FY</th>
                            <th style={{ width: '15%' }}>Due Date</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '15%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filings.map(f => (
                            <tr key={f.id}>
                                <td className="font-mono">{f.id}</td>
                                <td className="font-semibold">{f.company}</td>
                                <td>{f.fy}</td>
                                <td>{f.dueDate}</td>
                                <td>
                                    <span className={`badge ${f.status === 'Filed' ? 'badge-success' :
                                        f.status === 'Overdue' ? 'badge-error' : 'badge-pending'
                                        }`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="text-link">Upload Docs</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .page-header { margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .breadcrumb { font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.5rem; }
        
        .alert-banner { display: flex; gap: 1rem; align-items: center; padding: 1.25rem 2rem; border-radius: 12px; font-size: 0.9rem; }
        .alert-overdue { background: #FEF2F2; color: #991B1B; border: 1px solid rgba(153, 27, 27, 0.1); }
        .alert-icon { font-size: 1.25rem; }
        
        .mb-8 { margin-bottom: 2rem; }
        .p-6 { padding: 1.5rem 2rem; }
        
        .font-mono { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.8rem; color: var(--text-muted); }
        .font-semibold { font-weight: 600; color: var(--text-bold); }
        
        .text-link { background: none; border: none; font-weight: 700; color: var(--accent); cursor: pointer; }
        .text-link:hover { text-decoration: underline; }
      `}} />
        </div >
    );
};

export default AnnualReturns;
