import React from 'react';
import { Download, TrendingUp } from 'lucide-react';

const MONTHLY = [
    { month: 'Oct', apps: 18, completed: 14, pct: 78 },
    { month: 'Nov', apps: 24, completed: 20, pct: 83 },
    { month: 'Dec', apps: 19, completed: 17, pct: 89 },
    { month: 'Jan', apps: 31, completed: 26, pct: 84 },
    { month: 'Feb', apps: 27, completed: 23, pct: 85 },
    { month: 'Mar', apps: 35, completed: 29, pct: 83 },
];

const TOP_STAFF = [
    { name: 'Sarah Stafford', completed: 54, rate: '96%', color: '#1a56db' },
    { name: 'Daniel Wong', completed: 67, rate: '94%', color: '#7c3aed' },
    { name: 'James Tan', completed: 32, rate: '91%', color: '#059669' },
    { name: 'Mei Lin', completed: 41, rate: '89%', color: '#d97706' },
    { name: 'Kevin Lim', completed: 18, rate: '85%', color: '#0891b2' },
];

export default function Reports() {
    const maxApps = Math.max(...MONTHLY.map(m => m.apps));

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Reports</h1>
                </div>
                <button className="btn btn-outline btn-sm"><Download size={15} /> Export PDF</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
                {/* Line Chart (SVG) */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Monthly Applications (Trend)</div>
                        <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ position: 'relative', height: 220, padding: '10px 0', marginTop: 10 }}>
                        <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1a56db" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#1a56db" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            {[0, 50, 100, 150, 200].map(y => (
                                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                            ))}
                            {/* Line path */}
                            <path
                                d={`M ${MONTHLY.map((m, i) => `${(i / (MONTHLY.length - 1)) * 500},${200 - (m.apps / maxApps) * 180}`).join(' L ')}`}
                                fill="none" stroke="#1a56db" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                            />
                            {/* Area fill */}
                            <path
                                d={`M 0,200 L ${MONTHLY.map((m, i) => `${(i / (MONTHLY.length - 1)) * 500},${200 - (m.apps / maxApps) * 180}`).join(' L ')} L 500,200 Z`}
                                fill="url(#gradientLine)"
                            />
                            {/* Data points */}
                            {MONTHLY.map((m, i) => {
                                const cx = (i / (MONTHLY.length - 1)) * 500;
                                const cy = 200 - (m.apps / maxApps) * 180;
                                return (
                                    <g key={m.month}>
                                        <circle cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#1a56db" strokeWidth="2" />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* X-Axis labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
                            {MONTHLY.map(m => (
                                <span key={m.month} style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>{m.month}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Staff */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Staff Performance</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {TOP_STAFF.map((s, i) => (
                            <div key={s.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%',
                                            background: `${s.color}20`, color: s.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 800,
                                        }}>{i + 1}</div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{s.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{s.rate}</span>
                                </div>
                                <div style={{ height: 5, background: '#f3f4f6', borderRadius: 4 }}>
                                    <div style={{ width: s.rate, height: '100%', background: s.color, borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--grey-200)' }}>
                    <div className="card-title">Monthly Summary</div>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Applications</th>
                                <th>Completed</th>
                                <th>Pending</th>
                                <th>Completion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MONTHLY.map(m => (
                                <tr key={m.month}>
                                    <td style={{ fontWeight: 600 }}>{m.month} 2026</td>
                                    <td>{m.apps}</td>
                                    <td><span style={{ color: '#059669', fontWeight: 600 }}>{m.completed}</span></td>
                                    <td><span style={{ color: '#d97706', fontWeight: 600 }}>{m.apps - m.completed}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 4 }}>
                                                <div style={{ width: `${m.pct}%`, height: '100%', background: '#1a56db', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a56db' }}>{m.pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
