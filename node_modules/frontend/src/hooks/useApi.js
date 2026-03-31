import { useState, useCallback } from 'react';
import { mockApi } from '../utils/mockApi';

/**
 * useApi Hook
 * Standardizes API calls and provides loading/error states.
 * This makes it easy to switch from mockApi to a real backend in the future.
 */
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const call = useCallback(async (apiMethod, ...args) => {
        setLoading(true);
        setError(null);
        try {
            // Simulate realistic network latency (800ms)
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Execute the mock API call
            const result = apiMethod(...args);
            return result;
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred';
            setError(errorMessage);
            console.error('API Error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { call, loading, error };
};
