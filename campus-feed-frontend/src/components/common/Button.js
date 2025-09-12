/**
 * Button Component
 */

import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        ghost: 'btn-ghost'
    };
    const sizeClasses = {
        small: 'btn-small',
        medium: 'btn-medium',
        large: 'btn-large'
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'btn-disabled',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner">⋯</span>}
            {children}
        </button>
    );
};

export default Button;
