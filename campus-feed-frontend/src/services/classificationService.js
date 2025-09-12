/**
 * AI Classification Service
 * Handles text classification using AI providers
 */

import { post } from './api';
import { API_CONFIG, ERROR_MESSAGES, AI_PROVIDERS } from '../constants';

/**
 * Classify text using AI
 * @param {string} text - Text to classify
 * @param {string} aiProvider - AI provider to use
 * @returns {Promise<Object>} Classification result
 */
export const classifyText = async (text, aiProvider = AI_PROVIDERS.OPENAI) => {
    try {
        if (!text || !text.trim()) {
            throw new Error(ERROR_MESSAGES.EMPTY_TEXT);
        }

        const response = await post(API_CONFIG.ENDPOINTS.CLASSIFY, {
            text: text.trim(),
            ai_provider: aiProvider,
        });

        return {
            success: true,
            data: response,
            provider: aiProvider,
        };
    } catch (error) {
        console.error('Classification Error:', error);
        throw new Error(ERROR_MESSAGES.CLASSIFICATION_FAILED);
    }
};

/**
 * Get available AI providers
 * @returns {Array} Available AI providers
 */
export const getAvailableProviders = () => {
    return Object.values(AI_PROVIDERS);
};

/**
 * Validate AI provider
 * @param {string} provider - Provider to validate
 * @returns {boolean} True if provider is valid
 */
export const isValidProvider = (provider) => {
    return Object.values(AI_PROVIDERS).includes(provider);
};
