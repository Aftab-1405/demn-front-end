import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Divider,
  Link,
  keyframes,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { postsAPI, reelsAPI, BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import ContentModerationError from './ContentModerationError';
import Spinner from './Spinner';

// Animations
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const CommentSection = ({ contentId, type, initialCommentsCount = 0 }) => {
  const { user } = useAuth();
  const { showSnackbar } = useNotifications();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [totalComments, setTotalComments] = useState(initialCommentsCount);
  const [moderationError, setModerationError] = useState(null);
  const [showModerationError, setShowModerationError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const isPost = type === 'post';
  const api = isPost ? postsAPI : reelsAPI;

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.getComments(contentId);
      setComments(response.data.comments);
      setTotalComments(response.data.total);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      showSnackbar('Failed to load comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI comment suggestions
  const fetchSuggestions = async () => {
    if (!user) return;

    try {
      setLoadingSuggestions(true);
      console.log(`🤖 Fetching AI comment suggestions for ${type} ${contentId}...`);
      const response = await api.getCommentSuggestions(contentId);

      if (response && response.data && response.data.suggestions) {
        console.log('✅ AI suggestions received:', response.data.suggestions);
        setSuggestions(response.data.suggestions);
      } else {
        console.warn('⚠️ No suggestions in response, using defaults');
        setSuggestions([
          type === 'post' ? "Beautiful! 📸✨" : "Amazing! 🔥😍",
          "Kya baat hai! 👌💯",
          "Loved it! ❤️🙌"
        ]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch AI comment suggestions:', err);
      console.error('Error details:', err.response || err.message);

      // Check if backend endpoint exists
      if (err.response && err.response.status === 404) {
        console.error('🚨 Backend endpoint not found! Please restart the backend server.');
        showSnackbar('AI suggestions unavailable. Please restart the server.', 'error');
      }

      // Set default suggestions on error
      setSuggestions([
        type === 'post' ? "Beautiful! 📸✨" : "Amazing! 🔥😍",
        "Kya baat hai! 👌💯",
        "Loved it! ❤️🙌"
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, type]);

  // Add comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      showSnackbar('Please enter a comment', 'error');
      return;
    }

    if (commentText.length > 500) {
      showSnackbar('Comment must be 500 characters or less', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.addComment(contentId, commentText.trim());

      // Add new comment to top of list
      setComments([response.data.comment, ...comments]);
      setTotalComments(prev => prev + 1);
      setCommentText('');
      showSnackbar('Comment added!', 'success', { duration: 2000 });
    } catch (err) {
      console.error('Failed to add comment:', err);

      // Check if it's a content moderation error (AI detected policy violation)
      if (err.response && [400, 500, 503].includes(err.response.status)) {
        setModerationError(err.response.data);
        setShowModerationError(true);
        showSnackbar('AI detected policy violation in your comment', 'error');
      } else {
        showSnackbar(err.response?.data?.error || 'Failed to add comment', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (deletingId) return;

    setDeletingId(commentId);
    try {
      await api.deleteComment(commentId);

      // Remove from list
      setComments(comments.filter(c => c.id !== commentId));
      setTotalComments(prev => prev - 1);
      showSnackbar('Comment deleted', 'success', { duration: 2000 });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      showSnackbar(err.response?.data?.error || 'Failed to delete comment', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 2, md: 3 },
        pb: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          pb: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', m: 0 }}>
          Comments ({totalComments})
        </Typography>
      </Box>

      {/* Add Comment Form */}
      {user && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, md: 3 },
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          {/* AI Comment Suggestions Loading */}
          {loadingSuggestions && !commentText && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                animation: `${slideDown} 0.3s ease-out`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <HelpOutlineIcon
                  sx={{
                    fontSize: 16,
                    color: 'primary.main',
                    flexShrink: 0,
                    animation: `${pulse} 1.5s ease-in-out infinite`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    animation: `${fadeInOut} 1.5s ease-in-out infinite`,
                  }}
                >
                  D.E.M.N is thinking...
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Box sx={{ height: 32, width: 140, borderRadius: '999px', bgcolor: 'action.hover' }} />
                <Box sx={{ height: 32, width: 110, borderRadius: '999px', bgcolor: 'action.hover' }} />
                <Box sx={{ height: 32, width: 130, borderRadius: '999px', bgcolor: 'action.hover' }} />
              </Stack>
            </Box>
          )}

          {/* AI Comment Suggestions */}
          {!loadingSuggestions && suggestions.length > 0 && !commentText && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                animation: `${slideDown} 0.3s ease-out`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <HelpOutlineIcon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
                  AI suggestions:
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => setCommentText(suggestion)}
                    sx={{
                      bgcolor: 'background.paper',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        borderColor: 'primary.main',
                        color: 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Avatar
              src={user.profile_picture ? `${BACKEND_URL}${user.profile_picture}` : undefined}
              sx={{
                width: 30,
                height: 30,
                border: (theme) => `2px solid ${theme.palette.divider}`,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {!user.profile_picture && user.username.charAt(0).toUpperCase()}
            </Avatar>
            <TextField
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              inputProps={{ maxLength: 500 }}
              disabled={submitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                },
              }}
            />
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
              {commentText.length}/500
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              disabled={!commentText.trim() || submitting}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 120 },
              }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </Button>
          </Stack>
        </Box>
      )}

      {!user && (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem',
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: 'background.default',
          }}
        >
          <Link component={RouterLink} to="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Log in
          </Link>{' '}
          to comment
        </Box>
      )}

      {/* Comments List */}
      <Box
        sx={{
          maxHeight: { xs: '60vh', md: 500 },
          overflowY: 'auto',
          px: { xs: 0.5, md: 1 },
        }}
      >
        {loading && comments.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 8,
              px: 3,
              color: 'text.secondary',
            }}
          >
            <Spinner />
            <Typography variant="body2">Loading comments...</Typography>
          </Box>
        ) : comments.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              py: 8,
              px: 3,
              color: 'text.disabled',
              textAlign: 'center',
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', m: 0 }}>
              No comments yet
            </Typography>
            <Typography variant="body2">Be the first to comment!</Typography>
          </Box>
        ) : (
          comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                display: 'flex',
                gap: 2,
                p: { xs: 2, md: 3 },
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                transition: 'background 0.2s ease',
                '&:hover': {
                  bgcolor: 'background.default',
                },
              }}
            >
              <Link
                component={RouterLink}
                to={`/profile/${comment.author.username}`}
                sx={{ textDecoration: 'none' }}
              >
                <Avatar
                  src={comment.author.profile_picture ? `${BACKEND_URL}${comment.author.profile_picture}` : undefined}
                  sx={{
                    width: 32,
                    height: 32,
                    border: (theme) => `2px solid ${theme.palette.divider}`,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {!comment.author.profile_picture && comment.author.username.charAt(0).toUpperCase()}
                </Avatar>
              </Link>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Link
                    component={RouterLink}
                    to={`/profile/${comment.author.username}`}
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {comment.author.username}
                  </Link>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ m: 0, color: 'text.primary', lineHeight: 1.6, wordWrap: 'break-word' }}>
                  {comment.text}
                </Typography>
              </Box>
              {user && user.id === comment.author.id && (
                <IconButton
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  title="Delete comment"
                  size="small"
                  sx={{
                    color: 'text.disabled',
                    '&:hover:not(:disabled)': {
                      bgcolor: 'action.hover',
                      color: 'error.main',
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  {deletingId === comment.id ? (
                    <Spinner size="sm" color="error" />
                  ) : (
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* Content Moderation Error Modal */}
      <ContentModerationError
        isOpen={showModerationError}
        onClose={() => {
          setShowModerationError(false);
          setModerationError(null);
        }}
        error={moderationError}
      />
    </Box>
  );
};

CommentSection.propTypes = {
  contentId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['post', 'reel']).isRequired,
  initialCommentsCount: PropTypes.number,
};

export default CommentSection;