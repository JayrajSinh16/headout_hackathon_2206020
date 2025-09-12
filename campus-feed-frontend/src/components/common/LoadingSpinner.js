/**
 * Loading Spinner Component
 */

import React from 'react';

const LoadingSpinner = ({
    size = 'medium',
    color = 'primary',
    text = 'Loading...',
    showText = true
}) => {
    const sizeClasses = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    };

    const colorClasses = {
        primary: 'spinner-primary',
        secondary: 'spinner-secondary',
        white: 'spinner-white'
    };

    return (
        <div className="loading-spinner">
            <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
            {showText && <span className="spinner-text">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;
