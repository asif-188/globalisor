import React from 'react';
import { Check } from 'lucide-react';

export default function ProgressTracker({ steps, currentStep }) {
    return (
        <div className="progress-tracker">
            {steps.map((step, i) => {
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                    <div
                        key={step}
                        className={`progress-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                        <div className="progress-step-dot">
                            {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
                        </div>
                        <div className="progress-step-label">{step}</div>
                    </div>
                );
            })}
        </div>
    );
}
