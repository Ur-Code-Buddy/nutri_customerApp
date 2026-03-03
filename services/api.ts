import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://backend.v1.nutritiffin.com'; // Replace with your backend URL if different

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setAuthToken = async (token: string) => {
    if (token) {
        await SecureStore.setItemAsync('access_token', token);
    } else {
        await SecureStore.deleteItemAsync('access_token');
    }
};

export const getAuthToken = async () => {
    return await SecureStore.getItemAsync('access_token');
}

export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData: {
        username: string;
        name: string;
        email: string;
        phone_number: string;
        address: string;
        pincode: string;
        password: string;
    }) => {
        const payload = { ...userData, role: 'CLIENT' };
        const response = await api.post('/auth/register', payload);
        return response.data;
    },
    resendVerification: async (email: string) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },
    checkEmailVerified: async (email: string) => {
        const response = await api.post('/auth/check-email-verified', { email });
        return response.data;
    },
    logout: async () => {
        await SecureStore.deleteItemAsync('access_token');
    }
};

export const userService = {
    getProfile: async () => {
        // Assuming /auth/me exists based on standard practices, as client.md doesn't specify a profile endpoint
        // If this fails 404, we might need to ask backend dev for the correct endpoint.
        // Trying /auth/me first.
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            // Fallback or retry.
            throw error;
        }
    },
    updateProfile: async (data: any) => {
        const response = await api.put('/auth/me', data);
        return response.data;
    }
};

export const kitchenService = {
    getAll: async () => {
        const response = await api.get('/kitchens');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/kitchens/${id}`);
        return response.data;
    },
    getMenu: async (kitchenId: string) => {
        const response = await api.get(`/menu-items/kitchen/${kitchenId}`);
        return response.data;
    }
};

export const orderService = {
    create: async (orderData: any) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    }
}

export default api;
