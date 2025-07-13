'use client';

import { getUser } from '@/services/accounts.service';
import { Accounts, StudentCard } from '@/types/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserJWT {
    sub: number;
    role?: string;
}

export interface User extends Accounts {
    role?: string;
    studentCard?: StudentCard | null;
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
                toast.error('Phiên đăng nhập đã hết hạn');
                // window.location.href = '/signin';
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
