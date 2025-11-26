import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../../services/publicAnalytics';

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
    staleTime: 60 * 1000, // 60s
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  /**
   * Handle content type change
   */
  const handleTypeChange = (event, newValue) => {
    setContentType(newValue);
  };

  /**
   * TrendingCard - Display single trending item
   * API Response: { type, video_url, image_url, thumbnail_url, caption, author, engagement, ... }
   */
  const TrendingCard = ({ item }) => {
    const isReel = item.type === 'reel';
    // Get media URL based on content type (reels have thumbnail_url or video_url, posts have image_url)
    const mediaUrl = isReel ? (item.thumbnail_url || item.video_url) : item.image_url;
    const contentText = item.caption;

    return (
      <Card
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => `0 16px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        }}
      >
        {/* Media Thumbnail */}
        {mediaUrl && (
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={mediaUrl}
              alt={contentText?.slice(0, 50)}
              sx={{
                objectFit: 'cover',
                bgcolor: 'grey.200',
              }}
            />
            {/* Type Badge */}
            <Chip
              icon={isReel ? <VideoIcon /> : <ArticleIcon />}
              label={isReel ? 'Reel' : 'Post'}
              size="small"
              color={isReel ? 'info' : 'secondary'}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 700,
                backdropFilter: 'blur(10px)',
                bgcolor: (theme) =>
                  alpha(isReel ? theme.palette.info.main : theme.palette.secondary.main, 0.9),
              }}
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Author Info */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={item.author?.profile_picture}
              alt={item.author?.full_name}
              sx={{ width: 40, height: 40 }}
            >
              {item.author?.full_name?.charAt(0).toUpperCase()}
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

          {/* Engagement Metrics */}
          <Stack
            direction="row"
            spacing={2}
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

  /**
   * Render loading state
   */
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

  /**
   * Render error state
   */
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

  // Handle different API response formats
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
            Trending Content
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
          <Tab label="Reels" value="reel" icon={<VideoIcon />} iconPosition="start" />
        </Tabs>
      </Stack>

      {/* Trending Grid */}
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
