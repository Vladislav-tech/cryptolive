import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUserData } from './types/IUserData';
import { checkAuth, login, logout } from './api/authApi';
import type { AxiosResponse } from 'axios';
import type { AuthResponse } from './types/response/AuthResponse';

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: Omit<IUserData, 'name'>) => Promise<AxiosResponse<AuthResponse>>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            checkAuth()
                .then(isAuth => {
                    setIsAuthenticated(isAuth);
                })
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setIsLoading(false));

        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogin = async (data: Omit<IUserData, 'name'>): Promise<AxiosResponse<AuthResponse>> => {
        const response = await login(data);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
        }
        setIsAuthenticated(true);
        return response;
    }

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    }

    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}