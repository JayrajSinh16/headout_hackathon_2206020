/**
 * User-related utility functions
 */

import { COOKIE_CONFIG } from '../constants';

/**
 * Get or create user ID from cookies
 * @returns {string} User ID
 */
export const getUserId = () => {
    let userId = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${COOKIE_CONFIG.USER_ID_KEY}=`))
        ?.split('=')[1];

    if (!userId) {
        userId = generateUserId();
        setUserIdCookie(userId);
    }

    return userId;
};

/**
 * Generate a new user ID
 * @returns {string} Generated user ID
 */
export const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Set user ID in cookie
 * @param {string} userId - User ID to set
 */
export const setUserIdCookie = (userId) => {
    document.cookie = `${COOKIE_CONFIG.USER_ID_KEY}=${userId}; path=/; max-age=${COOKIE_CONFIG.MAX_AGE}`;
};

/**
 * Clear user ID cookie
 */
export const clearUserIdCookie = () => {
    document.cookie = `${COOKIE_CONFIG.USER_ID_KEY}=; path=/; max-age=0`;
};

/**
 * Check if user is the owner of a post
 * @param {string} postUserId - User ID from the post
 * @param {string} currentUserId - Current user ID
 * @returns {boolean} True if user owns the post
 */
export const isPostOwner = (postUserId, currentUserId = null) => {
    const userId = currentUserId || getUserId();
    return postUserId === userId;
};
