import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  alpha,
  Divider,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  FactCheck as FactCheckIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../services/publicAnalytics';
import TrendingContent from './components/TrendingContent';
import FactCheckCharts from './components/FactCheckCharts';

/**
 * PlatformStats - Public marketing/landing page with analytics
 *
 * Displays:
 * - Platform-wide totals (users, posts, reels, fact checks)
 * - 24-hour activity snapshot
 * - Verification statistics
 * - Trending content carousel
 * - Fact-check outcome visualizations
 */
const PlatformStats = () => {
  // Fetch platform stats with React Query
  const {
    data: platformStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
  } = useQuery({
    queryKey: ['platformStats'],
    queryFn: publicAnalyticsAPI.getPlatformStats,
    staleTime: 60 * 1000, // 60s (matches backend cache)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on rate limit
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  /**
   * StatCard - Reusable component for displaying a stat
   */
  const StatCard = ({ icon: Icon, label, value, color = 'primary', subtitle }) => (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(
            theme.palette[color].dark,
            0.05
          )} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette[color].main, 0.2)}`,
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.15),
              }}
            >
              <Icon sx={{ fontSize: 32, color: `${color}.main` }} />
            </Box>
            {subtitle && (
              <Chip
                label={subtitle}
                size="small"
                color={color}
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color={`${color}.main`}>
              {value?.toLocaleString() ?? '-'}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  /**
   * Public Navigation AppBar Component
   */
  const PublicNavBar = () => (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(20px)',
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 },
            }}
          >
            D.E.M.N
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 600 }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              variant="outlined"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              startIcon={<PersonAddIcon />}
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );

  /**
   * Render loading state
   */
  if (statsLoading) {
    return (
      <>
        <PublicNavBar />
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} thickness={4} />
              <Typography variant="h6" color="text.secondary">
                Loading platform statistics...
              </Typography>
            </Stack>
          </Box>
        </Container>
      </>
    );
  }

  /**
   * Render error state
   */
  if (statsError) {
    const isRateLimited = statsErrorData?.isRateLimited;
    return (
      <>
        <PublicNavBar />
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Alert
            severity={isRateLimited ? 'warning' : 'error'}
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            <Typography variant="h6" gutterBottom>
              {isRateLimited ? 'Rate Limit Exceeded' : 'Data Unavailable'}
            </Typography>
            <Typography variant="body2">
              {isRateLimited
                ? 'Too many requests. Please try again in 60 seconds.'
                : 'Unable to load platform statistics. Please try again later.'}
            </Typography>
          </Alert>
        </Container>
      </>
    );
  }

  // Extract data from actual API response format
  const platformData = platformStats?.platform_stats || {};
  const totals = platformData.totals || {};
  const verification_stats = platformData.verification || {};
  const snapshot_24h = platformData.recent_24h || {};

  return (
    <>
      <PublicNavBar />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="xl">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                mb: 2,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Platform Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
              Real-time insights into our growing community, content, and fact-checking impact
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              See the power of verified truth. Join thousands of users sharing authentic content with AI-powered fact-checking.
            </Typography>
          </Box>

        {/* Platform Totals */}
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Platform Overview
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                icon={PeopleIcon}
                label="Total Users"
                value={totals?.users}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                icon={ArticleIcon}
                label="Total Posts"
                value={totals?.posts}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                icon={VideoIcon}
                label="Total Reels"
                value={totals?.reels}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                icon={ArticleIcon}
                label="Total Content"
                value={totals?.content}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <StatCard
                icon={FactCheckIcon}
                label="Fact Checks"
                value={totals?.fact_checks}
                color="warning"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 24h Activity Snapshot */}
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <TrendingUpIcon color="success" />
            <Typography variant="h5" fontWeight={700}>
              Last 24 Hours
            </Typography>
            <Chip label="Live" color="success" size="small" sx={{ fontWeight: 700 }} />
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard
                icon={PeopleIcon}
                label="New Users"
                value={snapshot_24h?.new_users}
                color="primary"
                subtitle="+24h"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                icon={ArticleIcon}
                label="New Posts"
                value={snapshot_24h?.new_posts}
                color="secondary"
                subtitle="+24h"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                icon={VideoIcon}
                label="New Reels"
                value={snapshot_24h?.new_reels}
                color="info"
                subtitle="+24h"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Verification Stats */}
        <Box sx={{ mb: 8 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <VerifiedIcon color="info" />
            <Typography variant="h5" fontWeight={700}>
              Verification Statistics
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatCard
                icon={VerifiedIcon}
                label="Verified Users"
                value={verification_stats?.verified_users}
                color="info"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatCard
                icon={FactCheckIcon}
                label="Verified Content"
                value={verification_stats?.verified_content}
                color="success"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Trending Content Section */}
        <Box sx={{ mb: 8 }}>
          <TrendingContent />
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Fact-Check Statistics Section */}
        <Box>
          <FactCheckCharts />
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default PlatformStats;
