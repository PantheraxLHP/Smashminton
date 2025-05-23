'use client';

import { getUser } from '@/services/accounts.service';
import { createContext, useContext, useEffect, useState } from 'react';
import { Accounts } from '@/types/types';

export type UserJWT = {
    sub: number;
    username: string;
    accounttype: string;
    role?: string;
    avatarurl?: string;
};

type AuthContextType = {
    isLoading: boolean;
    user: Accounts | null;
    isAuthenticated: boolean;
    setUser: (user: Accounts | null) => void;
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
    const [userJWT, setUserJWT] = useState<UserJWT | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<Accounts | null>(null);

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
                    setUserJWT(session.data.user);
                    setIsAuthenticated(true);
                } else {
                    setUserJWT(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUserJWT(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUserJWT(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            if (!userJWT?.sub) {
                return;
            }
            const accountId = userJWT.sub;
            const response = await getUser(accountId);
            if (response.ok) {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [userJWT]);

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
