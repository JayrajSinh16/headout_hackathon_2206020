/**
 * Smart Input Component
 * AI-powered text input with classification
 */

import React, { useState } from 'react';
import { useClassification } from '../../hooks';
import { AI_PROVIDERS, AI_PROVIDER_DISPLAY } from '../../constants';
import Button from '../common/Button';

const SmartInput = ({ onClassified }) => {
    const [text, setText] = useState('');
    const [aiProvider, setAiProvider] = useState(AI_PROVIDERS.OPENAI);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { loading, error, classify, clearError } = useClassification();

    const handleClassify = async () => {
        if (!text.trim()) return;

        try {
            const result = await classify(text.trim(), aiProvider);
            // Include image data in the result
            const resultWithImage = {
                ...result,
                image: selectedImage,
                imagePreview: imagePreview
            };
            onClassified(resultWithImage);
            setText('');
            setSelectedImage(null);
            setImagePreview(null);
            clearError();
        } catch (err) {
            // Error is handled by the hook
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey && !loading) {
            handleClassify();
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (error) clearError();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    return (
        <div className="input-section">
            <h2>what would you like to share?</h2>

            <div className="ai-provider-selection">
                <label>Choose AI Provider:</label>
                <div className="provider-options">
                    {Object.values(AI_PROVIDERS).map(provider => (
                        <button
                            key={provider}
                            className={`provider-btn ${aiProvider === provider ? 'active' : ''}`}
                            onClick={() => setAiProvider(provider)}
                            disabled={loading}
                        >
                            {AI_PROVIDER_DISPLAY[provider]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="input-container">
                <textarea
                    className="input-box"
                    value={text}
                    onChange={handleTextChange}
                    onKeyPress={handleKeyPress}
                    placeholder={`Share what's happening on campus... (powered by ${AI_PROVIDER_DISPLAY[aiProvider]})`}
                    disabled={loading}
                    rows={4}
                />

                {/* Image Upload Section */}
                <div className="image-upload-section">
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        disabled={loading}
                    />
                    <label htmlFor="image-upload" className="image-upload-btn">
                        📷 Add Image
                    </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" className="preview-image" />
                        <button
                            className="remove-image-btn"
                            onClick={removeImage}
                            type="button"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <Button
                    className="send-button"
                    onClick={handleClassify}
                    disabled={loading || !text.trim()}
                    loading={loading}
                >
                    {loading ? '⋯' : '↑'}
                </Button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="input-hint">
                <small>Tip: Press Ctrl+Enter to classify quickly</small>
            </div>
        </div>
    );
};

export default SmartInput;
