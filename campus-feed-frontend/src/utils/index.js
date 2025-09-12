/**
 * Utility functions index
 * Centralized exports for all utility functions
 */

// User utilities
export {
    getUserId,
    generateUserId,
    setUserIdCookie,
    clearUserIdCookie,
    isPostOwner,
} from './user';

// Date utilities
export {
    formatRelativeTime,
    formatDate,
    formatFullDate,
    parseNaturalDate,
    isFutureDate,
} from './date';

// Text utilities
export {
    truncateText,
    capitalizeFirst,
    toTitleCase,
    cleanText,
    validateText,
    extractHashtags,
    extractMentions,
    highlightText,
    generateSlug,
} from './text';
