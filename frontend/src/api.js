/**
 * API Configuration
 * 
 * VITE_API_URL should be set in .env files.
 * Default to localhost for development if not set.
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token if available (future proofing)
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// Create a separate axios instance for requests that need auth but NO requestorId
const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add only auth header, no requestorId
authApi.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const auth = JSON.parse(authData);
            const token = auth?.token;
            const role = auth?.role;
            const userId = auth?.user?.id;

            console.log('[authApi] Token found:', !!token);
            console.log('[authApi] Role:', role);
            console.log('[authApi] UserId:', userId);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            // Add role and userId headers for backend authorization
            if (role) {
                config.headers['X-User-Role'] = role;
            }
            if (userId) {
                config.headers['X-User-Id'] = userId;
            }
        } else {
            console.log('[authApi] WARNING: No auth data found in localStorage');
        }
    } catch (error) {
        console.error('Error in authApi interceptor:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
export { API_URL, authApi };
