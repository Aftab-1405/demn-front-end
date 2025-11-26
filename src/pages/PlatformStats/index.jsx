import React, { useEffect, useState } from 'react';
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

/**
 * Custom hook for count-up animation
 */
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!end) return;
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
  }, [end, duration]);

  return count;
};

/**
 * PlatformStats - Public marketing/landing page with analytics
 */
const PlatformStats = () => {
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

  /**
   * Animated Stat Card with count-up
   */
  const AnimatedStatCard = ({
    icon: Icon,
    label,
    value,
    color = 'primary',
    subtitle,
    delay = 0,
  }) => {
    const animatedValue = useCountUp(value || 0, 2000);

    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.15)} 0%, ${alpha(
              theme.palette[color].dark || theme.palette[color].main,
              0.05
            )} 100%)`,
          border: (theme) => `2px solid ${alpha(theme.palette[color].main, 0.3)}`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          animation: `${fadeIn} 0.6s ease-out ${delay}s both`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette[color].main, 0.25)}`,
            border: (theme) => `2px solid ${theme.palette[color].main}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.1)}, transparent)`,
            animation: `${shimmer} 3s infinite`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette[color].main, 0.2),
                  animation: `${float} 3s ease-in-out infinite`,
                }}
              >
                <Icon sx={{ fontSize: 40, color: `${color}.main` }} />
              </Box>
              {subtitle && (
                <Chip
                  label={subtitle}
                  size="small"
                  color={color}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    animation: `${pulse} 2s ease-in-out infinite`,
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  color: `${color}.main`,
                  textShadow: (theme) => `0 2px 10px ${alpha(theme.palette[color].main, 0.3)}`,
                }}
              >
                {animatedValue.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={600} sx={{ mt: 1 }}>
                {label}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  /**
   * Small animated delta chip for 24h snapshot
   */
  const AnimatedDelta = ({ value, color }) => {
    const animated = useCountUp(value || 0, 1600);

    return (
      <Typography
        variant="h3"
        fontWeight={900}
        sx={{
          color,
          textShadow: (theme) => `0 2px 10px ${alpha(theme.palette.success.main, 0.35)}`,
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
          <Stack direction="row" spacing={1.5}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="text"
              startIcon={<LoginIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2.5,
                boxShadow: (theme) =>
                  `0 4px 16px ${alpha(theme.palette.primary.main, 0.45)}`,
                '&:hover': {
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.6)}`,
                },
              }}
            >
              Sign Up Free
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

      {/* Hero Section with Animated Gradient Background */}
      <Box
        sx={{
          background: (theme) =>
            `radial-gradient(circle at top, ${alpha(theme.palette.primary.main, 0.25)} 0, transparent 55%),
             radial-gradient(circle at bottom, ${alpha(theme.palette.secondary.main, 0.2)} 0, transparent 60%),
             linear-gradient(180deg, ${alpha(theme.palette.background.default, 1)} 0%, ${
              theme.palette.background.default
            } 100%)`,
          pt: { xs: 6, md: 7 },
          pb: { xs: 7, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating Orbs for subtle motion */}
        <Box
          sx={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            top: -40,
            right: -60,
            background: (theme) =>
              `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.35)} 0%, transparent 60%)`,
            filter: 'blur(4px)',
            opacity: 0.7,
            animation: `${orbit} 18s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            bottom: -40,
            left: -60,
            background: (theme) =>
              `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.3)} 0%, transparent 60%)`,
            filter: 'blur(6px)',
            opacity: 0.75,
            animation: `${orbit} 22s ease-in-out infinite reverse`,
          }}
        />

        <Container maxWidth="lg">
          {/* Centered Hero */}
          <Box
            sx={{
              minHeight: { xs: 'auto', md: '70vh' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              mb: 8,
              animation: `${fadeIn} 0.8s ease-out`,
            }}
          >
            <Chip
              label="LIVE PLATFORM ANALYTICS"
              color="primary"
              sx={{
                mb: 3,
                fontWeight: 800,
                fontSize: '0.875rem',
                px: 2.2,
                animation: `${pulse} 2s ease-in-out infinite`,
                boxShadow: (theme) =>
                  `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}`,
              }}
            />
            <Typography
              variant="h1"
              fontWeight={900}
              sx={{
                mb: 2.5,
                fontSize: { xs: '2.6rem', md: '4.2rem' },
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.info.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}
            >
              Turn Every Post Into
              <Box component="span" sx={{ display: 'block' }}>
                Real-Time Proof of Truth
              </Box>
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 780,
                mx: 'auto',
                mb: 4,
                fontWeight: 500,
                lineHeight: 1.7,
              }}
            >
              D.E.M.N transforms raw content into verified stories with AI-powered fact‑checking,
              real-time analytics, and community trust signals that attract new audiences.
            </Typography>

            {/* Hero CTA Row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="medium"
                sx={{
                  px: 4,
                  py: 1.4,
                  fontSize: '0.98rem',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  boxShadow: (theme) =>
                    `0 10px 30px ${alpha(theme.palette.primary.main, 0.5)}`,
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: (theme) =>
                      `0 16px 40px ${alpha(theme.palette.primary.main, 0.65)}`,
                  },
                  transition: 'all 0.25s',
                }}
              >
                Start Sharing Truth
              </Button>
              <Button
                component={Link}
                to="/feed"
                variant="outlined"
                size="medium"
                sx={{
                  px: 3.2,
                  py: 1.3,
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  textTransform: 'none',
                }}
              >
                Explore Live Feed
              </Button>
            </Stack>

            {/* Hero mini trust row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <VerifiedIcon sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  AI + human-in-the-loop fact‑checking
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                No credit card required · Get started in under 60 seconds
              </Typography>
            </Stack>
          </Box>

          {/* Platform Totals - Centered Grid */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={PeopleIcon}
                label="Active Users"
                value={totals?.users}
                color="primary"
                delay={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={ArticleIcon}
                label="Posts Shared"
                value={totals?.posts}
                color="secondary"
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={VideoIcon}
                label="Reels Created"
                value={totals?.reels}
                color="info"
                delay={0.2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={FactCheckIcon}
                label="Facts Checked"
                value={totals?.fact_checks}
                color="success"
                delay={0.3}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={VerifiedIcon}
                label="Verified Content"
                value={verification_stats?.verified}
                color="success"
                subtitle="TRUSTED"
                delay={0.4}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AnimatedStatCard
                icon={TrendingUpIcon}
                label="Accuracy Rate"
                value={Math.round(verification_stats?.verification_rate || 0)}
                color="warning"
                subtitle={`${verification_stats?.verification_rate?.toFixed(1) ?? 0}%`}
                delay={0.5}
              />
            </Grid>
          </Grid>

          {/* 24h Activity Banner */}
          <Card
            elevation={0}
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(
                  theme.palette.info.main,
                  0.15
                )} 100%)`,
              border: (theme) => `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
              borderRadius: 4,
              overflow: 'hidden',
              animation: `${fadeIn} 0.8s ease-out 0.6s both`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    In the Last 24 Hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real people. Real content. Verified in real time.
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                  label="LIVE"
                  color="success"
                  sx={{
                    fontWeight: 800,
                    animation: `${pulse} 1.5s ease-in-out infinite`,
                  }}
                />
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta value={snapshot_24h?.new_users || 0} color="success.main" />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      New Users Joined
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta value={snapshot_24h?.new_posts || 0} color="primary.main" />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      Fresh Posts Published
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AnimatedDelta value={snapshot_24h?.new_reels || 0} color="info.main" />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ mt: 0.5 }}
                    >
                      New Reels Created
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Trending Content Section (now feels like a marketing "reels" wall) */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.default, 0.98),
        }}
      >
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <TrendingContent />
        </Container>
      </Box>

      <Divider sx={{ my: 0 }} />

      {/* Fact-Check Statistics */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <FactCheckCharts />
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          py: { xs: 7, md: 8 },
          mt: 4,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography variant="h2" fontWeight={900} gutterBottom>
              Ready to Turn Your Content Into Credible Stories?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              Join D.E.M.N today and give your audience analytics‑backed, verified content they can
              trust.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.6,
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Get Started — It&apos;s Free
              </Button>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                No long setup · Built for creators, journalists & communities
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PlatformStats;