import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, styled } from '@mui/material';
import { PersonAdd as PersonAddIcon, Check as CheckIcon } from '@mui/icons-material';
import { socialAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import Spinner from './Spinner';

const StyledFollowButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isFollowing',
})(({ theme, isFollowing }) => ({
  whiteSpace: 'nowrap',
  gap: theme.spacing(1),
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 2),
    fontSize: '0.75rem',
  },
  ...(isFollowing && {
    bgcolor: 'background.default',
    color: 'text.primary',
    border: `1px solid ${theme.palette.divider}`,
    '&:hover:not(:disabled)': {
      bgcolor: 'action.hover',
      borderColor: 'error.main',
      color: 'error.main',
      '& .follow-text::after': {
        content: '" • Unfollow"',
      },
    },
  }),
  ...(!isFollowing && {
    bgcolor: 'primary.main',
    color: 'white',
    boxShadow: theme.shadows[1],
    '&:hover:not(:disabled)': {
      bgcolor: 'primary.dark',
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[2],
    },
  }),
}));

const FollowButton = ({ username, initialIsFollowing, initialFollowersCount, onFollowChange }) => {
  const { showSnackbar } = useNotifications();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;

    // Store original values for rollback
    const originalIsFollowing = isFollowing;
    const originalCount = followersCount;

    // OPTIMISTIC UPDATE - Instant UI change!
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);

    setLoading(true);
    try {
      if (originalIsFollowing) {
        // Unfollow
        await socialAPI.unfollowUser(username);
        showSnackbar(`Unfollowed ${username}`, 'success', { duration: 2000 });
      } else {
        // Follow
        await socialAPI.followUser(username);
        showSnackbar(`Following ${username}! ✓`, 'success', { duration: 2000 });
      }

      // Notify parent component
      if (onFollowChange) {
        onFollowChange(!originalIsFollowing, isFollowing ? followersCount - 1 : followersCount + 1);
      }
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
      showSnackbar(err.response?.data?.error || 'Failed to update follow status', 'error');

      // ROLLBACK on error
      setIsFollowing(originalIsFollowing);
      setFollowersCount(originalCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFollowButton
      onClick={handleFollow}
      disabled={loading}
      isFollowing={isFollowing}
      variant={isFollowing ? 'outlined' : 'contained'}
      color={isFollowing ? undefined : 'primary'}
      startIcon={
        loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '1.25em' }}>
            <Spinner size="sm" color={isFollowing ? 'default' : 'white'} />
          </Box>
        ) : isFollowing ? (
          <CheckIcon sx={{ fontSize: 16 }} />
        ) : (
          <PersonAddIcon sx={{ fontSize: 16 }} />
        )
      }
    >
      {loading ? null : (
        <Box component="span" className="follow-text">
          {isFollowing ? 'Following' : 'Follow'}
        </Box>
      )}
    </StyledFollowButton>
  );
};

FollowButton.propTypes = {
  username: PropTypes.string.isRequired,
  initialIsFollowing: PropTypes.bool.isRequired,
  initialFollowersCount: PropTypes.number,
  onFollowChange: PropTypes.func,
};

export default FollowButton;