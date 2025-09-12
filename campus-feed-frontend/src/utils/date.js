/**
 * Date and time utility functions
 */

/**
 * Format a date string to relative time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (dateString) => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 60) {
            return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        } else if (diffDays < 7) {
            return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
        } else {
            return formatDate(date);
        }
    } catch {
        return '2 hours ago'; // Fallback
    }
};

/**
 * Format a date to a readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    try {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        });
    } catch {
        return 'Invalid date';
    }
};

/**
 * Format a date to a full readable string
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatFullDate = (dateInput) => {
    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'Invalid date';
    }
};

/**
 * Parse natural language date input
 * @param {string} dateText - Natural language date
 * @returns {string|null} Parsed date string or null if invalid
 */
export const parseNaturalDate = (dateText) => {
    if (!dateText) return null;

    const text = dateText.toLowerCase().trim();
    const now = new Date();

    // Simple patterns
    if (text.includes('today')) {
        return now.toISOString().split('T')[0];
    }

    if (text.includes('tomorrow')) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    if (text.includes('next week')) {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString().split('T')[0];
    }

    // Try to parse as a regular date
    try {
        const parsed = new Date(dateText);
        if (!isNaN(parsed.getTime())) {
            return parsed.toISOString().split('T')[0];
        }
    } catch {
        // Ignore parsing errors
    }

    return null;
};

/**
 * Check if a date is in the future
 * @param {string|Date} dateInput - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (dateInput) => {
    try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return date > new Date();
    } catch {
        return false;
    }
};
