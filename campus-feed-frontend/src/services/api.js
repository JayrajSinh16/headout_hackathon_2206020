/**
 * Base API service with common functionality
 */

import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add any global request modifications here
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('Response Error:', error);

        // Handle common errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }

        if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        }

        if (error.response?.status === 404) {
            throw new Error('Resource not found.');
        }

        // Re-throw the original error if not handled
        throw error;
    }
);

/**
 * Generic API request function
 * @param {Object} config - Axios request configuration
 * @returns {Promise} API response
 */
export const apiRequest = async (config) => {
    try {
        const response = await apiClient(config);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * GET request
 * @param {string} url - Request URL
 * @param {Object} config - Additional configuration
 * @returns {Promise} API response
 */
export const get = (url, config = {}) => {
    return apiRequest({
        method: 'GET',
        url,
        ...config,
    });
};

/**
 * POST request
 * @param {string} url - Request URL
 * @param {Object} data - Request body
 * @param {Object} config - Additional configuration
 * @returns {Promise} API response
 */
export const post = (url, data = {}, config = {}) => {
    return apiRequest({
        method: 'POST',
        url,
        data,
        ...config,
    });
};

/**
 * PUT request
 * @param {string} url - Request URL
 * @param {Object} data - Request body
 * @param {Object} config - Additional configuration
 * @returns {Promise} API response
 */
export const put = (url, data = {}, config = {}) => {
    return apiRequest({
        method: 'PUT',
        url,
        data,
        ...config,
    });
};

/**
 * DELETE request
 * @param {string} url - Request URL
 * @param {Object} config - Additional configuration
 * @returns {Promise} API response
 */
export const del = (url, config = {}) => {
    return apiRequest({
        method: 'DELETE',
        url,
        ...config,
    });
};

export default apiClient;
