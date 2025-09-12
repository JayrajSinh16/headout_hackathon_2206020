/**
 * Custom hook for managing posts state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchPosts, createPost, updateRSVP } from '../services';
import { getUserId } from '../utils';

export const usePosts = (options = {}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const userId = getUserId();

    /**
     * Load posts from API
     */
    const loadPosts = useCallback(async (loadOptions = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchPosts({ ...options, ...loadOptions });

            if (loadOptions.append) {
                setPosts(prev => [...prev, ...response.data]);
            } else {
                setPosts(response.data);
            }

            // Check if there are more posts to load
            setHasMore(response.data.length === (loadOptions.limit || 20));
        } catch (err) {
            setError(err.message);
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    }, [options]);

    /**
     * Create a new post
     */
    const addPost = useCallback(async (postData) => {
        try {
            setError(null);
            const response = await createPost({
                ...postData,
                user_id: userId,
            });

            // Add the new post to the beginning of the list
            setPosts(prev => [response.data, ...prev]);

            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [userId]);

    /**
     * Update RSVP for a post
     */
    const handleRSVP = useCallback(async (postId, status) => {
        try {
            setError(null);
            const response = await updateRSVP(postId, userId, status);

            // Update the post in the list
            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        rsvp_counts: response.data.rsvp_counts || response.data,
                        user_rsvps: {
                            ...post.user_rsvps,
                            [userId]: status
                        }
                    }
                    : post
            ));

            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [userId]);

    /**
     * Refresh posts
     */
    const refresh = useCallback(() => {
        loadPosts();
    }, [loadPosts]);

    /**
     * Load more posts (for pagination)
     */
    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadPosts({
                append: true,
                offset: posts.length
            });
        }
    }, [loadPosts, loading, hasMore, posts.length]);

    // Load posts on mount
    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    return {
        posts,
        loading,
        error,
        hasMore,
        addPost,
        handleRSVP,
        refresh,
        loadMore,
        clearError: () => setError(null),
    };
};
