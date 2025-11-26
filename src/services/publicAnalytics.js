/**
 * Public Analytics API Service
 *
 * Provides access to public analytics endpoints that don't require authentication.
 * These endpoints are:
 * - Rate limited: 30 requests per minute
 * - Cached: 60 seconds TTL via Redis
 * - Unauthenticated: Accessible before user login
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Create Axios instance for public API calls
 * No authentication interceptors needed
 */
const publicAPI = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add response interceptor for rate limit handling
 */
publicAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      console.warn('[Public API] Rate limit exceeded. Please try again in 60 seconds.');
      error.isRateLimited = true;
    }
    return Promise.reject(error);
  }
);

/**
 * Public Analytics API Endpoints
 */
export const publicAnalyticsAPI = {
  /**
   * Get platform-wide statistics
   *
   * Returns:
   * - totals: { users, posts, reels, content, fact_checks }
   * - verification_stats: { verified_users, verified_content }
   * - snapshot_24h: { new_users, new_posts, new_reels }
   *
   * @returns {Promise} Platform stats
   */
  getPlatformStats: async () => {
    try {
      const response = await publicAPI.get('/api/analytics/platform');
      return response.data;
    } catch (error) {
      console.error('[Public API] Failed to fetch platform stats:', error);
      throw error;
    }
  },

  /**
   * Get trending posts and reels
   *
   * @param {Object} params - Query parameters
   * @param {string} params.type - 'post' or 'reel' (default: both)
   * @param {number} params.limit - Max items to return (default: 10, max: 50)
   *
   * Returns: Array of trending content with:
   * - id, author (name, username, is_verified), text/description
   * - media (type, url, thumbnail_url)
   * - engagement (likes, comments, shares, score)
   * - created_at
   *
   * @returns {Promise} Trending content array
   */
  getTrending: async (params = {}) => {
    try {
      const response = await publicAPI.get('/api/analytics/trending', { params });
      return response.data;
    } catch (error) {
      console.error('[Public API] Failed to fetch trending content:', error);
      throw error;
    }
  },

  /**
   * Get fact-check statistics
   *
   * @param {Object} params - Query parameters
   * @param {number} params.days - Number of days to include (default: 7, max: 90)
   *
   * Returns:
   * - summary: { total, verified, fake, misleading, unverified, verification_rate }
   * - breakdown: Array of daily stats with counts by outcome
   *
   * @returns {Promise} Fact-check statistics
   */
  getFactCheckStats: async (params = { days: 7 }) => {
    try {
      const response = await publicAPI.get('/api/analytics/fact-check-stats', { params });
      return response.data;
    } catch (error) {
      console.error('[Public API] Failed to fetch fact-check stats:', error);
      throw error;
    }
  },
};

export default publicAnalyticsAPI;
