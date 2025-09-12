/**
 * Custom hook for managing AI classification
 */

import { useState, useCallback } from 'react';
import { classifyText } from '../services';
import { AI_PROVIDERS } from '../constants';

export const useClassification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    /**
     * Classify text using AI
     */
    const classify = useCallback(async (text, provider = AI_PROVIDERS.OPENAI) => {
        try {
            setLoading(true);
            setError(null);

            const response = await classifyText(text, provider);
            setResult(response.data);

            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear classification results
     */
    const clear = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    /**
     * Retry last classification
     */
    const retry = useCallback(async (text, provider) => {
        if (text && provider) {
            return classify(text, provider);
        }
    }, [classify]);

    return {
        loading,
        error,
        result,
        classify,
        clear,
        retry,
        clearError: () => setError(null),
    };
};
