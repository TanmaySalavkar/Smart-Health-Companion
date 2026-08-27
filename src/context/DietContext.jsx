import React, { createContext, useState, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const DietContext = createContext();

export const DietProvider = ({ children }) => {
  const { apiClient, isAuthenticated } = useContext(AuthContext);

  const [dashboard, setDashboard] = useState({
    targets: { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 30, sugar: 50, sodium: 2300 },
    consumed: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
    meals: [],
    habits: [],
    healthScore: 30,
    userName: '',
  });

  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  /**
   * Fetch dashboard data from backend
   */
  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated || !apiClient) return;
    setIsDashboardLoading(true);
    try {
      const response = await apiClient.get('/api/diet/dashboard');
      if (response && response.data) {
        setDashboard(response.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err && err.message ? err.message : 'Unknown error');
    } finally {
      setIsDashboardLoading(false);
    }
  }, [isAuthenticated, apiClient]);

  /**
   * Scan food image using AI Vision
   */
  const scanFood = useCallback(async (imageBase64) => {
    if (!apiClient) return { success: false, error: 'Not connected to server' };
    setIsScanning(true);
    setScanResult(null);
    try {
      const response = await apiClient.post('/api/diet/scan', { imageBase64 });
      const result = response && response.data ? response.data.nutrition : null;
      if (!result) return { success: false, error: 'No nutrition data returned from server' };
      setScanResult(result);
      return { success: true, nutrition: result };
    } catch (err) {
      console.error('Error scanning food:', err && err.message ? err.message : 'Unknown error');
      const errorMsg = (err && err.response && err.response.data && err.response.data.error) || 'Scan failed. Please check your connection and try again.';
      return { success: false, error: errorMsg };
    } finally {
      setIsScanning(false);
    }
  }, [apiClient]);

  /**
   * Log a meal to the database
   */
  const logMeal = useCallback(async (mealData) => {
    setIsLogging(true);
    try {
      const response = await apiClient.post('/api/diet/log', mealData);
      // Refresh dashboard after logging
      await fetchDashboard();
      return { success: true, meal: response.data.meal };
    } catch (err) {
      console.error('Error logging meal:', err.message);
      return { success: false, error: err.response?.data?.error || 'Failed to log meal' };
    } finally {
      setIsLogging(false);
    }
  }, [apiClient, fetchDashboard]);

  /**
   * Fetch meal history for a specific date
   */
  const fetchHistory = useCallback(async (date) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/api/diet/history', { params });
      return { success: true, meals: response.data.meals };
    } catch (err) {
      console.error('Error fetching history:', err.message);
      return { success: false, error: 'Failed to fetch history' };
    }
  }, [apiClient]);

  /**
   * Clear scan result
   */
  const clearScanResult = useCallback(() => {
    setScanResult(null);
  }, []);

  return (
    <DietContext.Provider
      value={{
        dashboard,
        scanResult,
        isScanning,
        isLogging,
        isDashboardLoading,
        fetchDashboard,
        scanFood,
        logMeal,
        fetchHistory,
        clearScanResult,
        setScanResult,
      }}
    >
      {children}
    </DietContext.Provider>
  );
};
