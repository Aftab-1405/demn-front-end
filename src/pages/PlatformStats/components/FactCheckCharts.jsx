import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
} from '@mui/material';
import {
  FactCheck as FactCheckIcon,
  CheckCircle as VerifiedIcon,
  Cancel as FakeIcon,
  Warning as MisleadingIcon,
  HelpOutline as UnverifiedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../../services/publicAnalytics';

/**
 * FactCheckCharts - Display fact-check statistics with visualizations
 */
const FactCheckCharts = () => {
  const [timeRange, setTimeRange] = useState(7); // days

  // Fetch fact-check stats
  const {
    data: factCheckData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['factCheckStats', timeRange],
    queryFn: () => publicAnalyticsAPI.getFactCheckStats({ days: timeRange }),
    staleTime: 60 * 1000, // 60s
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  /**
   * Handle time range change
   */
  const handleTimeRangeChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeRange(newValue);
    }
  };

  /**
   * OutcomeCard - Display single outcome stat
   */
  const OutcomeCard = ({ icon: Icon, label, count, percentage, color }) => (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(
            theme.palette[color].dark,
            0.05
          )} 100%)`,
        border: (theme) => `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.15),
              }}
            >
              <Icon sx={{ fontSize: 28, color: `${color}.main` }} />
            </Box>
            <Chip
              label={`${percentage.toFixed(1)}%`}
              size="small"
              color={color}
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Box>
            <Typography variant="h4" fontWeight={800} color={`${color}.main`}>
              {count.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={color}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );

  /**
   * DailyBreakdownChart - Simple bar chart for daily breakdown
   */
  const DailyBreakdownChart = ({ breakdown }) => {
    if (!breakdown || breakdown.length === 0) {
      return (
        <Alert severity="info">
          <Typography variant="body2">No daily breakdown data available.</Typography>
        </Alert>
      );
    }

    // Get max value for scaling
    const maxValue = Math.max(
      ...breakdown.map((day) =>
        Object.values(day.counts || {}).reduce((sum, val) => sum + val, 0)
      )
    );

    return (
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Daily Breakdown ({breakdown.length} days)
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {breakdown.slice().reverse().map((day, index) => {
            const total =
              (day.counts?.verified || 0) +
              (day.counts?.fake || 0) +
              (day.counts?.misleading || 0) +
              (day.counts?.unverified || 0);

            const verifiedPct = total > 0 ? ((day.counts?.verified || 0) / total) * 100 : 0;
            const fakePct = total > 0 ? ((day.counts?.fake || 0) / total) * 100 : 0;
            const misleadingPct = total > 0 ? ((day.counts?.misleading || 0) / total) * 100 : 0;
            const unverifiedPct = total > 0 ? ((day.counts?.unverified || 0) / total) * 100 : 0;

            return (
              <Box key={day.date || index}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {total} checks
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    height: 32,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
                  }}
                >
                  {/* Verified */}
                  {verifiedPct > 0 && (
                    <Box
                      sx={{
                        width: `${verifiedPct}%`,
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Verified: ${day.counts?.verified || 0} (${verifiedPct.toFixed(1)}%)`}
                    >
                      {verifiedPct > 15 && (
                        <Typography variant="caption" fontWeight={700} color="white">
                          {day.counts?.verified}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {/* Fake */}
                  {fakePct > 0 && (
                    <Box
                      sx={{
                        width: `${fakePct}%`,
                        bgcolor: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Fake: ${day.counts?.fake || 0} (${fakePct.toFixed(1)}%)`}
                    >
                      {fakePct > 15 && (
                        <Typography variant="caption" fontWeight={700} color="white">
                          {day.counts?.fake}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {/* Misleading */}
                  {misleadingPct > 0 && (
                    <Box
                      sx={{
                        width: `${misleadingPct}%`,
                        bgcolor: 'warning.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Misleading: ${day.counts?.misleading || 0} (${misleadingPct.toFixed(1)}%)`}
                    >
                      {misleadingPct > 15 && (
                        <Typography variant="caption" fontWeight={700} color="white">
                          {day.counts?.misleading}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {/* Unverified */}
                  {unverifiedPct > 0 && (
                    <Box
                      sx={{
                        width: `${unverifiedPct}%`,
                        bgcolor: 'grey.500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={`Unverified: ${day.counts?.unverified || 0} (${unverifiedPct.toFixed(1)}%)`}
                    >
                      {unverifiedPct > 15 && (
                        <Typography variant="caption" fontWeight={700} color="white">
                          {day.counts?.unverified}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>

        {/* Legend */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }} flexWrap="wrap">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: 1 }} />
            <Typography variant="caption" fontWeight={600}>
              Verified
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: 1 }} />
            <Typography variant="caption" fontWeight={600}>
              Fake
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: 'warning.main', borderRadius: 1 }} />
            <Typography variant="caption" fontWeight={600}>
              Misleading
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: 'grey.500', borderRadius: 1 }} />
            <Typography variant="caption" fontWeight={600}>
              Unverified
            </Typography>
          </Stack>
        </Stack>
      </Box>
    );
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <FactCheckIcon color="success" />
          <Typography variant="h5" fontWeight={700}>
            Fact-Check Statistics
          </Typography>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary">
              Loading fact-check statistics...
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
          <FactCheckIcon color="success" />
          <Typography variant="h5" fontWeight={700}>
            Fact-Check Statistics
          </Typography>
        </Stack>
        <Alert severity={isRateLimited ? 'warning' : 'error'}>
          <Typography variant="body2">
            {isRateLimited
              ? 'Rate limit exceeded. Please try again in 60 seconds.'
              : 'Unable to load fact-check statistics. Please try again later.'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  const { summary, breakdown } = factCheckData || {};

  // Calculate percentages
  const total = summary?.total || 0;
  const verifiedPct = total > 0 ? ((summary?.verified || 0) / total) * 100 : 0;
  const fakePct = total > 0 ? ((summary?.fake || 0) / total) * 100 : 0;
  const misleadingPct = total > 0 ? ((summary?.misleading || 0) / total) * 100 : 0;
  const unverifiedPct = total > 0 ? ((summary?.unverified || 0) / total) * 100 : 0;

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
          <FactCheckIcon color="success" />
          <Typography variant="h5" fontWeight={700}>
            Fact-Check Statistics
          </Typography>
          <Chip
            icon={<TrendingUpIcon />}
            label={`${(summary?.verification_rate || 0).toFixed(1)}% verification rate`}
            size="small"
            color="success"
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        {/* Time Range Selector */}
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton value={7}>7 Days</ToggleButton>
          <ToggleButton value={30}>30 Days</ToggleButton>
          <ToggleButton value={90}>90 Days</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Outcome Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <OutcomeCard
            icon={VerifiedIcon}
            label="Verified"
            count={summary?.verified || 0}
            percentage={verifiedPct}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <OutcomeCard
            icon={FakeIcon}
            label="Fake"
            count={summary?.fake || 0}
            percentage={fakePct}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <OutcomeCard
            icon={MisleadingIcon}
            label="Misleading"
            count={summary?.misleading || 0}
            percentage={misleadingPct}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <OutcomeCard
            icon={UnverifiedIcon}
            label="Unverified"
            count={summary?.unverified || 0}
            percentage={unverifiedPct}
            color="grey"
          />
        </Grid>
      </Grid>

      {/* Daily Breakdown Chart */}
      <Card elevation={2}>
        <CardContent>
          <DailyBreakdownChart breakdown={breakdown} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default FactCheckCharts;
