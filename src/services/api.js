import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Base URL (strip trailing /api if present for flexibility)
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

// Create a centralized axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ─────────────────────────────
// Auto-inject Bearer token from AsyncStorage on every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Silently fail — request will proceed without auth header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────
// Handle 401 (token expired) globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored auth
      try {
        await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
      } catch (e) {
        // Ignore storage errors during cleanup
      }
    }
    return Promise.reject(error);
  }
);

// ── Existing API Functions ──────────────────────────

export const getDoctors = async () => {
  try {
    const response = await apiClient.get('/api/doctors');
    return response.data;
  } catch (error) {
    // Try fallback URL if on Android (switch between 10.0.2.2 and localhost)
    const fallbackUrl = API_URL.includes('10.0.2.2')
      ? 'http://localhost:3000/api/doctors'
      : API_URL.includes('localhost')
      ? 'http://10.0.2.2:3000/api/doctors'
      : null;

    if (fallbackUrl) {
      try {
        const altResponse = await axios.get(fallbackUrl);
        return altResponse.data;
      } catch (fallbackErr) {
        // Ignore fallback error and throw original error below
      }
    }

    console.error("Error fetching doctors:", error.message || error);
    throw error;
  }
};

// Export the axios instance for use in contexts
export default apiClient;
