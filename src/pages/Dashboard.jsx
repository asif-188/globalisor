import React, { useState } from 'react';

const Dashboard = ({ transactions, deleteTransaction, updateTransaction, onNewBusiness }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const stats = [
    { label: 'Active KYC Requests', value: transactions.filter(t => t.status === 'Pending').length, trend: 'High Priority', color: 'indigo' },
    { label: 'Incorporated Units', value: '148', trend: '+12% Monthly', color: 'emerald' },
    { label: 'ACRA Transactions', value: transactions.length, trend: 'Last 30 Days', color: 'slate' },
    { label: 'Filing Compliance', value: '98%', trend: 'Target: 100%', color: 'rose' },
  ];

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'approved' || s === 'filed') return 'badge-success';
    if (s === 'pending') return 'badge-pending';
    if (s === 'under review') return 'badge-info';
    return 'badge-error';
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setEditValue(tx.company);
  };

  const handleSave = (id) => {
    updateTransaction(id, { company: editValue });
    setEditingId(null);
  };

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <span className="breadcrumb">Overview</span>
          <h1>Compliance Box</h1>
          <p className="text-muted">Command center for Singapore business regulations and filings.</p>
        </div>
        <button className="btn btn-primary" onClick={onNewBusiness}>
          <span className="plus-icon">+</span> Initialize New Entity
        </button>
      </header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`card stat-mini-card stat-${stat.color}`}>
            <p className="stat-label">{stat.label}</p>
            <div className="stat-main">
              <h2 className="stat-value">{stat.value}</h2>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="card table-card premium-shadow">
          <div className="card-header flex justify-between items-center mb-6">
            <div>
              <h3>Recent ACRA Submissions</h3>
              <p className="text-xs text-muted">A summary of the latest 5 transactions recorded with ACRA.</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm">Audit Trail</button>
              <button className="btn btn-outline btn-sm">Refresh Data</button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Reference</th>
                <th style={{ width: '20%' }}>Process Type</th>
                <th style={{ width: '30%' }}>Entity Name</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-mono">{tx.id}</td>
                  <td className="font-semibold">{tx.type}</td>
                  <td>
                    {editingId === tx.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="inline-edit-input"
                        autoFocus
                      />
                    ) : (
                      <span className="entity-name">{tx.company}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-3">
                      {editingId === tx.id ? (
                        <button className="action-link save" onClick={() => handleSave(tx.id)}>Save</button>
                      ) : (
                        <button className="action-link" onClick={() => handleEdit(tx)}>Edit</button>
                      )}
                      <button className="action-link delete" onClick={() => deleteTransaction(tx.id)}>Trash</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card-footer">
            <button className="btn-text">View exhaustive transaction history →</button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .page-header { margin-bottom: 3.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
        .plus-icon { font-size: 1.2rem; line-height: 0; margin-bottom: 2px; }
        
        .breadcrumb { font-size: 0.75rem; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 0.5rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-mini-card { padding: 1.5rem; border-radius: var(--radius); }
        .stat-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.02em; }
        .stat-main { display: flex; align-items: baseline; gap: 0.75rem; }
        .stat-value { font-size: 2rem; color: var(--text-bold); }
        .stat-trend { font-size: 0.75rem; font-weight: 600; }
        
        .stat-indigo { border-top: 4px solid var(--accent); }
        .stat-indigo .stat-trend { color: var(--accent); }
        .stat-emerald { border-top: 4px solid var(--secondary); }
        .stat-emerald .stat-trend { color: var(--secondary-hover); }
        .stat-slate { border-top: 4px solid #64748B; }
        .stat-slate .stat-trend { color: #64748B; }
        .stat-rose { border-top: 4px solid #F43F5E; }
        .stat-rose .stat-trend { color: #F43F5E; }

        .premium-shadow { box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05); }
        .table-card { padding: 0; }
        .card-header { padding: 2rem 2rem 1rem 2rem; }
        .card-footer { padding: 1.25rem 2rem; border-top: 1px solid var(--border); text-align: center; }
        
        .mb-6 { margin-bottom: 1.5rem; }
        .text-xs { font-size: 0.75rem; }
        .font-mono { font-family: 'SFMono-Regular', Consolas, monospace; font-size: 0.8rem; color: var(--text-muted); }
        .font-semibold { font-weight: 600; color: var(--text-bold); }
        .entity-name { font-weight: 500; font-size: 0.95rem; }
        
        .inline-edit-input { width: 100%; padding: 0.5rem; border: 2px solid var(--accent); border-radius: 6px; outline: none; }
        
        .btn-outline { background: white; border: 1px solid var(--border); }
        .btn-secondary { background: var(--secondary); color: white; }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.8rem; }
        .btn-text { background: none; color: var(--accent); font-weight: 700; font-size: 0.85rem; }
        .btn-text:hover { text-decoration: underline; }
        
        .action-link { background: none; border: none; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); padding: 0; cursor: pointer; transition: color 0.2s; }
        .action-link:hover { color: var(--primary); text-decoration: underline; }
        .action-link.save { color: var(--secondary-hover); }
        .action-link.delete { color: #F43F5E; }
      `}} />
    </div>
  );
};

export default Dashboard;
