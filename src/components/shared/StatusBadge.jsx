import React from 'react';

const STATUS_MAP = {
    'Pending': 'badge-pending',
    'In Progress': 'badge-inprogress',
    'KYC Review': 'badge-kyc',
    'KYC Approved': 'badge-completed',
    'KYC Rejected': 'badge-rejected',
    'Submitted to ACRA': 'badge-acra',
    'Completed': 'badge-completed',
    'Rejected': 'badge-rejected',
    'Active': 'badge-active',
    'Under Review': 'badge-review',
    'Approved': 'badge-completed',
};

export default function StatusBadge({ status }) {
    const cls = STATUS_MAP[status] || 'badge-pending';
    return (
        <span className={`badge ${cls}`}>
            {status}
        </span>
    );
}
