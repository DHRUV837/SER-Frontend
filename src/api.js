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

// Add a request interceptor to include requestorId for data isolation
api.interceptors.request.use((config) => {
    try {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const auth = JSON.parse(authData);
            const userId = auth?.user?.id;

            if (userId) {
                // Ensure config.params exists
                config.params = config.params || {};
                // Append requestorId to query parameters if not already present
                if (!config.params.requestorId) {
                    config.params.requestorId = userId;
                }
            }
        }
    } catch (error) {
        console.error('Error in api interceptor:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
export { API_URL };
