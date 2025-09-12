/**
 * Custom hook for managing form state and validation
 */

import { useState, useCallback } from 'react';
import { validateText } from '../utils';

export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Update a field value
     */
    const updateField = useCallback((field, value) => {
        setValues(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    }, [errors]);

    /**
     * Mark a field as touched
     */
    const touchField = useCallback((field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    }, []);

    /**
     * Validate a specific field
     */
    const validateField = useCallback((field, value = values[field]) => {
        const rules = validationRules[field];
        if (!rules) return null;

        const validation = validateText(value, rules);
        return validation.isValid ? null : validation.errors[0];
    }, [values, validationRules]);

    /**
     * Validate all fields
     */
    const validateForm = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(field => {
            const error = validateField(field);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [validationRules, validateField]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async (onSubmit) => {
        try {
            setIsSubmitting(true);

            // Mark all fields as touched
            const allFields = Object.keys(validationRules);
            const newTouched = {};
            allFields.forEach(field => {
                newTouched[field] = true;
            });
            setTouched(newTouched);

            // Validate form
            const isValid = validateForm();
            if (!isValid) {
                return false;
            }

            // Call submit handler
            await onSubmit(values);
            return true;
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validationRules, validateForm]);

    /**
     * Reset form to initial values
     */
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    /**
     * Update multiple fields at once
     */
    const updateFields = useCallback((newValues) => {
        setValues(prev => ({ ...prev, ...newValues }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        updateField,
        touchField,
        validateField,
        validateForm,
        handleSubmit,
        reset,
        updateFields,
        isValid: Object.keys(errors).length === 0,
    };
};
