import axios from 'axios';
import { API_URL } from '../config';

export const getDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctors`);
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



