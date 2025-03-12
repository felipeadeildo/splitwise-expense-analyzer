import React, { createContext, useState, useEffect, ReactNode } from 'react';

type User = {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
};

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    cookie: string;
    login: (cookie: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [cookie, setCookie] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is already authenticated on app load
        const savedCookie = localStorage.getItem('splitwise_cookie');
        if (savedCookie) {
            setCookie(savedCookie);
            setIsAuthenticated(true);

            // Try to get user data from localStorage
            const userData = localStorage.getItem('splitwise_user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    console.error('Failed to parse user data');
                }
            }
        }
    }, []);

    const login = async (cookieValue: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            // Validate the cookie by making an API call
            const response = await fetch('https://secure.splitwise.com/api/v3.0/get_main_data?no_expenses=1&limit=3', {
                headers: {
                    'Cookie': cookieValue,
                    'Credentials': 'include'
                }
            });

            if (!response.ok) {
                throw new Error('Invalid cookie or API error');
            }

            const data = await response.json();

            // Extract user data
            const userData: User = {
                id: data.user.id,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                email: data.user.email
            };

            // Save to localStorage
            localStorage.setItem('splitwise_cookie', cookieValue);
            localStorage.setItem('splitwise_user', JSON.stringify(userData));

            // Update state
            setCookie(cookieValue);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            console.error('Login error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('splitwise_cookie');
        localStorage.removeItem('splitwise_user');
        setCookie('');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                cookie,
                login,
                logout,
                isLoading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;