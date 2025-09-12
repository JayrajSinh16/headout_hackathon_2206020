/**
 * Services index
 * Centralized exports for all services
 */

// Base API service
export { default as apiClient, get, post, put, del } from './api';

// Classification service
export {
    classifyText,
    getAvailableProviders,
    isValidProvider,
} from './classificationService';

// Posts service
export {
    createPost,
    fetchPosts,
    updateRSVP,
    getPost,
} from './postsService';
