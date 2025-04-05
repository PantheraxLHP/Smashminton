'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    username: string;
    role: string; // 'wh_manager', 'employee', 'admin'
    accountType: string; // 'Employee', 'Customer'
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const login = (token: string) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
            id: payload.sub,
            username: payload.username,
            role: payload.role,
            accountType: payload.accounttype,
        });
        sessionStorage.setItem('accessToken', token);
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('accessToken');
    };

    // Kiểm tra token khi khởi động app
    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token && !isTokenExpired(token)) {
            login(token); // Khôi phục session
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Kiểm tra token hết hạn
function isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
}
