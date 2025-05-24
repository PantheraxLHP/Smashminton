'use client';

import { getUser } from '@/services/accounts.service';
import { Accounts } from '@/types/types';
import { createContext, useContext, useEffect, useState } from 'react';

export type UserJWT = {
    sub: number;
    role?: string;
};

type User = UserJWT & Accounts;

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
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const fetchSession = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/session', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const session = await response.json();
                if (session.data?.user) {
                    const userJWT = session.data.user;
                    setIsAuthenticated(true);
                    try {
                        const accountId = userJWT.sub;
                        const profileResponse = await getUser(accountId);
                        if (profileResponse.ok) {
                            setUser({
                                ...userJWT,
                                ...profileResponse.data,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
