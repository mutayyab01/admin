import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL;

    const clearAuth = () => {
        localStorage.removeItem('adminUser');
        setUser(null);
    };

    // Create an axios instance with default config
    const axiosInstance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const storedUser = localStorage.getItem('adminUser');
                
                if (storedUser) {
                    // Verify the session with backend
                    const response = await axiosInstance.get('/userAdmins/verifySession');
                    if (response.data.valid) {
                        // If token is about to expire, show warning
                        if (response.data.message === 'Token will expire soon') {
                            console.warn('Session will expire soon');
                        }
                        setUser(JSON.parse(storedUser));
                    } else {
                        clearAuth();
                    }
                }
            } catch (error) {
                console.error('Session verification error:', error);
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();

        // Set up periodic token verification
        const interval = setInterval(verifyAuth, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString();
    };

    const login = async (username, password,category) => {
        try {
            const hashedPassword = hashPassword(password);
            const response = await axios.post(`${API_URL}/userAdmins/login`, {
                Username: username,
                Password: hashedPassword,
                Category: category
            }, {
                withCredentials: true
            });
            console.log(response.data);
            // debugger;
            if (response.data.user) {
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return { success: true };
            } else {
                return { success: false, message: response.data.message || 'Login failed' };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/userAdmins/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    };

    const isAuthenticated = () => {
        return !!user;
    };

    // Create an axios instance with credentials
    const getAxiosInstance = () => {
        const instance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // Add response interceptor to handle authentication errors
        instance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 || error.response?.data?.isExpired) {
                    clearAuth();
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }
        );

        return instance;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated,
            getAxiosInstance
        }}>
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