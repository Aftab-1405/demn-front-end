import React from 'react';
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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  FactCheck as FactCheckIcon,
  CheckCircle as VerifiedIcon,
  Cancel as DisputedIcon,
  Person as PersonalIcon,
  HelpOutline as UnverifiedIcon,
  TrendingUp as TrendingUpIcon,
  Article as NoClaimsIcon,
} from '@mui/icons-material';
import { publicAnalyticsAPI } from '../../../services/publicAnalytics';

/**
 * FactCheckCharts - Display fact-check statistics with visualizations
 *
 * API Response Format:
 * {
 *   accuracy_rate: 35.7,
 *   avg_claims_per_content: 0.93,
 *   status_distribution: {
 *     verified: 5,
 *     disputed: 5,
 *     personal: 3,
 *     no_claims: 1,
 *     unverified: 0
 *   },
 *   total_claims: 13,
 *   total_fact_checks: 14
 * }
 */
const FactCheckCharts = () => {
  // Fetch fact-check stats (no time range param since API doesn't support it)
  const {
    data: factCheckData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['factCheckStats'],
    queryFn: () => publicAnalyticsAPI.getFactCheckStats(),
    staleTime: 60 * 1000, // 60s
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  /**
   * OutcomeCard - Display single outcome stat
   */
  const OutcomeCard = ({ icon: Icon, label, count, percentage, color }) => {
    // Get the color value, handling special case for grey/text colors
    const getColor = (theme) => {
      if (color === 'text') {
        return theme.palette.text.primary;
      }
      return theme.palette[color]?.main || theme.palette.grey[600];
    };

    return (
      <Card
        elevation={2}
        sx={{
          height: '100%',
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(getColor(theme), 0.1)} 0%, ${alpha(
              getColor(theme),
              0.05
            )} 100%)`,
          border: (theme) => `1px solid ${alpha(getColor(theme), 0.2)}`,
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
                  bgcolor: (theme) => alpha(getColor(theme), 0.15),
                }}
              >
                <Icon sx={{ fontSize: 28, color: (theme) => getColor(theme) }} />
              </Box>
              <Chip
                label={`${percentage.toFixed(1)}%`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: (theme) => alpha(getColor(theme), 0.2),
                  color: (theme) => getColor(theme),
                }}
              />
            </Stack>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: (theme) => getColor(theme) }}>
                {count.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: (theme) => alpha(getColor(theme), 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: (theme) => getColor(theme),
                },
              }}
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

  // Extract data from actual API response
  const statusDistribution = factCheckData?.status_distribution || {};
  const totalFactChecks = factCheckData?.total_fact_checks || 0;
  const accuracyRate = factCheckData?.accuracy_rate || 0;
  const avgClaimsPerContent = factCheckData?.avg_claims_per_content || 0;
  const totalClaims = factCheckData?.total_claims || 0;

  // Calculate percentages
  const verified = statusDistribution.verified || 0;
  const disputed = statusDistribution.disputed || 0;
  const personal = statusDistribution.personal || 0;
  const noClaims = statusDistribution.no_claims || 0;
  const unverified = statusDistribution.unverified || 0;

  const verifiedPct = totalFactChecks > 0 ? (verified / totalFactChecks) * 100 : 0;
  const disputedPct = totalFactChecks > 0 ? (disputed / totalFactChecks) * 100 : 0;
  const personalPct = totalFactChecks > 0 ? (personal / totalFactChecks) * 100 : 0;
  const noClaimsPct = totalFactChecks > 0 ? (noClaims / totalFactChecks) * 100 : 0;
  const unverifiedPct = totalFactChecks > 0 ? (unverified / totalFactChecks) * 100 : 0;

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
        </Stack>
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<TrendingUpIcon />}
            label={`${accuracyRate.toFixed(1)}% accuracy rate`}
            size="small"
            color="success"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={`${totalFactChecks} total checks`}
            size="small"
            color="info"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Claims Analyzed
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {totalClaims.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Claims Per Content
              </Typography>
              <Typography variant="h4" fontWeight={700} color="secondary.main">
                {avgClaimsPerContent.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Status Distribution Cards */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Verification Status Distribution
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <OutcomeCard
            icon={VerifiedIcon}
            label="Verified"
            count={verified}
            percentage={verifiedPct}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <OutcomeCard
            icon={DisputedIcon}
            label="Disputed"
            count={disputed}
            percentage={disputedPct}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <OutcomeCard
            icon={PersonalIcon}
            label="Personal Content"
            count={personal}
            percentage={personalPct}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <OutcomeCard
            icon={NoClaimsIcon}
            label="No Claims"
            count={noClaims}
            percentage={noClaimsPct}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <OutcomeCard
            icon={UnverifiedIcon}
            label="Unverified"
            count={unverified}
            percentage={unverifiedPct}
            color="text"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FactCheckCharts;
