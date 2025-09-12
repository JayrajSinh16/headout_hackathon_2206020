/**
 * Posts Service
 * Handles all post-related API operations
 */

import { get, post } from './api';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
export const createPost = async (postData) => {
    try {
        if (!postData || !postData.title || !postData.description) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
        }

        const response = await post(API_CONFIG.ENDPOINTS.POSTS, postData);

        return {
            success: true,
            data: response,
        };
    } catch (error) {
        console.error('Post Creation Error:', error);
        throw new Error(ERROR_MESSAGES.POST_CREATION_FAILED);
    }
};

/**
 * Fetch all posts
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of posts
 */
export const fetchPosts = async (options = {}) => {
    try {
        const { department, type, limit, offset } = options;
        const params = new URLSearchParams();

        if (department) params.append('department', department);
        if (type) params.append('type', type);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);

        const queryString = params.toString();
        const url = queryString
            ? `${API_CONFIG.ENDPOINTS.POSTS}?${queryString}`
            : API_CONFIG.ENDPOINTS.POSTS;

        const response = await get(url);

        return {
            success: true,
            data: Array.isArray(response) ? response : [],
        };
    } catch (error) {
        console.error('Fetch Posts Error:', error);
        throw new Error(ERROR_MESSAGES.POSTS_FETCH_FAILED);
    }
};

/**
 * Update RSVP for a post
 * @param {string} postId - Post ID
 * @param {string} userId - User ID
 * @param {string} status - RSVP status
 * @returns {Promise<Object>} Updated RSVP counts
 */
export const updateRSVP = async (postId, userId, status) => {
    try {
        if (!postId || !userId || !status) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
        }

        const response = await post(API_CONFIG.ENDPOINTS.RSVP(postId), {
            user_id: userId,
            status,
        });

        return {
            success: true,
            data: response,
        };
    } catch (error) {
        console.error('RSVP Update Error:', error);
        throw new Error(ERROR_MESSAGES.RSVP_FAILED);
    }
};

/**
 * Get a specific post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>} Post data
 */
export const getPost = async (postId) => {
    try {
        if (!postId) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
        }

        const response = await get(`${API_CONFIG.ENDPOINTS.POSTS}/${postId}`);

        return {
            success: true,
            data: response,
        };
    } catch (error) {
        console.error('Get Post Error:', error);
        throw error;
    }
};
