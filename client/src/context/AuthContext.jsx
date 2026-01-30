import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'admin_token';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(true);

    const setAuthToken = (nextToken) => {
        if (nextToken) {
            localStorage.setItem(TOKEN_KEY, nextToken);
            axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
        } else {
            localStorage.removeItem(TOKEN_KEY);
            delete axios.defaults.headers.common.Authorization;
        }
        setToken(nextToken);
    };

    const refreshMe = async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (e) {
            setAuthToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshMe();
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    setAuthToken(null);
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (username, password) => {
        const res = await axios.post('/api/auth/login', { username, password });
        setAuthToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const bootstrap = async (username, password, setupKey) => {
        const res = await axios.post('/api/auth/bootstrap', { username, password, setupKey });
        setAuthToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        bootstrap,
        logout
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
