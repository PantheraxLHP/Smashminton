'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';

export type User = {
    sub: number;
    username: string;
    accounttype: string;
    role?: string;
    avatarurl?: string;
};

type AuthContextType = {
    isLoading: boolean;
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    setUser: () => {},
    setIsAuthenticated: () => {},
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

    useLayoutEffect(() => {
        fetchSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                setIsAuthenticated,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
