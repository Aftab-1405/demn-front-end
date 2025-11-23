import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
  Link,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
  keyframes,
  styled,
  alpha,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkBorderIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { postsAPI, reelsAPI, BACKEND_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import CommentSection from '../CommentSection';
import FactCheckModal from './FactCheckModal';
import PostOptionsModal from './PostOptionsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PostModal from './PostModal';

// Animations
const heartBeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  10% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1.25);
  }
  90% {
    transform: scale(1.15);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const StyledPostCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})(({ theme, clickable }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.25),
  overflow: 'hidden',
  marginBottom: theme.spacing(1.25),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  cursor: clickable ? 'pointer' : 'default',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: theme.spacing(1.5),
    padding: '1px',
    background: `linear-gradient(135deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: clickable ? 'translateY(-4px) scale(1.01)' : 'translateY(-2px)',
    boxShadow: clickable
      ? `0 8px 20px ${alpha(theme.palette.common.black, 0.1)}, 0 0 30px ${alpha(theme.palette.primary.main, 0.1)}`
      : theme.shadows[4],
    '&::before': {
      opacity: 1,
    },
  },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));

const StyledMediaContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  background: theme.palette.background.default,
  flexShrink: 0,
  overflow: 'hidden',
}));

const StyledMediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  maxHeight: 450,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)',
}));

const StyledMaximizeButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1.5),
  right: theme.spacing(1.5),
  background: 'transparent',
  color: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(0, 0, 0, 0.85)',
  zIndex: 2,
  width: 36,
  height: 36,
  padding: theme.spacing(0.75),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'transparent',
    transform: 'scale(1.1) translateY(-2px)',
    color: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 1)' 
      : 'rgba(0, 0, 0, 1)',
  },
  '&:active': {
    transform: 'scale(0.95) translateY(0)',
  },
  '& svg': {
    filter: theme.palette.mode === 'dark'
      ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))'
      : 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.8)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.6))',
    transition: 'transform 0.2s ease, filter 0.2s ease',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
    filter: theme.palette.mode === 'dark'
      ? 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.7)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
      : 'drop-shadow(0 3px 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 2px 4px rgba(255, 255, 255, 0.7))',
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    padding: theme.spacing(0.625),
  },
}));

const StyledActions = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const StyledActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'liked' && prop !== 'factcheck',
})(({ theme, liked, factcheck }) => ({
  width: 32,
  height: 32,
  padding: theme.spacing(0.375),
  color: liked ? theme.palette.error.main : theme.palette.text.primary,
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  ...(liked && {
    animation: `${heartBeat} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
    '& svg': {
      filter: `drop-shadow(0 0 4px ${theme.palette.error.main})`,
    },
  }),
  ...(factcheck && {
    color: theme.palette.warning.main,
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: -2,
      borderRadius: '50%',
      padding: '2px',
      background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover:not(:disabled)': {
      background: alpha(theme.palette.warning.main, 0.1),
      transform: 'scale(1.1)',
      '&::before': {
        opacity: 0.6,
        animation: `${rotate} 3s linear infinite`,
      },
    },
  }),
  '&:hover:not(:disabled)': {
    background: theme.palette.action.hover,
    transform: 'scale(1.1)',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(0.85)',
  },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    filter: 'grayscale(1)',
  },
}));

const PostCard = ({ item, type, onUpdate, onClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useNotifications();
  const [showFactCheckModal, setShowFactCheckModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Optimistic UI updates for likes (no reload!)
  const [localLiked, setLocalLiked] = useState(item.is_liked);
  const [localLikesCount, setLocalLikesCount] = useState(item.likes_count);

  const isPost = type === 'post';
  const contentId = item.id;
  const isOwnPost = user && item.author && user.id === item.author.id;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;

    const originalLiked = localLiked;
    const originalCount = localLikesCount;

    setLocalLiked(!localLiked);
    setLocalLikesCount(prev => localLiked ? prev - 1 : prev + 1);

    setIsLiking(true);
    try {
      if (originalLiked) {
        isPost ? await postsAPI.unlikePost(contentId) : await reelsAPI.unlikeReel(contentId);
      } else {
        isPost ? await postsAPI.likePost(contentId) : await reelsAPI.likeReel(contentId);
        showSnackbar('Liked! ❤️', 'success', { duration: 1500 });
      }
    } catch (err) {
      console.error('Failed to like:', err);
      showSnackbar('Failed to like post', 'error');
      setLocalLiked(originalLiked);
      setLocalLikesCount(originalCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      isPost ? await postsAPI.deletePost(contentId) : await reelsAPI.deleteReel(contentId);
      setShowDeleteConfirm(false);
      setShowOptionsModal(false);

      if (onUpdate) {
        await onUpdate();
      } else {
        navigate('/feed');
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      showSnackbar('Failed to delete. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSharePost = async () => {
    const shareUrl = window.location.origin + `/${isPost ? 'post' : 'reel'}/${contentId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this ${isPost ? 'post' : 'reel'} by ${item.author.username}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSnackbar('Link copied to clipboard!', 'success', { duration: 2000 });
      }
      setShowOptionsModal(false);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const renderVerificationBadge = (status) => {
    const badges = {
      verified: { text: 'Verified', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 12 }} /> },
      disputed: { text: 'Disputed', color: 'error', icon: <WarningIcon sx={{ fontSize: 12 }} /> },
      unverified: { text: 'Unverified', color: 'default', icon: '?' },
      pending: { text: 'Pending', color: 'default', icon: '⏳' },
    };

    if (status === 'not_applicable' || status === 'no_claims' || !status) {
      return null;
    }

    const badge = badges[status] || badges.unverified;
    return (
      <Chip
        label={badge.text}
        size="small"
        icon={typeof badge.icon === 'string' ? undefined : badge.icon}
        color={badge.color}
        sx={{
          height: 20,
          fontSize: '0.65rem',
          fontWeight: 600,
          textTransform: 'capitalize',
          letterSpacing: '0.3px',
          '& .MuiChip-icon': {
            fontSize: 12,
            marginLeft: 0.5,
          },
        }}
      />
    );
  };

  const factCheck = item.fact_check;
  const verificationBadge = renderVerificationBadge(item.verification_status);
  const isClickable = !!onClick;
  const MotionPostCard = motion(StyledPostCard);

  return (
    <>
      <MotionPostCard
        clickable={isClickable}
        onClick={onClick}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        layout={false}
      >
        {/* Post Header */}
        <StyledHeader component="header">
          <Link
            component={RouterLink}
            to={`/profile/${item.author.username}`}
            onClick={(e) => { if (isClickable) e.preventDefault(); e.stopPropagation(); }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              textDecoration: 'none',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Avatar
              src={item.author.profile_picture ? `${BACKEND_URL}${item.author.profile_picture}` : undefined}
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                border: (theme) => `2px solid ${theme.palette.divider}`,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 700,
              }}
            >
              {!item.author.profile_picture && item.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.author.username}
            </Typography>
          </Link>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {verificationBadge && (
              <Box sx={{ flexShrink: 0 }}>
                {verificationBadge}
              </Box>
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsModal(true);
              }}
              title="More options"
              aria-label="More options"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              <MoreVertIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </StyledHeader>

        {/* Media Content */}
        <StyledMediaContainer>
          {isPost && item.image_url && (
            <StyledMediaWrapper>
              <Box
                component="img"
                src={`${BACKEND_URL}${item.image_url}`}
                alt="Post"
                loading="lazy"
                decoding="async"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
              <StyledMaximizeButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPostModal(true);
                }}
                title="View full image"
                aria-label="View full image"
              >
                <FullscreenIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              </StyledMaximizeButton>
            </StyledMediaWrapper>
          )}

          {!isPost && item.video_url && (
            <StyledMediaWrapper>
              <Box
                component="video"
                src={`${BACKEND_URL}${item.video_url}`}
                controls
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </StyledMediaWrapper>
          )}
        </StyledMediaContainer>

        {/* Actions */}
        <StyledActions>
          <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
            <StyledActionButton
              onClick={handleLike}
              liked={localLiked}
              disabled={isLiking || isClickable}
              title={localLiked ? 'Unlike' : 'Like'}
              aria-label={localLiked ? 'Unlike' : 'Like'}
            >
              {localLiked ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
            </StyledActionButton>
            <StyledActionButton
              title="Comment"
              disabled={isClickable}
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentsModal(true);
              }}
            >
              <CommentIcon sx={{ fontSize: 20 }} />
            </StyledActionButton>
            <StyledActionButton
              title="Share"
              disabled={isClickable}
              onClick={(e) => e.stopPropagation()}
            >
              <ShareIcon sx={{ fontSize: 20 }} />
            </StyledActionButton>
            {factCheck &&
              factCheck.status &&
              (factCheck.status === 'verified' ||
                factCheck.status === 'disputed' ||
                factCheck.status === 'unverified') && (
                <StyledActionButton
                  factcheck
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFactCheckModal(true);
                  }}
                  title="View fact-check details"
                  aria-label="View fact-check details"
                >
                  <InfoIcon sx={{ fontSize: 22 }} />
                </StyledActionButton>
              )}
          </Stack>
          <StyledActionButton
            title="Save"
            disabled={isClickable}
            onClick={(e) => e.stopPropagation()}
          >
            <BookmarkBorderIcon sx={{ fontSize: 20 }} />
          </StyledActionButton>
        </StyledActions>

        {/* Likes, Caption, Comments */}
        {!isClickable && (
          <>
            <Box
              sx={{
                px: { xs: 1.75, sm: 2 },
                pb: { xs: 0.75, sm: 1.25 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: 'text.primary',
              }}
            >
              <Typography component="span" sx={{ fontWeight: 600 }}>
                {localLikesCount}
              </Typography>{' '}
              <Typography component="span">
                {localLikesCount === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>

            <Box
              sx={{
                px: { xs: 1.75, sm: 2 },
                pb: { xs: 0.75, sm: 1.25 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.5,
                color: 'text.primary',
                maxHeight: 100,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
              }}
            >
              <Link
                component={RouterLink}
                to={`/profile/${item.author.username}`}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {item.author.username}
              </Link>
              {item.caption && (
                <Typography component="span" sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  {' '}
                  {item.caption}
                </Typography>
              )}
            </Box>

            {item.comments_count > 0 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommentsModal(true);
                }}
                sx={{
                  px: { xs: 1.75, sm: 2 },
                  pb: { xs: 1.25, sm: 1.75 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  minWidth: 'auto',
                  '&:active': {
                    color: 'text.disabled',
                  },
                }}
              >
                View all {item.comments_count} comments
              </Button>
            )}
          </>
        )}

        {isClickable && (
          <Box
            sx={{
              fontSize: '0.875rem',
              color: 'primary.main',
              fontWeight: 500,
              textAlign: 'center',
              p: 1.875,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            This content is pending verification. Click to review and publish.
          </Box>
        )}
      </MotionPostCard>

      {/* Modals */}
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        item={item}
        isPost={isPost}
      />

      <FactCheckModal
        isOpen={showFactCheckModal}
        onClose={() => setShowFactCheckModal(false)}
        factCheck={factCheck}
        item={item}
        renderVerificationBadge={renderVerificationBadge}
      />

      <PostOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        isOwnPost={isOwnPost}
        isPost={isPost}
        onDelete={() => {
          setShowOptionsModal(false);
          setShowDeleteConfirm(true);
        }}
        onViewDetails={() => {
          setShowOptionsModal(false);
          navigate(`/${isPost ? 'post' : 'reel'}/${contentId}`);
        }}
        onShare={handleSharePost}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        isPost={isPost}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />

      <Dialog
        open={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={useMediaQuery(useTheme().breakpoints.down('md'))}
        PaperProps={{
          sx: {
            borderRadius: useMediaQuery(useTheme().breakpoints.down('md')) ? 0 : 3,
            m: useMediaQuery(useTheme().breakpoints.down('md')) ? 0 : 2,
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <IconButton
          aria-label="Close dialog"
          onClick={() => setShowCommentsModal(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
            opacity: 0.7,
            zIndex: 1,
            '&:hover': {
              opacity: 1,
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle
          sx={{
            pt: 2.5,
            pr: 6,
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          Comments
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 2,
            px: 3,
            pb: 3,
          }}
        >
          <CommentSection
            contentId={contentId}
            type={type}
            initialCommentsCount={item.comments_count}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

PostCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      profile_picture: PropTypes.string,
    }).isRequired,
    caption: PropTypes.string,
    image_url: PropTypes.string,
    video_url: PropTypes.string,
    likes_count: PropTypes.number,
    comments_count: PropTypes.number,
    is_liked: PropTypes.bool,
    verification_status: PropTypes.oneOf(['verified', 'disputed', 'unverified', 'pending', 'not_applicable', 'no_claims']),
    fact_check: PropTypes.object,
    is_edited: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['post', 'reel']).isRequired,
  onUpdate: PropTypes.func,
  onClick: PropTypes.func,
};

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
  if (prevProps.item.id !== nextProps.item.id) return false;
  if (prevProps.type !== nextProps.type) return false;
  
  if (
    prevProps.item.likes_count !== nextProps.item.likes_count ||
    prevProps.item.comments_count !== nextProps.item.comments_count ||
    prevProps.item.is_liked !== nextProps.item.is_liked ||
    prevProps.item.verification_status !== nextProps.item.verification_status ||
    prevProps.item.caption !== nextProps.item.caption
  ) {
    return false;
  }
  
  if (
    prevProps.item.author?.id !== nextProps.item.author?.id ||
    prevProps.item.author?.username !== nextProps.item.author?.username ||
    prevProps.item.author?.profile_picture !== nextProps.item.author?.profile_picture
  ) {
    return false;
  }
  
  if (prevProps.onUpdate !== nextProps.onUpdate) return false;
  if (prevProps.onClick !== nextProps.onClick) return false;
  
  return true;
};

export default React.memo(PostCard, areEqual);

