'use client';

import { getUser } from '@/services/accounts.service';
import { Accounts } from '@/types/types';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserJWT {
    sub: number;
    role?: string;
    isStudent?: boolean;
}

export interface User extends Accounts {
    role?: string;
    isStudent?: boolean;
}

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
                    const userJWT: UserJWT = session.data.user;
                    setIsAuthenticated(true);
                    try {
                        const accountId = userJWT.sub;
                        const profileResponse = await getUser(accountId);
                        if (profileResponse.ok) {
                            const userData: User = {
                                ...profileResponse.data,
                                role: userJWT.role,
                                isStudent: userJWT.isStudent,
                            };
                            setUser(userData);
                        }
                    } catch (error) {
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
