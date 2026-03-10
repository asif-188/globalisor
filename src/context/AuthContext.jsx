import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USERS = {
    'admin@globalisor.com': { user_id: 'U001', name: 'Alex Administrator', role: 'admin', email: 'admin@globalisor.com', initials: 'AA', avatarColor: '#0055a4', redirect: '/admin' },
    'staff1@globalisor.com': { user_id: 'U002', name: 'Sarah Lim', role: 'staff', email: 'staff1@globalisor.com', initials: 'SL', avatarColor: '#7c3aed', redirect: '/staff' },
    'staff2@globalisor.com': { user_id: 'U003', name: 'James Tan', role: 'staff', email: 'staff2@globalisor.com', initials: 'JT', avatarColor: '#059669', redirect: '/staff' },
    'staff3@globalisor.com': { user_id: 'U004', name: 'Kevin Wong', role: 'staff', email: 'staff3@globalisor.com', initials: 'KW', avatarColor: '#d97706', redirect: '/staff' },
    'user1@globalisor.com': { user_id: 'U005', name: 'Ethan Tan', role: 'client', email: 'user1@globalisor.com', initials: 'ET', avatarColor: '#0891b2', redirect: '/client' },
    'user2@globalisor.com': { user_id: 'U006', name: 'Priya Sharma', role: 'client', email: 'user2@globalisor.com', initials: 'PS', avatarColor: '#7c3aed', redirect: '/client' },
    'user3@globalisor.com': { user_id: 'U007', name: 'Ahmed Hassan', role: 'client', email: 'user3@globalisor.com', initials: 'AH', avatarColor: '#059669', redirect: '/client' },
    'user4@globalisor.com': { user_id: 'U008', name: 'Sophia Liu', role: 'client', email: 'user4@globalisor.com', initials: 'SL', avatarColor: '#dc2626', redirect: '/client' },
    // Legacy aliases
    'staff@globalisor.com': { user_id: 'U002', name: 'Sarah Lim', role: 'staff', email: 'staff1@globalisor.com', initials: 'SL', avatarColor: '#7c3aed', redirect: '/staff' },
    'user@globalisor.com': { user_id: 'U005', name: 'Ethan Tan', role: 'client', email: 'user1@globalisor.com', initials: 'ET', avatarColor: '#0891b2', redirect: '/client' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        const found = USERS[email.toLowerCase()];
        if (found && password.length >= 1) {
            setUser({ ...found, id: found.user_id });
            return { success: true, redirect: found.redirect };
        }
        return { success: false, error: 'Invalid credentials. Use the demo accounts listed below.' };
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
