import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsAPI, factCheckAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
// [FIX] Import the new specific skeleton
import { SkeletonAnalyticsDashboard, SkeletonReportList } from '../components/Skeleton';
import useThemeTokens from '../hooks/useThemeTokens';

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Stack,
  Button,
  ButtonGroup,
  Alert,
  AlertTitle,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  People as PeopleIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  InsertChart as ChartIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch (e) {
    return null;
  }
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  const [userStats, setUserStats] = useState(null);
  const [factCheckStats, setFactCheckStats] = useState(null);
  const [myReports, setMyReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const navigate = useNavigate();
  const { showSnackbar } = useNotifications();
  const themeTokens = useThemeTokens();

  const statusPalette = useMemo(() => ({
    verified: {
      color: themeTokens.success,
      bg: themeTokens.successBg
    },
    disputed: {
      color: themeTokens.error,
      bg: themeTokens.errorBg
    },
    pending: {
      color: themeTokens.warning,
      bg: themeTokens.warningBg
    },
    personal: {
      color: themeTokens.personal,
      bg: themeTokens.personalBg
    }
  }), [themeTokens]);

  const engagementColors = useMemo(() => ([
    themeTokens.primary,
    themeTokens.primaryLight,
    themeTokens.secondary,
    themeTokens.primaryDark
  ]), [themeTokens]);

  const verificationColorMap = useMemo(() => ({
    verified: statusPalette.verified.color,
    disputed: statusPalette.disputed.color,
    mixed: statusPalette.pending.color,
    pending: statusPalette.pending.color,
    not_applicable: statusPalette.personal.color,
    personal: statusPalette.personal.color,
    default: themeTokens.primary
  }), [statusPalette, themeTokens.primary]);

  const loadAnalytics = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      const errorMsg = 'Please login to view analytics';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userAnalytics, factCheck] = await Promise.all([
        analyticsAPI.getUserAnalytics(userId, timeRange),
        analyticsAPI.getFactCheckStats(timeRange),
      ]);

      setUserStats(userAnalytics.data);
      setFactCheckStats(factCheck.data);

    } catch (err) {
      console.error('Error loading analytics:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load analytics';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [timeRange, showSnackbar]);

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const response = await factCheckAPI.getMyReports();
      setMyReports(response.data.reports || []);
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Analytics - D.E.M.N';
    loadAnalytics();
    loadReports();
  }, [loadAnalytics, loadReports]);


  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  // [FIX] Use the new, matching skeleton
  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: { xs: '12px', sm: '20px', md: '32px 24px', lg: '40px 32px' },
          width: '100%',
        }}
      >
        <SkeletonAnalyticsDashboard />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: { xs: '12px', sm: '20px', md: '32px 24px', lg: '40px 32px' },
          width: '100%',
        }}
      >
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '300px',
            justifyContent: 'center',
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center',
            },
          }}
        >
          <AlertTitle sx={{ fontSize: '20px', marginBottom: 1 }}>Error Loading Analytics</AlertTitle>
          <Typography sx={{ marginBottom: 2 }}>{error}</Typography>
          <Button variant="contained" onClick={loadAnalytics}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!userStats) return null;

  // ... Rest of the component (Render logic) is unchanged from your file ...
  // Just pasting the return block for context
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: { xs: '12px', sm: '20px', md: '32px 24px', lg: '40px 32px' },
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: { xs: 3, sm: 3.5, md: 4.5, lg: 6 },
            padding: { xs: '16px 0', sm: '20px 0', md: '24px 0', lg: '32px 0' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '28px', sm: '32px', md: '36px', lg: '42px' },
              fontWeight: 700,
              color: 'text.primary',
              margin: { xs: '0 0 8px 0', md: '0 0 12px 0', lg: '0 0 16px 0' },
              letterSpacing: '-0.5px',
            }}
          >
            Your Analytics
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '15px', sm: '16px', md: '17px', lg: '18px' },
              color: 'text.secondary',
              margin: 0,
              fontWeight: 400,
            }}
          >
            Track your content performance and engagement
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1.5, lg: 2 },
            marginBottom: { xs: 3, sm: 3.5, md: 4, lg: 5 },
            maxWidth: { sm: 600, md: 700, lg: 800 },
            marginLeft: 'auto',
            marginRight: 'auto',
            justifyContent: { sm: 'center' },
          }}
        >
          <ButtonGroup variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant={timeRange === 7 ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(7)}
              sx={{
                minWidth: { xs: 'auto', sm: 120, md: 140, lg: 160 },
                padding: { xs: '12px 20px', sm: '12px 24px', md: '14px 28px', lg: '16px 32px' },
                fontSize: { xs: '14px', md: '15px', lg: '16px' },
                fontWeight: 600,
                borderRadius: { xs: '8px', lg: '10px' },
                borderWidth: 2,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Last 7 Days
            </Button>
            <Button
              variant={timeRange === 30 ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(30)}
              sx={{
                minWidth: { xs: 'auto', sm: 120, md: 140, lg: 160 },
                padding: { xs: '12px 20px', sm: '12px 24px', md: '14px 28px', lg: '16px 32px' },
                fontSize: { xs: '14px', md: '15px', lg: '16px' },
                fontWeight: 600,
                borderRadius: { xs: '8px', lg: '10px' },
                borderWidth: 2,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Last 30 Days
            </Button>
            <Button
              variant={timeRange === 90 ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(90)}
              sx={{
                minWidth: { xs: 'auto', sm: 120, md: 140, lg: 160 },
                padding: { xs: '12px 20px', sm: '12px 24px', md: '14px 28px', lg: '16px 32px' },
                fontSize: { xs: '14px', md: '15px', lg: '16px' },
                fontWeight: 600,
                borderRadius: { xs: '8px', lg: '10px' },
                borderWidth: 2,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Last 90 Days
            </Button>
          </ButtonGroup>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={2} sx={{ mb: 3, mx: 'auto', maxWidth: '100%' }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <ImageIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {userStats.content_stats.total_posts}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Total Posts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <VideoIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {userStats.content_stats.total_reels}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Total Reels
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {formatNumber(userStats.audience_stats.followers_count)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Followers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <ThumbUpIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {formatNumber(userStats.engagement_stats.total_likes)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Total Likes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <CommentIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {formatNumber(userStats.engagement_stats.total_comments)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Total Comments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <ChartIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {userStats.engagement_stats.avg_engagement_rate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Avg Engagement
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3, mx: 'auto', maxWidth: '100%', justifyContent: 'center' }}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                p: 3,
                height: '100%',
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
                📊 Engagement Breakdown
              </Typography>
              <Box sx={{ width: '100%', minHeight: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: ['Avg Likes', 'Avg Comments', 'Total Likes', 'Total Comments'],
                    colorMap: { type: 'ordinal', colors: engagementColors }
                  }]}
                  series={[{
                    data: [
                      userStats.engagement_stats.avg_likes_per_post,
                      userStats.engagement_stats.avg_comments_per_post,
                      userStats.engagement_stats.total_likes / 100,
                      userStats.engagement_stats.total_comments / 10
                    ],
                    color: themeTokens.primary
                  }]}
                  width={Math.min(window.innerWidth > 1200 ? 550 : window.innerWidth - 120, 550)}
                  height={260}
                  slotProps={{ legend: { hidden: true } }}
                  sx={{
                    '& .MuiChartsAxis-tickLabel': {
                      fill: (theme) => theme.palette.text.secondary,
                      fontSize: '11px'
                    },
                    '& .MuiChartsAxis-line': {
                      stroke: (theme) => theme.palette.divider
                    }
                  }}
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                p: 3,
                height: '100%',
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
                🔍 Fact-Check Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <PieChart
                  series={[{
                    data: [
                      { id: 0, value: userStats.verification_stats.verified_count, label: 'Verified', color: statusPalette.verified.color },
                      { id: 1, value: userStats.verification_stats.disputed_count, label: 'Disputed', color: statusPalette.disputed.color },
                      { id: 2, value: userStats.verification_stats.pending_count, label: 'Pending', color: statusPalette.pending.color },
                      { id: 3, value: userStats.verification_stats.not_applicable_count, label: 'Personal', color: statusPalette.personal.color }
                    ],
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: (theme) => theme.palette.text.disabled },
                  }]}
                  width={240}
                  height={200}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
              {/* Stats legend manually rendered here from your file */}
              <Stack spacing={1.5}>
                {/* Verified */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, background: statusPalette.verified.bg }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: statusPalette.verified.color }} />
                    <Typography sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 500 }}>Verified</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '16px' }}>{userStats.verification_stats.verified_count}</Typography>
                    <Chip label={`${calculatePercentage(userStats.verification_stats.verified_count, userStats.content_stats.total_content)}%`} size="small" sx={{ background: statusPalette.verified.color, color: themeTokens.contrastStrong, fontWeight: 600, fontSize: '10px', height: '20px' }} />
                  </Stack>
                </Box>
                {/* Disputed */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, background: statusPalette.disputed.bg }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: statusPalette.disputed.color }} />
                    <Typography sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 500 }}>Disputed</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '16px' }}>{userStats.verification_stats.disputed_count}</Typography>
                    <Chip label={`${calculatePercentage(userStats.verification_stats.disputed_count, userStats.content_stats.total_content)}%`} size="small" sx={{ background: statusPalette.disputed.color, color: themeTokens.contrastStrong, fontWeight: 600, fontSize: '10px', height: '20px' }} />
                  </Stack>
                </Box>
                {/* Pending */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, background: statusPalette.pending.bg }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: statusPalette.pending.color }} />
                    <Typography sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 500 }}>Pending</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '16px' }}>{userStats.verification_stats.pending_count}</Typography>
                    <Chip label={`${calculatePercentage(userStats.verification_stats.pending_count, userStats.content_stats.total_content)}%`} size="small" sx={{ background: statusPalette.pending.color, color: themeTokens.contrastStrong, fontWeight: 600, fontSize: '10px', height: '20px' }} />
                  </Stack>
                </Box>
                {/* Personal */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, background: statusPalette.personal.bg }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: statusPalette.personal.color }} />
                    <Typography sx={{ color: 'text.primary', fontSize: '13px', fontWeight: 500 }}>Personal</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '16px' }}>{userStats.verification_stats.not_applicable_count}</Typography>
                    <Chip label={`${calculatePercentage(userStats.verification_stats.not_applicable_count, userStats.content_stats.total_content)}%`} size="small" sx={{ background: statusPalette.personal.color, color: themeTokens.contrastStrong, fontWeight: 600, fontSize: '10px', height: '20px' }} />
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Row - Reports and Top Content */}
        <Grid container spacing={2} sx={{ mb: 3, mx: 'auto', maxWidth: '100%', justifyContent: 'center' }}>
          {/* My Reports */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                p: 3,
                minHeight: '400px',
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
                📋 My Fact-Check Reports
              </Typography>
              {reportsLoading ? (
                <Box sx={{ minHeight: '300px' }}>
                  <SkeletonReportList items={4} />
                </Box>
              ) : myReports.length > 0 ? (
                <Stack spacing={1.5} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {myReports.slice(0, 5).map((report) => (
                    <Box
                      key={`${report.type}-${report.id}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ fontSize: '24px' }}>{report.type === 'post' ? '📸' : '🎥'}</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                            {report.type === 'post' ? 'Post' : 'Reel'}
                          </Typography>
                          {report.processing_status === 'complete' && (
                            <Chip
                              label={report.verification_status === 'verified' ? '✓ Verified' : report.verification_status === 'disputed' ? '✗ Disputed' : report.verification_status === 'mixed' ? '◐ Mixed' : report.verification_status === 'not_applicable' ? '○ Personal' : '? Unverified'}
                              size="small"
                              sx={{
                                fontSize: '10px',
                                height: '20px',
                                background: verificationColorMap[report.verification_status] || verificationColorMap.default,
                                color: themeTokens.contrastStrong,
                                fontWeight: 600
                              }}
                            />
                          )}
                          {report.processing_status === 'pending' && (
                            <Chip label="⏳ Processing..." size="small" sx={{ fontSize: '10px', height: '20px', background: themeTokens.primary, color: themeTokens.contrastStrong }} />
                          )}
                        </Stack>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {report.caption ? report.caption.substring(0, 50) + '...' : 'No caption'}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: 'text.disabled', mt: 0.5 }}>
                          {new Date(report.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/fact-check/${report.type}/${report.id}`)}
                        disabled={report.processing_status !== 'complete'}
                        sx={{
                          fontSize: '11px',
                          padding: '6px 12px',
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  <Box sx={{ fontSize: '48px', mb: 2 }}>📋</Box>
                  <Typography sx={{ fontSize: '16px', mb: 1, fontWeight: 600 }}>
                    No fact-check reports yet
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Top Content */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                p: 3,
                minHeight: '400px',
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
                🏆 Top Performing Content
              </Typography>
              {userStats.top_content && userStats.top_content.length > 0 ? (
                <Stack spacing={1.5} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {userStats.top_content.map((content, index) => (
                    <Box
                      key={`top-${content.type}-${content.id}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ fontSize: '18px', fontWeight: 700, color: 'primary.main', minWidth: '30px', textAlign: 'center' }}>
                        #{index + 1}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                          {content.type === 'post' ? '📸 Post' : '🎥 Reel'}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {content.caption ? content.caption.substring(0, 50) + '...' : 'No caption'}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                          <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
                            ❤️ {content.likes_count}
                          </Typography>
                          <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
                            💬 {content.comments_count}
                          </Typography>
                          <Typography sx={{ fontSize: '11px', color: 'primary.main', fontWeight: 600 }}>
                            📊 {content.engagement_rate.toFixed(1)}%
                          </Typography>
                        </Stack>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/${content.type === 'post' ? 'posts' : 'reels'}/${content.id}`)}
                        sx={{
                          fontSize: '11px',
                          padding: '6px 12px',
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  <Box sx={{ fontSize: '48px', mb: 2 }}>🏆</Box>
                  <Typography sx={{ fontSize: '16px', mb: 1, fontWeight: 600 }}>
                    No content yet
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Platform Stats */}
        {factCheckStats && (
          <Card
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              p: 3,
              mb: 3,
              mx: 'auto',
              maxWidth: '100%',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 700 }}>
              🔍 Platform Fact-Check Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1 }}>
                    Total Fact-Checks
                  </Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: 700, color: 'primary.main' }}>
                    {factCheckStats.total_fact_checks}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1 }}>
                    Claims Analyzed
                  </Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: 700, color: 'primary.main' }}>
                    {factCheckStats.total_claims}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1 }}>
                    Platform Accuracy Rate
                  </Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: 700, color: statusPalette.verified.color }}>
                    {factCheckStats.accuracy_rate ? factCheckStats.accuracy_rate.toFixed(1) + '%' : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Analytics;