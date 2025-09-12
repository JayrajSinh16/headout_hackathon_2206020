import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Utility function to get or create user ID from cookies
const getUserId = () => {
    let userId = document.cookie
        .split('; ')
        .find(row => row.startsWith('campus_feed_user_id='))
        ?.split('=')[1];

    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        document.cookie = `campus_feed_user_id=${userId}; path=/; max-age=${365 * 24 * 60 * 60}`;
    }

    return userId;
};

// Input Component
const SmartInput = ({ onClassified }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiProvider, setAiProvider] = useState('openrouter');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleClassify = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/classify`, {
                text: text.trim(),
                ai_provider: aiProvider
            });

            // Include image data in the result
            const resultWithImage = {
                ...response.data,
                image: selectedImage,
                imagePreview: imagePreview
            };

            onClassified(resultWithImage);
            setText('');
            setSelectedImage(null);
            setImagePreview(null);
        } catch (err) {
            setError('Failed to classify text. Please try again.');
            console.error('Classification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleClassify();
        }
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
                    <button
                        className={`provider-btn ${aiProvider === 'openrouter' ? 'active' : ''}`}
                        onClick={() => setAiProvider('openrouter')}
                        disabled={loading}
                    >
                        OpenRouter
                    </button>
                    <button
                        className={`provider-btn ${aiProvider === 'openai' ? 'active' : ''}`}
                        onClick={() => setAiProvider('openai')}
                        disabled={loading}
                    >
                        OpenAI GPT
                    </button>
                    <button
                        className={`provider-btn ${aiProvider === 'gemini' ? 'active' : ''}`}
                        onClick={() => setAiProvider('gemini')}
                        disabled={loading}
                    >
                        Google Gemini
                    </button>
                </div>
            </div>

            <div className="input-container">
                <textarea
                    className="input-box"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Share what's happening on campus... (powered by ${aiProvider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'})`}
                    disabled={loading}
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
                        Add Image
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

                <button
                    className="send-button"
                    onClick={handleClassify}
                    disabled={loading || !text.trim()}
                >
                    {loading ? '⋯' : '↑'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

// Preview Card Component
const PreviewCard = ({ classification, onPost, onCancel }) => {
    const [formData, setFormData] = useState(classification);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const postData = {
                ...formData,
                user_id: getUserId(),
                imagePreview: classification.imagePreview || null
            };

            await axios.post(`${API_BASE_URL}/api/posts`, postData);
            onPost();
        } catch (err) {
            console.error('Post creation error:', err);
            alert('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="preview-section">
            <div className="preview-card">
                <h3>Does everything look good?</h3>

                <div className="preview-content">
                    <div className="preview-image">
                        {classification.imagePreview ? (
                            <img src={classification.imagePreview} alt="Post preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                            'Image placeholder'
                        )}
                    </div>

                    <div className="preview-details">
                        <div className="form-group">
                            <label>{formData.type === 'EVENT' ? 'Event' : formData.type === 'LOST_FOUND' ? 'Lost & Found' : 'Announcement'} post</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Title"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                placeholder="Description"
                                rows={3}
                            />
                        </div>

                        {formData.type === 'EVENT' && (
                            <>
                                <div className="location-display">
                                    At location: {formData.location || 'Not specified'}
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        placeholder="Location"
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={formData.date || ''}
                                        onChange={(e) => updateField('date', e.target.value)}
                                        placeholder="Date & time"
                                    />
                                </div>

                                <div className="rsvp-preview">
                                    <h4>RSVP:</h4>
                                    <div className="rsvp-buttons-preview">
                                        <div className="rsvp-btn-preview">Going</div>
                                        <div className="rsvp-btn-preview">Maybe</div>
                                        <div className="rsvp-btn-preview">Not going</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {formData.type === 'LOST_FOUND' && (
                            <>
                                <div className="form-group">
                                    <select
                                        value={formData.item_type || 'lost'}
                                        onChange={(e) => updateField('item_type', e.target.value)}
                                    >
                                        <option value="lost">Lost</option>
                                        <option value="found">Found</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        placeholder="Location"
                                    />
                                </div>
                            </>
                        )}

                        {formData.type === 'ANNOUNCEMENT' && (
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={formData.department || ''}
                                    onChange={(e) => updateField('department', e.target.value)}
                                    placeholder="Department"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                        Nah! Restart flow
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Posting...' : 'Looks good! Post it'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Post Card Component
const PostCard = ({ post, userId, onRSVPUpdate }) => {
    const [userRSVP, setUserRSVP] = useState(
        post.user_rsvps && post.user_rsvps[userId] ? post.user_rsvps[userId] : null
    );

    const handleRSVP = async (status) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/posts/${post.id}/rsvp`, {
                user_id: userId,
                status
            });

            setUserRSVP(status);
            onRSVPUpdate(post.id, response.data.rsvp_counts);
        } catch (err) {
            console.error('RSVP error:', err);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            if (diffHours < 24) {
                return `${diffHours} hours ago`;
            } else {
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays} days ago`;
            }
        } catch {
            return '2 hours ago';
        }
    };

    // Get post type display name
    const getPostTypeDisplay = (type) => {
        switch (type) {
            case 'EVENT': return 'New Event';
            case 'LOST_FOUND': return 'Lost & Found';
            case 'ANNOUNCEMENT': return 'Announcement';
            default: return type;
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-user-info">
                    <div className={`post-type-badge ${post.type}`}>
                        {post.type.replace('_', ' ')}
                    </div>
                    <p className="post-user">
                        {getPostTypeDisplay(post.type)}: {post.user_id === 'user_mahesh' ? 'Mahesh' : 'Anonymous'} shared {post.type === 'EVENT' ? 'an event' : post.type === 'LOST_FOUND' ? 'a lost & found item' : 'an announcement'} {formatDate(post.created_at)}
                    </p>
                </div>
            </div>

            <div className="post-content">
                <div className="post-image">
                    {post.imagePreview ? (
                        <img src={post.imagePreview} alt="Post image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                        'Image placeholder'
                    )}
                </div>

                <div className="post-details">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-description">{post.description}</p>

                    <div className="post-meta">
                        {post.location && <span>📍 {post.location}</span>}
                        {post.date && <span>📅 {post.date}</span>}
                        {post.department && <span>🏢 {post.department}</span>}
                        {post.item_type && (
                            <span>
                                {post.item_type === 'lost' ? '❌' : '✅'} {post.item_type.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {post.type === 'EVENT' && post.rsvp_counts && (
                        <div className="rsvp-section">
                            <h4>RSVP:</h4>
                            <div className="rsvp-buttons">
                                <button
                                    className={`rsvp-btn ${userRSVP === 'going' ? 'active going' : ''}`}
                                    onClick={() => handleRSVP('going')}
                                >
                                    Going ({post.rsvp_counts.going})
                                </button>
                                <button
                                    className={`rsvp-btn ${userRSVP === 'interested' ? 'active interested' : ''}`}
                                    onClick={() => handleRSVP('interested')}
                                >
                                    Maybe ({post.rsvp_counts.interested})
                                </button>
                                <button
                                    className={`rsvp-btn ${userRSVP === 'not_going' ? 'active not_going' : ''}`}
                                    onClick={() => handleRSVP('not_going')}
                                >
                                    Not going ({post.rsvp_counts.not_going})
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main App Component
function App() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [classification, setClassification] = useState(null);
    const userId = getUserId();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts`);
            setPosts(response.data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleClassified = (classificationData) => {
        setClassification(classificationData);
        setShowPreview(true);
    };

    const handlePostCreated = () => {
        setShowPreview(false);
        setClassification(null);
        fetchPosts();
    };

    const handlePreviewCancel = () => {
        setShowPreview(false);
        setClassification(null);
    };

    const handleRSVPUpdate = (postId, newCounts) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? { ...post, rsvp_counts: newCounts }
                : post
        ));
    };

    return (
        <div className="app">
            <div className="header">
                <h1>Write your Post Here ^.^ </h1>
            </div>

            <SmartInput onClassified={handleClassified} />

            {showPreview && classification && (
                <PreviewCard
                    classification={classification}
                    onPost={handlePostCreated}
                    onCancel={handlePreviewCancel}
                />
            )}

            <div className="feed">
                <div className="feed-header">
                    <h2>feed!</h2>
                </div>

                {loading ? (
                    <div className="loading">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="empty-state">
                        <h3>No posts yet</h3>
                        <p>Be the first to share something with your campus community!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            userId={userId}
                            onRSVPUpdate={handleRSVPUpdate}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default App;
