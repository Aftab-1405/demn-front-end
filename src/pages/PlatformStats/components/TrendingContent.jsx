import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../../services/publicAnalytics';

const MEDIA_HEIGHT = 220;
const CARD_HEIGHT = 460;

/**
 * TrendingContent - Display trending posts and reels in a grid
 */
const TrendingContent = () => {
  const [contentType, setContentType] = useState('all'); // 'all', 'post', 'reel'

  // Fetch trending content
  const {
    data: trendingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['trending', contentType],
    queryFn: () =>
      publicAnalyticsAPI.getTrending({
        type: contentType === 'all' ? undefined : contentType,
        limit: 12,
      }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  const handleTypeChange = (event, newValue) => {
    setContentType(newValue);
  };

  /**
   * TrendingCard - single card
   * Reels: real video player with hover preview, but fixed-size container and visible poster/gradient.
   */
  const TrendingCard = ({ item }) => {
    const isReel = item.type === 'reel';
    const mediaUrl = isReel ? item.thumbnail_url || item.video_url : item.image_url;
    const contentText = item.caption;
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMediaMouseEnter = () => {
      setIsHovered(true);
      if (isReel && item.video_url && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    const handleMediaMouseLeave = () => {
      setIsHovered(false);
      if (isReel && item.video_url && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    return (
      <Card
        elevation={2}
        sx={{
          height: CARD_HEIGHT,
          minHeight: CARD_HEIGHT,
          maxHeight: CARD_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
          borderRadius: 3,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          '&:hover': {
            boxShadow: (theme) => `0 10px 26px ${alpha(theme.palette.primary.main, 0.18)}`,
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.7),
          },
        }}
      >
        {/* Media section: fixed height to avoid jumping */}
        {isReel ? (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px 16px 0 0',
              height: MEDIA_HEIGHT,
              background: (theme) =>
                mediaUrl
                  ? 'transparent'
                  : `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.3)} 0%, ${alpha(
                      theme.palette.secondary.main,
                      0.3
                    )} 100%)`,
            }}
            onMouseEnter={handleMediaMouseEnter}
            onMouseLeave={handleMediaMouseLeave}
          >
            {item.video_url ? (
              <Box
                component="video"
                ref={videoRef}
                src={item.video_url}
                muted
                loop
                playsInline
                poster={mediaUrl || undefined}
                style={{
                  width: '100%',
                  height: MEDIA_HEIGHT,
                  objectFit: 'cover',
                  display: 'block',
                  backgroundColor: '#000',
                }}
              />
            ) : (
              // Fallback if video_url is missing
              <Box
                sx={{
                  height: MEDIA_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'common.white',
                }}
              >
                <VideoIcon sx={{ fontSize: 40 }} />
              </Box>
            )}

            {/* Dark gradient overlay for readability */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.0) 60%)',
                pointerEvents: 'none',
              }}
            />

            {/* Play/Pause overlay (does not change size) */}
            <IconButton
              size="large"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                bgcolor: (theme) => alpha(theme.palette.common.black, 0.6),
                color: 'common.white',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.8),
                },
              }}
            >
              {isHovered ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            {/* Type Badge */}
            <Chip
              icon={<VideoIcon />}
              label="Reel"
              size="small"
              color="info"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.9),
              }}
            />
          </Box>
        ) : mediaUrl ? (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px 16px 0 0',
              minHeight: MEDIA_HEIGHT,
            }}
          >
            <CardMedia
              component="img"
              height={MEDIA_HEIGHT}
              image={mediaUrl}
              alt={contentText?.slice(0, 50)}
              sx={{
                objectFit: 'cover',
                bgcolor: 'grey.200',
              }}
            />
            <Chip
              icon={<ArticleIcon />}
              label="Post"
              size="small"
              color="secondary"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.9),
              }}
            />
          </Box>
        ) : (
          // Fallback for posts without image
          <Box
            sx={{
              height: MEDIA_HEIGHT,
              borderRadius: '16px 16px 0 0',
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(
                  theme.palette.secondary.main,
                  0.18
                )} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'common.white',
            }}
          >
            <ArticleIcon sx={{ fontSize: 40 }} />
          </Box>
        )}

        {/* Text / meta */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Author Info */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={item.author?.profile_picture}
              alt={item.author?.full_name}
              sx={{ width: 40, height: 40 }}
            >
              {item.author?.full_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  noWrap
                  sx={{ maxWidth: '100%' }}
                >
                  {item.author?.full_name}
                </Typography>
                {item.author?.is_verified && (
                  <VerifiedIcon sx={{ fontSize: 16, color: 'info.main' }} />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" noWrap>
                @{item.author?.username}
              </Typography>
            </Box>
          </Stack>

          {/* Content Text */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {contentText || 'No description'}
          </Typography>

          {/* Engagement / actions */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              pt: 2,
              borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              <Typography variant="caption" fontWeight={600}>
                {item.likes?.toLocaleString() ?? 0}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CommentIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="caption" fontWeight={600}>
                {item.comments?.toLocaleString() ?? 0}
              </Typography>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Chip
              icon={<TrendingUpIcon />}
              label={item.engagement?.toFixed(1) ?? 'N/A'}
              size="small"
              color="warning"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <TrendingUpIcon color="warning" />
          <Typography variant="h5" fontWeight={700}>
            Trending Content
          </Typography>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary">
              Loading trending content...
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  }

  // Error state
  if (isError) {
    const isRateLimited = error?.isRateLimited;
    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <TrendingUpIcon color="warning" />
          <Typography variant="h5" fontWeight={700}>
            Trending Content
          </Typography>
        </Stack>
        <Alert severity={isRateLimited ? 'warning' : 'error'}>
          <Typography variant="body2">
            {isRateLimited
              ? 'Rate limit exceeded. Please try again in 60 seconds.'
              : 'Unable to load trending content. Please try again later.'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Normalize API response
  const trendingItems = Array.isArray(trendingData)
    ? trendingData
    : Array.isArray(trendingData?.data)
    ? trendingData.data
    : Array.isArray(trendingData?.trending)
    ? trendingData.trending
    : [];

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingUpIcon color="warning" />
          <Typography variant="h5" fontWeight={700}>
            Trending on D.E.M.N
          </Typography>
          <Chip
            label={`${trendingItems.length} items`}
            size="small"
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {/* Content Type Filter */}
        <Tabs
          value={contentType}
          onChange={handleTypeChange}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Posts" value="post" icon={<ArticleIcon />} iconPosition="start" />
          <Tab label="Reels (Video)" value="reel" icon={<VideoIcon />} iconPosition="start" />
        </Tabs>
      </Stack>

      {/* Grid */}
      {trendingItems.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body2">
            No trending content available at the moment. Check back soon!
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {trendingItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <TrendingCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TrendingContent;