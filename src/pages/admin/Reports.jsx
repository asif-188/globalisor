import React, { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { useAppData } from '../../context/AppContext.jsx';
import DateRangeFilter from '../../components/shared/DateRangeFilter.jsx';

export default function Reports() {
    const { db } = useAppData();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Derive data from DB based on dates
    const filteredApps = db.applications.filter(a => {
        if (!startDate && !endDate) return true;
        const createdDate = new Date(a.created_at);
        let match = true;
        if (startDate) match = match && createdDate >= new Date(startDate);
        if (endDate) {
            const endLimit = new Date(endDate);
            endLimit.setHours(23, 59, 59, 999);
            match = match && createdDate <= endLimit;
        }
        return match;
    });

    // Group by month for chart
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months if no range
    let displayMonths = months;
    if (!startDate && !endDate) {
        const now = new Date();
        displayMonths = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            displayMonths.push(months[d.getMonth()]);
        }
    }

    displayMonths.forEach(m => monthlyData[m] = { apps: 0, completed: 0 });

    filteredApps.forEach(a => {
        const d = new Date(a.created_at);
        const m = months[d.getMonth()];
        if (monthlyData[m]) {
            monthlyData[m].apps++;
            if (a.status === 'Completed') monthlyData[m].completed++;
        }
    });

    const MONTHLY = displayMonths.map(m => ({
        month: m,
        apps: monthlyData[m].apps,
        completed: monthlyData[m].completed,
        pct: monthlyData[m].apps ? Math.round((monthlyData[m].completed / monthlyData[m].apps) * 100) : 0
    }));

    // Derived staff stats
    const staffStats = db.users.filter(u => u.role === 'staff').map(s => {
        const completed = db.applications.filter(a => a.assigned_staff_id === s.user_id && a.status === 'Completed').length;
        const total = db.applications.filter(a => a.assigned_staff_id === s.user_id).length;
        return {
            name: s.full_name,
            completed,
            rate: total ? Math.round((completed / total) * 100) + '%' : '0%',
            color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random but could be fixed
        };
    }).sort((a, b) => b.completed - a.completed).slice(0, 5);

    const maxApps = Math.max(...MONTHLY.map(m => m.apps), 5); // Fallback to 5 to avoid div by zero

    return (
        <div>
            <div className="page-header flex flex-wrap justify-between items-center gap-4">
                <h1>Reports & Analytics</h1>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <DateRangeFilter 
                        startDate={startDate} 
                        endDate={endDate} 
                        onRangeChange={handleRangeChange} 
                    />
                    <button className="btn btn-outline btn-sm"><Download size={15} /> Export PDF</button>
                </div>
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
                        {staffStats.map((s, i) => (
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
