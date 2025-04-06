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
    isLoading: boolean;
    user: User | null;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchSession = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    const logout = async () => {
        try {
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            if (!res.ok) throw new Error('Logout failed');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const isAuthenticated = !!user;

    return <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
