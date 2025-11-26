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
 * FactCheckCharts - Marketing-style verification section
 */
const FactCheckCharts = () => {
  // Fetch fact-check stats
  const {
    data: factCheckData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['factCheckStats'],
    queryFn: () => publicAnalyticsAPI.getFactCheckStats(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.isRateLimited) return false;
      return failureCount < 2;
    },
  });

  /**
   * OutcomeCard - Display single outcome stat (used in "How Your Content Gets Classified")
   */
  const OutcomeCard = ({ icon: Icon, label, count, percentage, color }) => {
    const getColor = (theme) => {
      if (color === 'text') return theme.palette.text.primary;
      return theme.palette[color]?.main || theme.palette.grey[600];
    };

    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(getColor(theme), 0.08)} 0%, ${alpha(
              getColor(theme),
              0.02
            )} 100%)`,
          border: (theme) => `1px solid ${alpha(getColor(theme), 0.25)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(getColor(theme), 0.15),
                }}
              >
                <Icon sx={{ fontSize: 26, color: (theme) => getColor(theme) }} />
              </Box>
              <Chip
                label={`${percentage.toFixed(1)}%`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: (theme) => alpha(getColor(theme), 0.18),
                  color: (theme) => getColor(theme),
                }}
              />
            </Stack>
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: (theme) => getColor(theme) }}
              >
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
                height: 7,
                borderRadius: 999,
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

  // Loading state
  if (isLoading) {
    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <FactCheckIcon color="success" />
          <Typography variant="h5" fontWeight={700}>
            Verification Quality Metrics
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

  // Error state
  if (isError) {
    const isRateLimited = error?.isRateLimited;
    return (
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <FactCheckIcon color="success" />
          <Typography variant="h5" fontWeight={700}>
            Verification Quality Metrics
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

  // Extract data
  const statusDistribution = factCheckData?.status_distribution || {};
  const totalFactChecks = factCheckData?.total_fact_checks || 0;
  const accuracyRate = factCheckData?.accuracy_rate || 0;
  const avgClaimsPerContent = factCheckData?.avg_claims_per_content || 0;
  const totalClaims = factCheckData?.total_claims || 0;

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
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
              theme.palette.background.paper,
              1
            )} 40%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          {/* Top: Marketing header */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 4 }}
          >
            <Stack spacing={1.2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FactCheckIcon color="success" />
                <Typography variant="overline" color="success.main" fontWeight={700}>
                  Verification Quality Metrics
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight={800}>
                Quantify how trustworthy your content feels.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                Every post on D.E.M.N runs through AI‑assisted checks so brands, creators, and
                communities can prove they&apos;re sharing content that stands up to scrutiny.
              </Typography>
            </Stack>

            <Stack spacing={1.2} minWidth={{ md: 260 }}>
              <Chip
                icon={<TrendingUpIcon />}
                label={`${accuracyRate.toFixed(1)}% average accuracy`}
                color="success"
                sx={{ fontWeight: 700, alignSelf: { xs: 'flex-start', md: 'flex-end' } }}
              />
              <Chip
                label={`${totalFactChecks} fact‑checks run`}
                color="info"
                variant="outlined"
                sx={{ fontWeight: 600, alignSelf: { xs: 'flex-start', md: 'flex-end' } }}
              />
            </Stack>
          </Stack>

          {/* Summary Row: "Verification Quality at a Glance" */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
                      theme.palette.background.paper,
                      1
                    )} 60%)`,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" color="primary.main" fontWeight={700}>
                    Verification quality at a glance
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                    {accuracyRate.toFixed(1)}% accuracy across {totalClaims.toLocaleString()} claims
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Your audience doesn&apos;t just see posts—they see proof. High accuracy means
                    fewer disputes and more confidence in what you publish.
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      • <strong>Fact‑checks run:</strong> {totalFactChecks.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Avg. claims per content:</strong> {avgClaimsPerContent.toFixed(2)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                  background: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(
                      theme.palette.background.paper,
                      1
                    )} 60%)`,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" color="info.main" fontWeight={700}>
                    Why this matters
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    These signals power trust badges, feed ranking, and brand‑safe environments for
                    advertisers and communities.
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      • <strong>Verified</strong> stories rise to the top of discovery.
                    </Typography>
                    <Typography variant="body2">
                      • <strong>Disputed</strong> content gets flagged before it can spread.
                    </Typography>
                    <Typography variant="body2">
                      • <strong>No‑claims</strong> posts stay lightweight and personal.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* How Your Content Gets Classified */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={700}>
              CLASSIFICATION BREAKDOWN
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              How Your Content Gets Classified
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Every upload is mapped into one of these outcomes so you can see exactly how your
              narrative lands with the world.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default FactCheckCharts;