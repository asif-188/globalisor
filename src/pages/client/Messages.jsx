import React, { useState, useRef } from 'react';
import { Send, Paperclip, CheckCheck, Check, FileText } from 'lucide-react';

const THREADS = [
    {
        id: 1, from: 'Sarah Stafford', role: 'Staff', initials: 'SS', color: '#7c3aed',
        subject: 'APP-1001 — KYC Document Review',
        messages: [
            { sender: 'staff', text: 'Hello Raj! I have received your application. Your documents are currently under review.', time: '2026-03-02 11:30', read: true },
            { sender: 'client', text: 'Thank you Sarah! Please let me know if you need anything else.', time: '2026-03-02 12:00', read: true },
            { sender: 'staff', text: 'Your passport copy is a bit blurry on the signature section. Could you please reupload a clearer scan?', time: '2026-03-07 10:15', read: true },
            { sender: 'client', text: 'Sure, here is a clearly scanned version of my passport.', time: '2026-03-07 10:45', read: true, attachment: 'Raj_Passport_Scan_v2.pdf' },
        ],
    },
    {
        id: 2, from: 'Globalisor Support', role: 'Support', initials: 'GL', color: '#1a56db',
        subject: 'Welcome to Globalisor!',
        messages: [
            { sender: 'staff', text: 'Welcome to Globalisor! Your account has been set up. Our team is ready to assist you with your Singapore business registration.', time: '2026-03-01 09:00', read: true },
        ],
    },
];

export default function Messages() {
    const [active, setActive] = useState(THREADS[0]);
    const [threads, setThreads] = useState(THREADS);
    const [input, setInput] = useState('');
    const fileInputRef = useRef(null);

    const handleSend = () => {
        if (input.trim() || fileInputRef.current?.files?.length > 0) {
            const fileName = fileInputRef.current?.files?.[0]?.name;
            const msg = {
                sender: 'client',
                text: input.trim() || (fileName ? `Attached: ${fileName}` : ''),
                time: new Date().toISOString().slice(0, 16).replace('T', ' '),
                read: false,
                attachment: fileName || null
            };
            setThreads(threads.map(t =>
                t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t
            ));
            setActive(a => ({ ...a, messages: [...a.messages, msg] }));
            setInput('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Messages</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 520 }}>
                {/* Thread List */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--grey-200)', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                        Conversations
                    </div>
                    {threads.map(t => (
                        <div
                            key={t.id}
                            onClick={() => setActive(t)}
                            style={{
                                padding: '14px 16px', cursor: 'pointer',
                                background: active.id === t.id ? '#f0f5ff' : 'white',
                                borderBottom: '1px solid #f3f4f6',
                                borderLeft: active.id === t.id ? '3px solid #1a56db' : '3px solid transparent',
                                transition: 'all 150ms',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: `${t.color}20`, color: t.color, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.75rem',
                                }}>{t.initials}</div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{t.from}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--grey-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: `${active.color}20`, color: active.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.75rem',
                        }}>{active.initials}</div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{active.from}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{active.role} · {active.subject}</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {active.messages.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                                <div className={`message-bubble ${m.sender === 'client' ? 'sent' : 'received'}`}>
                                    {m.text}
                                    {m.attachment && (
                                        <div style={{
                                            marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.1)',
                                            borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem'
                                        }}>
                                            <FileText size={16} />
                                            <span>{m.attachment}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="message-time" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {m.time}
                                    {m.sender === 'client' && (
                                        m.read ? <CheckCheck size={12} color="#1a56db" /> : <Check size={12} color="#9ca3af" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid var(--grey-200)', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={() => handleSend()} />
                        <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={handleFileUpload} title="Attach file">
                            <Paperclip size={18} color="#6b7280" />
                        </button>
                        <input
                            className="form-input"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-primary" onClick={handleSend} style={{ flexShrink: 0 }}>
                            <Send size={15} /> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
