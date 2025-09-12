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
    const { loading, error, classify, clearError } = useClassification();

    const handleClassify = async () => {
        if (!text.trim()) return;

        try {
            const result = await classify(text.trim(), aiProvider);
            onClassified(result);
            setText('');
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
