'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';

type User = {
    id: string;
    username: string;
    accounttype: string;
    role?: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    logout: () => Promise<void>;
    fetchSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    logout: async () => {},
    fetchSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const fetchSession = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/session', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const session = await res.json();
                setUser(session.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Sử dụng useLayoutEffect để fetch session trước khi render
    useLayoutEffect(() => {
        fetchSession();
    }, []);

    const logout = async () => {
        try {
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            if (!res.ok) throw new Error('Logout failed');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                logout,
                fetchSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
