import React, { useState } from 'react';

const Incorporation = ({ directors, setDirectors, onAddDirector, onDeleteDirector }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const handleAdd = () => {
        if (!newName) return alert('Name required');
        onAddDirector({
            id: Date.now(),
            name: newName,
            nationality: 'International',
            role: 'Director',
            kyc: 'Pending'
        });
        setNewName('');
        setIsAdding(false);
    };

    return (
        <div className="page-content">
            <header className="page-header">
                <div>
                    <h1>Company Incorporation</h1>
                    <p className="text-muted">Manage directors, shareholders, and corporate structure.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add Director</button>
            </header>

            <div className="incorporation-container flex gap-4">
                <div className="main-content flex-2">
                    {isAdding && (
                        <div className="card mb-4 border-accent">
                            <h4>New Director</h4>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Full Name"
                                    className="flex-1 inline-input"
                                    autoFocus
                                />
                                <button className="btn btn-secondary" onClick={handleAdd}>Save</button>
                                <button className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <section className="card mb-4">
                        <h3 className="mb-4">Directors & Officers</h3>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Nationality</th>
                                        <th>Role</th>
                                        <th>KYC Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {directors.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.name}</td>
                                            <td>{d.nationality}</td>
                                            <td>{d.role}</td>
                                            <td>
                                                <span className={`badge ${d.kyc === 'Approved' ? 'badge-success' : 'badge-pending'}`}>
                                                    {d.kyc}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="text-link color-error" onClick={() => onDeleteDirector(d.id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="card">
                        <h3 className="mb-4">Share Capital</h3>
                        <div className="flex gap-4">
                            <div className="input-field flex-1">
                                <label>Currency</label>
                                <select className="w-full"><option>SGD - Singapore Dollar</option></select>
                            </div>
                            <div className="input-field flex-1">
                                <label>Issued Capital</label>
                                <input type="number" defaultValue="10000" className="w-full" />
                            </div>
                            <div className="input-field flex-1">
                                <label>Number of Shares</label>
                                <input type="number" defaultValue="10000" className="w-full" />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="side-panel flex-1">
                    <div className="card bg-info-light">
                        <h4>Incorporation Checklist</h4>
                        <ul className="checklist mt-2">
                            <li>✅ Company Name Reserved</li>
                            <li>✅ Constitution Adopted</li>
                            <li>⏳ Director's Consent (Form 45)</li>
                            <li>⏳ Secretary's Consent (Form 45B)</li>
                            <li>⭕ Registered Office Address</li>
                        </ul>
                    </div>
                    <div className="alert-warning mt-4">
                        <strong>⚠️ Compliance Alert:</strong>
                        <p className="text-sm mt-1">At least one director must be ordinarily resident in Singapore.</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .page-content { padding: 2.5rem; margin-left: 280px; }
        .flex-2 { flex: 2; }
        .mb-4 { margin-bottom: 1.5rem; }
        .inline-input { border: 1px solid var(--border); padding: 0.75rem; border-radius: var(--radius); }
        .bg-info-light { background: #F0F9FF; border-color: #BAE6FD; }
        .checklist { list-style: none; padding: 0; }
        .checklist li { margin-bottom: 0.75rem; font-size: 0.9rem; display: flex; gap: 0.5rem; }
        .alert-warning { background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: var(--radius); }
        .text-sm { font-size: 0.85rem; }
        .mt-4 { margin-top: 1.5rem; }
        .w-full { width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); }
        .border-accent { border-color: var(--accent); border-width: 2px; }
        .color-error { color: #DC2626; cursor: pointer; border: none; background: none; font-weight: 600; }
        .text-link { color: var(--accent); font-weight: 600; border: none; background: none; cursor: pointer; }
      `}} />
        </div>
    );
};

export default Incorporation;
