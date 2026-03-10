import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon, label, value, trend, trendUp, color }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div
                    className="stat-card-icon"
                    style={{ background: color ? `${color}18` : 'var(--primary-light)' }}
                >
                    {React.cloneElement(icon, {
                        size: 20,
                        style: { color: color || 'var(--primary)' },
                    })}
                </div>
                {trend !== undefined && (
                    <span className={`stat-card-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value">{value}</div>
            </div>
        </div>
    );
}
