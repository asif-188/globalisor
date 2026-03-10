import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangeFilter({ startDate, endDate, onRangeChange }) {
    const handlePreset = (preset) => {
        const end = new Date();
        const start = new Date();
        
        switch (preset) {
            case 'Daily':
                start.setHours(0, 0, 0, 0);
                break;
            case 'Weekly':
                start.setDate(end.getDate() - 7);
                break;
            case 'Monthly':
                start.setMonth(end.getMonth() - 1);
                break;
            case 'Yearly':
                start.setFullYear(end.getFullYear() - 1);
                break;
            case 'Previous Year':
                start.setFullYear(end.getFullYear() - 1, 0, 1);
                end.setFullYear(end.getFullYear() - 1, 11, 31);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            default:
                return;
        }
        
        onRangeChange(
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0]
        );
    };

    useEffect(() => {
        if (!startDate && !endDate) {
            handlePreset('Monthly');
        }
    }, []);

    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Date Range:</span>
                <select 
                    className="select-filter" 
                    onChange={e => handlePreset(e.target.value)}
                    defaultValue="Monthly"
                    style={{ fontSize: '0.8rem', padding: '5px 10px', height: 32 }}
                >
                    {['Daily', 'Weekly', 'Monthly', 'Yearly', 'Previous Year'].map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 4, borderLeft: '1px solid #e5e7eb', paddingLeft: 12 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Custom:</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: 10, color: '#9ca3af' }} />
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => onRangeChange(e.target.value, endDate)}
                        className="btn btn-outline btn-sm"
                        style={{ paddingLeft: 32, fontSize: '0.8rem', width: 140, height: 32 }}
                    />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>to</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: 10, color: '#9ca3af' }} />
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => onRangeChange(startDate, e.target.value)}
                        className="btn btn-outline btn-sm"
                        style={{ paddingLeft: 32, fontSize: '0.8rem', width: 140, height: 32 }}
                    />
                </div>
                {(startDate || endDate) && (
                    <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => onRangeChange('', '')}
                        style={{ color: '#dc2626', padding: '4px 8px' }}
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
