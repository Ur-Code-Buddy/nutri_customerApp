import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, getAuthToken, setAuthToken } from '../services/api';

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    signIn: (credentials: any) => Promise<void>;
    signUp: (userData: any) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getAuthToken();
                const userData = await SecureStore.getItemAsync('user_data');
                if (token) {
                    if (userData) {
                        setUser(JSON.parse(userData));
                    } else {
                        // Fallback if we have token but no user data (e.g. from previous version of app)
                        // Ideally we would fetch profile here. For now, we set a temporary state or just token.
                        setUser({ token });
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Navigation Protection
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)');
        }
    }, [user, segments, isLoading]);


    const signIn = async (credentials: any) => {
        try {
            const data = await authService.login(credentials);
            await setAuthToken(data.access_token);
            if (data.user) {
                await SecureStore.setItemAsync('user_data', JSON.stringify(data.user));
                setUser(data.user);
            } else {
                setUser({ token: data.access_token });
            }
        } catch (error) {
            throw error;
        }
    };

    const signUp = async (userData: any) => {
        try {
            await authService.register(userData);
            // Auto login after register or redirect to login? 
            // Let's auto login for better UX
            await signIn({ username: userData.username, password: userData.password });
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        await authService.logout();
        await SecureStore.deleteItemAsync('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
