import React from 'react';

const ComplianceMonitoring = ({ events }) => {
    return (
        <div className="page-content">
            <header className="page-header">
                <div className="header-title">
                    <span className="breadcrumb">Administration / Compliance</span>
                    <h1>Compliance Monitoring</h1>
                    <p className="text-muted">Real-time status of ACRA connectivity and regulatory event tracking.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline">Generate Report</button>
                </div>
            </header>

            <div className="status-grid">
                <div className="card status-card">
                    <div className="flex items-center gap-3">
                        <div className="status-indicator status-active"></div>
                        <div>
                            <p className="status-label">ACRA Gateway</p>
                            <p className="status-value">Active & Synchronized</p>
                        </div>
                    </div>
                </div>
                <div className="card status-card">
                    <div className="flex items-center gap-3">
                        <div className="status-indicator status-active"></div>
                        <div>
                            <p className="status-label">KYC Verification Engine</p>
                            <p className="status-value">Running (v2.4.1)</p>
                        </div>
                    </div>
                </div>
                <div className="card status-card">
                    <div className="flex items-center gap-3">
                        <div className="status-indicator status-neutral"></div>
                        <div>
                            <p className="status-label">Last Forensic Audit</p>
                            <p className="status-value">Oct 24, 09:12 AM</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="logs-section mt-4">
                <div className="card table-card">
                    <div className="card-header flex justify-between items-center mb-4">
                        <h3>Compliance Event Logs</h3>
                        <div className="table-controls flex gap-2">
                            <input type="text" placeholder="Filter events..." className="search-input" />
                            <button className="btn btn-mini">Export JSON</button>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '15%' }}>Event ID</th>
                                    <th style={{ width: '20%' }}>Type</th>
                                    <th style={{ width: '25%' }}>Company / Identity</th>
                                    <th style={{ width: '15%' }}>Timestamp</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                    <th style={{ width: '10%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(ev => (
                                    <tr key={ev.id}>
                                        <td className="font-mono">{ev.id}</td>
                                        <td>
                                            <div className="event-type-cell">
                                                <span className="event-icon">⚡</span>
                                                {ev.type}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="company-cell">
                                                <span className="company-name">{ev.company}</span>
                                                <span className="sub-text">{ev.action}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <span className="primary-date">{ev.date}</span>
                                                <span className="sub-text">11:24 PM</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${ev.status === 'Completed' ? 'badge-success' : 'badge-pending'}`}>
                                                {ev.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-icon">⋯</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .breadcrumb {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.5rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .status-card {
          padding: 1.25rem 1.5rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-active {
          background-color: var(--secondary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .status-neutral {
          background-color: var(--text-muted);
        }

        .status-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .status-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-bold);
        }

        .table-card {
          padding: 1.5rem 0;
        }

        .card-header {
          padding: 0 1.5rem;
        }

        .search-input {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          width: 250px;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .font-mono {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 0.8rem;
            color: var(--text-muted);
        }

        .event-type-cell {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        }

        .company-cell, .date-cell {
            display: flex;
            flex-direction: column;
        }

        .company-name, .primary-date {
            font-weight: 600;
            color: var(--text-bold);
        }

        .sub-text {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-main);
        }

        .btn-outline:hover {
            border-color: var(--text-main);
            background: var(--bg-main);
        }

        .btn-mini {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
            background: var(--bg-main);
            color: var(--text-main);
            border: 1px solid var(--border);
        }

        .btn-icon {
            background: none;
            font-size: 1.25rem;
            color: var(--text-muted);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }

        .btn-icon:hover {
            background: var(--bg-main);
            color: var(--text-bold);
        }
      `}} />
        </div>
    );
};

export default ComplianceMonitoring;
