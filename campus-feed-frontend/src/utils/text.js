/**
 * Text and string utility functions
 */

import { VALIDATION } from '../constants';

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => capitalizeFirst(word))
        .join(' ');
};

/**
 * Clean and normalize text input
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export const cleanText = (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
};

/**
 * Validate text input
 * @param {string} text - Text to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateText = (text, options = {}) => {
    const {
        minLength = VALIDATION.MIN_TEXT_LENGTH,
        maxLength = VALIDATION.MAX_TEXT_LENGTH,
        required = true,
    } = options;

    const cleanedText = cleanText(text);
    const errors = [];

    if (required && !cleanedText) {
        errors.push('This field is required');
    }

    if (cleanedText && cleanedText.length < minLength) {
        errors.push(`Minimum ${minLength} characters required`);
    }

    if (cleanedText && cleanedText.length > maxLength) {
        errors.push(`Maximum ${maxLength} characters allowed`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        value: cleanedText,
    };
};

/**
 * Extract hashtags from text
 * @param {string} text - Text to extract hashtags from
 * @returns {string[]} Array of hashtags
 */
export const extractHashtags = (text) => {
    if (!text) return [];
    const hashtags = text.match(/#[\w]+/g) || [];
    return hashtags.map(tag => tag.toLowerCase());
};

/**
 * Extract mentions from text
 * @param {string} text - Text to extract mentions from
 * @returns {string[]} Array of mentions
 */
export const extractMentions = (text) => {
    if (!text) return [];
    const mentions = text.match(/@[\w]+/g) || [];
    return mentions.map(mention => mention.toLowerCase());
};

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted terms
 */
export const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Generate a slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} Generated slug
 */
export const generateSlug = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
