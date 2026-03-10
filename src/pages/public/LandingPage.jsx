import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalisorLogo } from '../../components/shared/GlobalisorLogo.jsx';
import {
    Building2, ShieldCheck, FileText, BadgeCheck,
    BarChart3, ArrowRight, ChevronRight, Star, CheckCircle2, Globe, Check, Quote, ChevronDown
} from 'lucide-react';

const SERVICES = [
    { icon: <FileText size={26} />, color: '#0055a4', title: 'Business Name Registration' },
    { icon: <Building2 size={26} />, color: '#0a6e3f', title: 'Company Incorporation' },
    { icon: <ShieldCheck size={26} />, color: '#7c3aed', title: 'KYC Verification' },
    { icon: <BarChart3 size={26} />, color: '#b45309', title: 'Corporate Compliance' },
    { icon: <BadgeCheck size={26} />, color: '#0891b2', title: 'Annual Return Filing' },
    { icon: <Globe size={26} />, color: '#c8971e', title: 'Global Expansion' },
];

const STATS = [
    { value: '5,000+', label: 'Companies Incorporated' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '3 Days', label: 'Avg. Incorporation Time' },
    { value: '24/7', label: 'Support Available' },
];

const STEPS = [
    { num: '01', title: 'Register' },
    { num: '02', title: 'Submit KYC' },
    { num: '03', title: 'Review' },
    { num: '04', title: 'Incorporated' },
];

const WHY = [
    'ACRA Registered Agent',
    'MAS Compliant Processes',
    'End-to-End Digital Platform',
    'Dedicated Compliance Team',
    'Award-Winning Support',
];

const FAQS = [
    { q: 'How long does company incorporation take?', a: 'Standard incorporation takes 3-5 business days upon successful KYC verification.' },
    { q: 'What documents are required for KYC?', a: 'We require a valid passport, proof of residential address, and a brief selfie video.' },
    { q: 'Do I need a local director in Singapore?', a: 'Yes, Singapore law requires at least one ordinarily resident director. We can provide nominee director services if needed.' },
    { q: 'How does ACRA submission work?', a: 'Our compliance team handles the entire ACRA submission digitally, ensuring all regulatory requirements are met.' }
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#1f2937', overflowX: 'hidden' }}>

            {/* ── HEADER ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(10,35,64,0.97)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '0 5%',
            }}>
                <nav style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <GlobalisorLogo variant="dark" size="md" />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
                        {['Our Services', 'FAQ', 'About Us', 'Contact'].map(l => {
                            const sectionId = l === 'Our Services' ? '#services' :
                                l === 'FAQ' ? '#faq' :
                                    l === 'About Us' ? '#about' : '#contact';
                            return (
                                <a key={l} href={sectionId} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', transition: 'color 150ms' }}
                                    onMouseOver={e => e.currentTarget.style.color = 'white'}
                                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                                >{l}</a>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'linear-gradient(135deg, #0055a4, #00a3e0)',
                            color: 'white', padding: '9px 24px', borderRadius: 8,
                            fontWeight: 700, fontSize: '0.875rem', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 14px rgba(0,85,164,0.4)',
                        }}
                    >
                        Login <ArrowRight size={15} />
                    </button>
                </nav>
            </header>

            {/* ── HERO — Singapore Skyline ── */}
            <section style={{
                position: 'relative', overflow: 'hidden',
                backgroundImage: 'linear-gradient(135deg, rgba(10,35,64,0.87) 0%, rgba(10,35,64,0.72) 55%, rgba(0,92,156,0.6) 100%), url(/assets/singapore_bg.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                padding: '120px 5% 100px',
            }}>
                {/* Decorative glow */}
                <div style={{ position: 'absolute', bottom: 0, right: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,163,224,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
                    {/* Pill badge */}


                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 800, lineHeight: 1.1,
                        color: 'white', letterSpacing: '-0.03em', maxWidth: 720, marginBottom: 24,
                    }}>
                        Start and Manage Your{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #00a3e0, #7dd3fc)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            Business in Singapore
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '1.15rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75,
                        maxWidth: 580, marginBottom: 44,
                    }}>
                        Globalisor helps entrepreneurs register companies, complete KYC verification, and manage compliance — all from one seamless platform.
                    </p>

                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'linear-gradient(135deg, #0055a4, #00a3e0)',
                                color: 'white', padding: '14px 32px', borderRadius: 10,
                                fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 10,
                                boxShadow: '0 8px 28px rgba(0,85,164,0.55)',
                                transition: 'all 200ms',
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,85,164,0.65)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,85,164,0.55)'; }}
                        >
                            Get started <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {['ACRA Registered', 'MAS Compliant', 'SSL Secured', 'PDPA Compliant'].map(b => (
                            <div key={b} style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                            }}>
                                <CheckCircle2 size={14} color="#7dd3fc" /> {b}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ── */}
            <section style={{ background: 'linear-gradient(135deg, #0a2340, #0d2d50)', padding: '48px 5%' }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32,
                }}>
                    {STATS.map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00a3e0', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section id="services" style={{ padding: '96px 5%', background: '#f8fafc' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>

                        <h2 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800,
                            color: '#0a2340', letterSpacing: '-0.02em',
                        }}>
                            Everything You Need to Incorporate
                        </h2>
                        <p style={{ color: '#6b7280', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
                            From name registration to annual compliance, we handle every step of your business journey.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {SERVICES.map((s, i) => (
                            <div key={i}
                                style={{
                                    background: 'white', borderRadius: 16, padding: '28px',
                                    border: '1px solid #e5e7eb', transition: 'all 200ms', cursor: 'default',
                                }}
                                onMouseOver={e => { e.currentTarget.style.boxShadow = `0 16px 40px rgba(10,35,64,0.1)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${s.color}40`; }}
                                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                            >
                                <div style={{ width: 52, height: 52, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 18 }}>
                                    {s.icon}
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.02rem', color: '#0a2340', marginBottom: 10 }}>{s.title}</h3>
                                <button onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: s.color, fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    Learn More <ChevronRight size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY GLOBALISOR (About Us) ── */}
            <section id="about" style={{
                position: 'relative', overflow: 'hidden', padding: '96px 5%',
                backgroundImage: 'linear-gradient(135deg, rgba(10,35,64,0.92) 0%, rgba(10,35,64,0.82) 100%), url(/assets/singapore_bg.png)',
                backgroundSize: 'cover', backgroundPosition: 'center bottom',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                    <div>

                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                            Singapore's New Generation Corporate Services Firm
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: 36 }}>
                            23-08, SBF Center, 160 Robinson Road, Singapore. We combine deep regulatory expertise with modern technology to serve entrepreneurs globally.
                        </p>
                        <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg, #0055a4, #00a3e0)', color: 'white', padding: '13px 28px', borderRadius: 9, fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(0,85,164,0.45)' }}>
                            Start Your Journey <ArrowRight size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {WHY.map(item => (
                            <div key={item} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '18px 16px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <CheckCircle2 size={18} color="#00a3e0" style={{ flexShrink: 0 }} />
                                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 500 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '96px 5%', background: 'white' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>

                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a2340', letterSpacing: '-0.02em' }}>
                            Incorporate in 4 Simple Steps
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
                        {STEPS.map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 68, height: 68, borderRadius: '50%', margin: '0 auto 20px',
                                    background: i === 0 ? 'linear-gradient(135deg, #0055a4, #00a3e0)' : '#f3f4f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.2rem', fontWeight: 800,
                                    color: i === 0 ? 'white' : '#374151',
                                    boxShadow: i === 0 ? '0 8px 24px rgba(0,85,164,0.4)' : 'none',
                                }}>
                                    {s.num}
                                </div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.08rem', color: '#0a2340', marginBottom: 8 }}>{s.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>





            {/* ── TESTIMONIAL ── */}
            <section style={{ padding: '96px 5%', background: 'linear-gradient(135deg, #0a2340, #0d2d50)', color: 'white' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                    <Quote size={48} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 24px' }} />
                    <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 500, lineHeight: 1.4, marginBottom: 32 }}>
                        "Globalisor helped me incorporate my company in Singapore in just 3 days. The process was entirely digital and incredibly smooth."
                    </h3>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>Sarah Chen</div>
                    <div style={{ color: '#7dd3fc', fontSize: '0.875rem' }}>Founder, FinTech Startup</div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" style={{ padding: '96px 5%', background: 'white' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a2340', letterSpacing: '-0.02em' }}>
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {FAQS.map((faq, i) => (
                            <details key={i} style={{
                                background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb',
                                padding: '20px 24px', cursor: 'pointer'
                            }}>
                                <summary style={{ fontWeight: 600, color: '#0a2340', fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {faq.q}
                                    <ChevronDown size={20} color="#6b7280" />
                                </summary>
                                <p style={{ marginTop: 16, color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>


            {/* ── CTA BANNER ── */}
            <section style={{ background: 'linear-gradient(135deg, #0a2340, #0d2d50)', padding: '80px 5%' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
                        Ready to Incorporate Your Company?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: 36 }}>
                        Join thousands of entrepreneurs who have successfully started their businesses in Singapore with Globalisor.
                    </p>
                    <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg, #0055a4, #00a3e0)', color: 'white', padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 28px rgba(0,85,164,0.5)' }}>
                        Get Started Today <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* ── FOOTER (Contact) ── */}
            <footer id="contact" style={{ background: '#060f1a', padding: '52px 5% 32px', color: '#9ca3af' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
                        <div>
                            <GlobalisorLogo variant="dark" size="md" />
                            <p style={{ fontSize: '0.8rem', lineHeight: 1.7, maxWidth: 260, marginTop: 14 }}>
                                Singapore's trusted platform for business registration, KYC verification, and corporate compliance.
                            </p>
                            <p style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: 10 }}>
                                23-08, SBF Center, 160 Robinson Road, Singapore 068914
                            </p>
                        </div>
                        {[
                            { title: 'Services', items: ['Business Registration', 'Incorporation', 'KYC Verification', 'Annual Returns', 'Compliance'] },
                            { title: 'Company', items: ['About Us', 'Our History', 'Careers', 'Blog', 'Contact'] },
                            { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'PDPA Notice'] },
                        ].map(col => (
                            <div key={col.title}>
                                <div style={{ fontWeight: 600, color: 'white', marginBottom: 14, fontSize: '0.875rem' }}>{col.title}</div>
                                {col.items.map(item => (
                                    <div key={item} style={{ fontSize: '0.8rem', marginBottom: 8, cursor: 'pointer', transition: 'color 150ms' }}
                                        onMouseOver={e => e.currentTarget.style.color = 'white'}
                                        onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                                    >{item}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: '0.75rem' }}>
                        <span>© 2026 Globalisor Pte. Ltd. All rights reserved.</span>
                        <span>Registered with ACRA · Singapore</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
