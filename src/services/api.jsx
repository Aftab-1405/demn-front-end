import axios from 'axios';

// Backend host: Use environment variable or empty string for relative paths in production
// In development, Vite proxy handles /static, so we can use empty string
// In production, set VITE_BACKEND_URL if backend is on different domain
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? '' : '');

// API base: Points to backend API prefix
// If no env var is set, it defaults to '/api' (relative path), preventing hardcoded localhost leaks
export const API_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Optional: Remove log in production for security
      if (import.meta.env.DEV) {
        console.log('Token being sent:', token.substring(0, 20) + '...');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);

      // If 401 or 422 (token issues), clear token and redirect to login
      if (error.response.status === 401 || error.response.status === 422) {
        console.error('Auth error:', error.response.data);
        localStorage.removeItem('token');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  // Note: Profile updates moved to usersAPI.updateProfile
  // Use: usersAPI.updateProfile({ full_name, bio })
};

// Users API
export const usersAPI = {
  getUserProfile: (username) => api.get(`/users/${username}`),
  getUserPosts: (username, page = 1) => api.get(`/users/${username}/posts?page=${page}`),
  getUserReels: (username, page = 1) => api.get(`/users/${username}/reels?page=${page}`),
  // TODO: Not currently used, but will be implemented for user search/discovery features
  // Backend endpoint exists and is ready to use
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  aiSearchPosts: (username, query) => api.post(`/users/${username}/ai-search`, { query }),
  uploadProfilePicture: (formData) => {
    return api.post('/users/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteProfilePicture: () => api.delete('/users/profile-picture'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Posts API
export const postsAPI = {
  createPost: (formData, onProgress) => {
    return api.post('/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          try {
            onProgress({ stage: 'upload', progress: percentCompleted });
          } catch (e) {
            // ignore errors from caller callback
          }
        }
      }
    });
  },
  getPosts: (page = 1) => api.get(`/posts/?page=${page}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId) => api.post(`/posts/${postId}/unlike`),
  addComment: (postId, text) => api.post(`/posts/${postId}/comments`, { text }),
  getComments: (postId, page = 1) => api.get(`/posts/${postId}/comments?page=${page}`),
  deleteComment: (commentId) => api.delete(`/posts/comments/${commentId}`),
  getCommentSuggestions: (postId) => api.get(`/posts/${postId}/comment-suggestions`),
};

// Reels API
export const reelsAPI = {
  createReel: (formData, onProgress) => {
    return api.post('/reels/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          try {
            onProgress({ stage: 'upload', progress: percentCompleted });
          } catch (e) {
            // ignore errors from caller callback
          }
        }
      }
    });
  },
  getReels: (page = 1) => api.get(`/reels/?page=${page}`),
  getReel: (reelId) => api.get(`/reels/${reelId}`),
  deleteReel: (reelId) => api.delete(`/reels/${reelId}`),
  likeReel: (reelId) => api.post(`/reels/${reelId}/like`),
  unlikeReel: (reelId) => api.post(`/reels/${reelId}/unlike`),
  addComment: (reelId, text) => api.post(`/reels/${reelId}/comments`, { text }),
  getComments: (reelId, page = 1) => api.get(`/reels/${reelId}/comments?page=${page}`),
  deleteComment: (commentId) => api.delete(`/reels/comments/${commentId}`),
  getCommentSuggestions: (reelId) => api.get(`/reels/${reelId}/comment-suggestions`),
};

// Social API
export const socialAPI = {
  followUser: (username) => api.post(`/social/follow/${username}`),
  unfollowUser: (username) => api.post(`/social/unfollow/${username}`),
  getFollowers: (username, page = 1) => api.get(`/social/followers/${username}?page=${page}`),
  getFollowing: (username, page = 1) => api.get(`/social/following/${username}?page=${page}`),
  getFeed: (page = 1) => api.get(`/social/feed?page=${page}`),
  getExplore: (page = 1) => api.get(`/social/explore?page=${page}`),
};

// Fact-Check API
export const factCheckAPI = {
  checkPost: (postId) => api.post(`/fact-check/post/${postId}`),
  checkReel: (reelId) => api.post(`/fact-check/reel/${reelId}`),
  getPostFactCheckStatus: (postId) => api.get(`/fact-check/post/${postId}/status`),
  getReelFactCheckStatus: (reelId) => api.get(`/fact-check/reel/${reelId}/status`),
  approvePost: (postId, action) => api.post(`/fact-check/post/${postId}/approve`, { action }),
  approveReel: (reelId, action) => api.post(`/fact-check/reel/${reelId}/approve`, { action }),
  getMyReports: () => api.get(`/fact-check/my-reports`),
};

// Analytics API
export const analyticsAPI = {
  getUserAnalytics: (userId, days = 30) => api.get(`/analytics/user/${userId}?days=${days}`),
  getUserGrowth: (userId, days = 30) => api.get(`/analytics/user/${userId}/growth?days=${days}`),
  getPlatformStats: () => api.get(`/analytics/platform`),
  getTrendingContent: (type = 'all', limit = 10) => api.get(`/analytics/trending?type=${type}&limit=${limit}`),
  getFactCheckStats: (days = 30) => api.get(`/analytics/fact-check-stats?days=${days}`),
};

// Uploads API (Pre-processing)
export const uploadsAPI = {
  startPreProcess: (formData) => {
    return api.post('/uploads/pre-process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPreProcessStatus: (taskId) => api.get(`/uploads/pre-process/status/${taskId}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (page = 1, perPage = 20, unreadOnly = false) =>
    api.get(`/notifications?page=${page}&per_page=${perPage}&unread_only=${unreadOnly}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;