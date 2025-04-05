'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
    id: string;
    username: string;
    accounttype: string;
    role: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/auth/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Not authenticated');
                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            }
        };

        fetchSession();
    }, []);

    const isAuthenticated = !!user;

    const login = async () => {
        try {
            const res = await fetch('/api/auth/session', {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Failed to fetch user data');
            const data = await res.json();
            console.log('User data:', data);
            setUser(data.user);
        } catch (error) {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            if (!res.ok) throw new Error('Logout failed');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
