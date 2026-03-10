import React from 'react';

/**
 * GlobalisorLogoIcon — the official teal globe SVG icon
 * Matches the brand logo: teal globe + orange/pink network dots
 */
export function GlobalisorLogoIcon({ size = 32 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* ── Globe ── */}
            <circle cx="60" cy="60" r="28" fill="#1fb8c3" />
            {/* Globe shading */}
            <ellipse cx="60" cy="60" r="28" fill="url(#globeShade)" />
            {/* Latitude lines */}
            <ellipse cx="60" cy="60" rx="28" ry="10" stroke="#158e97" strokeWidth="1.5" fill="none" />
            <ellipse cx="60" cy="60" rx="28" ry="20" stroke="#158e97" strokeWidth="1.5" fill="none" />
            {/* Longitude lines */}
            <line x1="60" y1="32" x2="60" y2="88" stroke="#158e97" strokeWidth="1.5" />
            <ellipse cx="60" cy="60" rx="12" ry="28" stroke="#158e97" strokeWidth="1.5" fill="none" />
            {/* Equator line */}
            <line x1="32" y1="60" x2="88" y2="60" stroke="#158e97" strokeWidth="1.5" />

            {/* ── Connectors + Dots ── */}
            {/* Top */}
            <line x1="60" y1="32" x2="60" y2="16" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="60" cy="10" r="7" fill="#f07020" />
            {/* Top-right */}
            <line x1="79" y1="41" x2="90" y2="26" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="96" cy="20" r="7" fill="#e8619a" />
            {/* Right */}
            <line x1="88" y1="60" x2="104" y2="60" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="110" cy="60" r="7" fill="#f07020" />
            {/* Bottom-right */}
            <line x1="79" y1="79" x2="90" y2="94" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="96" cy="100" r="7" fill="#e8619a" />
            {/* Bottom */}
            <line x1="60" y1="88" x2="60" y2="104" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="60" cy="110" r="7" fill="#f07020" />
            {/* Bottom-left */}
            <line x1="41" y1="79" x2="30" y2="94" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="24" cy="100" r="7" fill="#e8619a" />
            {/* Left */}
            <line x1="32" y1="60" x2="16" y2="60" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="10" cy="60" r="7" fill="#f07020" />
            {/* Top-left */}
            <line x1="41" y1="41" x2="30" y2="26" stroke="#f0a500" strokeWidth="5" strokeLinecap="round" />
            <circle cx="24" cy="20" r="7" fill="#e8619a" />

            <defs>
                <radialGradient id="globeShade" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0a8c96" stopOpacity="0.55" />
                </radialGradient>
            </defs>
        </svg>
    );
}

/**
 * GlobalisorLogo — icon + wordmark combo
 * @param {string} variant - 'dark' (for navy bg) or 'light' (for white bg)
 * @param {string} size    - 'sm' | 'md' | 'lg'
 */
export function GlobalisorLogo({ variant = 'dark', size = 'md' }) {
    const fontSizes = { sm: '0.95rem', md: '1.15rem', lg: '1.4rem' };
    const iconSizes = { sm: 26, md: 32, lg: 40 };
    const textColor = variant === 'dark' ? 'white' : '#0a2340';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GlobalisorLogoIcon size={iconSizes[size] || 32} />
            <span style={{
                fontWeight: 800,
                fontSize: fontSizes[size] || '1.15rem',
                color: textColor,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif',
            }}>
                Globalisor
            </span>
        </div>
    );
}

export default GlobalisorLogo;
