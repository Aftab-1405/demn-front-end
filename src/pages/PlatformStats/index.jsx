import React, { useEffect, useState, useRef } from 'react';
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
  keyframes,
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
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../services/publicAnalytics';
import TrendingContent from './components/TrendingContent';
import FactCheckCharts from './components/FactCheckCharts';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const orbit = keyframes`
  0% { transform: translate3d(-40px, -20px, 0) scale(1); opacity: 0.6; }
  50% { transform: translate3d(40px, 20px, 0) scale(1.1); opacity: 1; }
  100% { transform: translate3d(-40px, -20px, 0) scale(1); opacity: 0.6; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
`;

/**
 * Custom hook for intersection observer (scroll-triggered animations)
 */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Once triggered, stop observing
        if (targetRef.current) {
          observer.unobserve(targetRef.current);
        }
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  return [targetRef, isIntersecting];
};

/**
 * Custom hook for count-up animation
 */
const useCountUp = (end, duration = 2000, trigger = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!end || !trigger) return;
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, trigger]);

  return count;
};

/**
 * PlatformStats - Public marketing/landing page with analytics
 */
const PlatformStats = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch platform stats
  const {
    data: platformStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
  } = useQuery({
    queryKey: ['platformStats'],
    queryFn: publicAnalyticsAPI.getPlatformStats,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  // IMPORTANT: Call ALL hooks before any conditional returns
  const [heroRef, heroInView] = useIntersectionObserver({ threshold: 0.1 });
  const [activity24hRef, activity24hInView] = useIntersectionObserver({ threshold: 0.2 });

  // Section navigation
  const sections = ['Hero', 'Trending', 'Fact-Check', 'Get Started'];

  const scrollToSection = (index) => {
    if (scrollContainerRef.current) {
      const section = scrollContainerRef.current.children[index];
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Animated Stat Card with count-up (scroll-triggered)
   */
  const AnimatedStatCard = ({
    icon: Icon,
    label,
    value,
    color = 'primary',
    subtitle,
  }) => {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });
    const animatedValue = useCountUp(value || 0, 2000, isIntersecting);

    return (
      <Card
        ref={ref}
        elevation={0}
        sx={{
          height: '100%',
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.08)} 0%, ${alpha(
              theme.palette.background.paper,
              1
            )} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          opacity: isIntersecting ? 1 : 0,
          transform: isIntersecting ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette[color].main, 0.2)}`,
            borderColor: (theme) => theme.palette[color].main,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
              }}
            >
              <Icon sx={{ fontSize: 32, color: `${color}.main` }} />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: `${color}.main`,
                  mb: 0.5,
                }}
              >
                {animatedValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
              {subtitle && (
                <Chip
                  label={subtitle}
                  size="small"
                  color={color}
                  sx={{
                    mt: 1,
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  /**
   * Small animated delta chip for 24h snapshot (scroll-triggered)
   */
  const AnimatedDelta = ({ value, color, trigger }) => {
    const animated = useCountUp(value || 0, 1600, trigger);

    return (
      <Typography
        variant="h3"
        fontWeight={800}
        sx={{
          color,
        }}
      >
        +{animated.toLocaleString()}
      </Typography>
    );
  };

  /**
   * Public Navigation AppBar
   */
  const PublicNavBar = () => (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1.2 }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 900,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.3s',
            }}
          >
            D.E.M.N
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to="/"
              size="small"
              startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 1.5,
                py: 0.75,
                minWidth: 'auto',
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/login"
              size="small"
              variant="text"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 2,
                py: 0.75,
                minWidth: 'auto',
                borderRadius: 1.5,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              size="small"
              variant="contained"
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                px: 2.5,
                py: 0.75,
                minWidth: 'auto',
                borderRadius: 1.5,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: (theme) =>
                    `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '70vh',
            }}
          >
            <Stack spacing={3} alignItems="center">
              <CircularProgress size={70} thickness={4} />
              <Typography variant="h5" color="text.secondary" fontWeight={600}>
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
            sx={{ maxWidth: 700, mx: 'auto', borderRadius: 3 }}
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

  // Extract data
  const platformData = platformStats?.platform_stats || {};
  const totals = platformData.totals || {};
  const verification_stats = platformData.verification || {};
  const snapshot_24h = platformData.recent_24h || {};

  return (
    <>
      <PublicNavBar />

      {/* Section Navigation Dots */}
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {sections.map((section, index) => (
          <Box
            key={section}
            onClick={() => scrollToSection(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: currentSection === index ? 'primary.main' : 'action.disabled',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.3)',
                bgcolor: currentSection === index ? 'primary.dark' : 'action.active',
              },
            }}
            title={section}
          />
        ))}
      </Box>

      {/* Main scroll container with snap behavior */}
      <Box
        ref={scrollContainerRef}
        sx={{
          height: 'calc(100vh - 64px)', // Subtract navbar height
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'background.default',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: '4px',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          },
        }}
      >
        {/* Hero Section with Animated Gradient Background */}
        <Box
          ref={heroRef}
          sx={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            background: (theme) =>
              `radial-gradient(circle at top, ${alpha(theme.palette.primary.main, 0.15)} 0, transparent 55%),
               radial-gradient(circle at bottom, ${alpha(theme.palette.secondary.main, 0.1)} 0, transparent 60%)`,
            pt: { xs: 4, md: 6 },
            pb: { xs: 5, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
        <Container maxWidth="lg">
          {/* Centered Hero */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              mb: 6,
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Chip
              label="LIVE ANALYTICS"
              color="primary"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              Turn Every Post Into Real-Time Proof
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 680,
                mx: 'auto',
                mb: 3,
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              AI-powered fact-checking, real-time analytics, and community trust signals that
              attract new audiences.
            </Typography>

            {/* Hero CTA Row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: (theme) =>
                      `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/feed"
                variant="outlined"
                size="small"
                sx={{
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  textTransform: 'none',
                }}
              >
                Explore Feed
              </Button>
            </Stack>

            {/* Hero mini trust row */}
            <Typography variant="caption" color="text.secondary">
              No credit card required · AI-powered verification
            </Typography>
          </Box>

          {/* Scroll Down Indicator */}
          <Box
            onClick={() => scrollToSection(1)}
            sx={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
              animation: `${bounce} 2s ease-in-out infinite`,
              opacity: 0.7,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <Stack alignItems="center" spacing={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Scroll to explore
              </Typography>
              <KeyboardArrowDownIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            </Stack>
          </Box>

          {/* Platform Totals - Centered Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={PeopleIcon}
                label="Active Users"
                value={totals?.users}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={ArticleIcon}
                label="Posts Shared"
                value={totals?.posts}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={VideoIcon}
                label="Reels Created"
                value={totals?.reels}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={FactCheckIcon}
                label="Facts Checked"
                value={totals?.fact_checks}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={VerifiedIcon}
                label="Verified Content"
                value={verification_stats?.verified}
                color="success"
                subtitle="TRUSTED"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={TrendingUpIcon}
                label="Accuracy Rate"
                value={Math.round(verification_stats?.verification_rate || 0)}
                color="warning"
                subtitle={`${verification_stats?.verification_rate?.toFixed(1) ?? 0}%`}
              />
            </Grid>
          </Grid>

          {/* 24h Activity Banner */}
          <Card
            ref={activity24hRef}
            elevation={0}
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(
                  theme.palette.info.main,
                  0.08
                )} 100%)`,
              border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
              overflow: 'hidden',
              opacity: activity24hInView ? 1 : 0,
              transform: activity24hInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2.5 }}
                flexWrap="wrap"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 28, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Last 24 Hours
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Real-time activity
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                  label="LIVE"
                  color="success"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta
                      value={snapshot_24h?.new_users || 0}
                      color="success.main"
                      trigger={activity24hInView}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      New Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta
                      value={snapshot_24h?.new_posts || 0}
                      color="primary.main"
                      trigger={activity24hInView}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      New Posts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta
                      value={snapshot_24h?.new_reels || 0}
                      color="info.main"
                      trigger={activity24hInView}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      New Reels
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
        </Box>

        {/* Trending Content Section */}
        <Box
          sx={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.default, 0.98),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="xl" sx={{ py: 6, width: '100%' }}>
            <TrendingContent />
          </Container>
        </Box>

        {/* Fact-Check Statistics Section */}
        <Box
          sx={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth="xl" sx={{ py: 6, width: '100%' }}>
            <FactCheckCharts />
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            minHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Ready to Turn Your Content Into Credible Stories?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95 }}>
              Join D.E.M.N today and give your audience verified content they can trust.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                Get Started Free
              </Button>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                No setup · Built for creators & journalists
              </Typography>
            </Stack>
          </Box>
        </Container>
        </Box>
      </Box>
    </>
  );
};

export default PlatformStats;