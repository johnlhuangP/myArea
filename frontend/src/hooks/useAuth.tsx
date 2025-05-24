'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = apiClient.getToken();
            if (token) {
                try {
                    const userData = await apiClient.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to get user profile:', error);
                    apiClient.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const response = await apiClient.login(data);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await apiClient.register(data);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiClient.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 