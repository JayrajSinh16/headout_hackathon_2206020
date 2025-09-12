/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        CLASSIFY: '/api/classify',
        POSTS: '/api/posts',
        RSVP: (postId) => `/api/posts/${postId}/rsvp`,
    },
    TIMEOUT: 10000,
};

// Post Types
export const POST_TYPES = {
    EVENT: 'EVENT',
    LOST_AND_FOUND: 'LOST_FOUND',
    ANNOUNCEMENT: 'ANNOUNCEMENT',
    ACADEMIC: 'ACADEMIC',
    CLUBS_AND_SOCIETIES: 'CLUBS_AND_SOCIETIES',
    OTHER: 'OTHER',
};

// Post Type Display Names
export const POST_TYPE_DISPLAY = {
    [POST_TYPES.EVENT]: 'Event',
    [POST_TYPES.LOST_AND_FOUND]: 'Lost & Found',
    [POST_TYPES.ANNOUNCEMENT]: 'Announcement',
    [POST_TYPES.ACADEMIC]: 'Academic',
    [POST_TYPES.CLUBS_AND_SOCIETIES]: 'Clubs & Societies',
    [POST_TYPES.OTHER]: 'Other',
};

// AI Providers
export const AI_PROVIDERS = {
    OPENAI: 'openai',
    GEMINI: 'gemini',
};

// AI Provider Display Names
export const AI_PROVIDER_DISPLAY = {
    [AI_PROVIDERS.OPENAI]: 'OpenAI GPT',
    [AI_PROVIDERS.GEMINI]: 'Google Gemini',
};

// RSVP Status
export const RSVP_STATUS = {
    GOING: 'going',
    INTERESTED: 'interested',
    NOT_GOING: 'not_going',
};

// RSVP Status Display
export const RSVP_STATUS_DISPLAY = {
    [RSVP_STATUS.GOING]: 'Going',
    [RSVP_STATUS.INTERESTED]: 'Maybe',
    [RSVP_STATUS.NOT_GOING]: 'Not going',
};

// Departments
export const DEPARTMENTS = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'IT',
    'Management',
    'Arts',
    'Science',
    'Administration',
    'General',
];

// Item Types for Lost & Found
export const ITEM_TYPES = {
    LOST: 'lost',
    FOUND: 'found',
};

// Cookie Configuration
export const COOKIE_CONFIG = {
    USER_ID_KEY: 'campus_feed_user_id',
    MAX_AGE: 365 * 24 * 60 * 60, // 1 year in seconds
};

// UI Constants
export const UI_CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    POSTS_PER_PAGE: 20,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    CLASSIFICATION_FAILED: 'Failed to classify text. Please try again.',
    POST_CREATION_FAILED: 'Failed to create post. Please try again.',
    POSTS_FETCH_FAILED: 'Failed to load posts. Please refresh the page.',
    RSVP_FAILED: 'Failed to update RSVP. Please try again.',
    EMPTY_TEXT: 'Please enter some text to share.',
    INVALID_DATA: 'Invalid data provided.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    POST_CREATED: 'Post created successfully!',
    RSVP_UPDATED: 'RSVP updated successfully!',
};

// Validation Rules
export const VALIDATION = {
    MIN_TEXT_LENGTH: 5,
    MAX_TEXT_LENGTH: 1000,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
};

// Default Values
export const DEFAULTS = {
    AI_PROVIDER: AI_PROVIDERS.OPENAI,
    POST_TYPE: POST_TYPES.OTHER,
    DEPARTMENT: 'General',
    ITEM_TYPE: ITEM_TYPES.LOST,
};
