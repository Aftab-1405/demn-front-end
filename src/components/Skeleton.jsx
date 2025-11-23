import { Skeleton as MuiSkeleton, Box, Stack, Card, CardContent } from '@mui/material';

export const SkeletonPostCard = () => {
  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1.25,
        overflow: 'hidden',
        mb: 1.25,
        boxShadow: 'none',
      }}
    >
      {/* Header */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25, px: 1.5, minHeight: 56 }}>
        <MuiSkeleton variant="circular" width={32} height={32} />
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <MuiSkeleton variant="text" width="40%" height={16} />
        </Stack>
        <MuiSkeleton variant="circular" width={24} height={24} />
      </Stack>
      {/* Media */}
      <MuiSkeleton
        variant="rectangular"
        sx={{
          aspectRatio: '1 / 1',
          width: '100%',
          maxHeight: 450,
        }}
      />
      {/* Actions */}
      <Stack direction="row" spacing={1.5} sx={{ p: 1, px: 1.5, justifyContent: 'space-between', minHeight: 52 }}>
        <Stack direction="row" spacing={1.5}>
          <MuiSkeleton variant="circular" width={32} height={32} />
          <MuiSkeleton variant="circular" width={32} height={32} />
          <MuiSkeleton variant="circular" width={32} height={32} />
        </Stack>
        <MuiSkeleton variant="circular" width={32} height={32} />
      </Stack>
      {/* Likes */}
      <Box sx={{ px: 1.5, pb: 0.75, minHeight: 28 }}>
        <MuiSkeleton variant="text" width="30%" height={18} />
      </Box>
      {/* Caption */}
      <Box sx={{ px: 1.5, pb: 0.75, minHeight: 44 }}>
        <MuiSkeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
        <MuiSkeleton variant="text" width="75%" height={16} />
      </Box>
      {/* Comments */}
      <Box sx={{ px: 1.5, pb: 1.5, minHeight: 32 }}>
        <MuiSkeleton variant="text" width="40%" height={16} />
      </Box>
    </Card>
  );
};

// Exact Match for Analytics.jsx Layout
export const SkeletonAnalyticsDashboard = () => {
  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: { xs: '12px', sm: '20px', md: '32px 24px', lg: '40px 32px' },
        width: '100%',
      }}
    >
      {/* Header Section - Match actual title + subtitle + buttons */}
      <Box
        sx={{
          textAlign: 'center',
          mb: { xs: 3, sm: 3.5, md: 4.5, lg: 6 },
          padding: { xs: '16px 0', sm: '20px 0', md: '24px 0', lg: '32px 0' },
        }}
      >
        <MuiSkeleton variant="text" width="40%" height={42} sx={{ mx: 'auto', mb: 1 }} />
        <MuiSkeleton variant="text" width="50%" height={18} sx={{ mx: 'auto', mb: 3 }} />
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
          <MuiSkeleton variant="rectangular" width={{ xs: 100, sm: 120, lg: 160 }} height={{ xs: 36, lg: 48 }} sx={{ borderRadius: { xs: 1, lg: 1.25 } }} />
          <MuiSkeleton variant="rectangular" width={{ xs: 100, sm: 120, lg: 160 }} height={{ xs: 36, lg: 48 }} sx={{ borderRadius: { xs: 1, lg: 1.25 } }} />
          <MuiSkeleton variant="rectangular" width={{ xs: 100, sm: 120, lg: 160 }} height={{ xs: 36, lg: 48 }} sx={{ borderRadius: { xs: 1, lg: 1.25 } }} />
        </Stack>
      </Box>

      {/* 6 Stats Cards - Match Grid xs={6} sm={4} md={2} */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
            gap: 2,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <MuiSkeleton
              key={i}
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Charts Section - Match Grid lg={7} and lg={5} ratio (7:5 not 50:50!) */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' },
            gap: 2,
          }}
        >
          <MuiSkeleton
            variant="rectangular"
            height={350}
            sx={{
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
          <MuiSkeleton
            variant="rectangular"
            height={350}
            sx={{
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      </Box>

      {/* Reports Lists Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          <MuiSkeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
          <MuiSkeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      </Box>

      {/* Platform Stats Card */}
      <MuiSkeleton
        variant="rectangular"
        height={180}
        sx={{
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      />
    </Box>
  );
};

export const SkeletonReportList = ({ items = 4 }) => {
  return (
    <Stack spacing={{ xs: 1.25, sm: 2 }} sx={{ width: '100%' }}>
      {Array.from({ length: items }, (_, index) => index).map((index) => (
        <Box
          key={`report-skeleton-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        >
          <MuiSkeleton variant="circular" width={{ xs: 40, sm: 48 }} height={{ xs: 40, sm: 48 }} />
          <Stack spacing={0.75} sx={{ flex: 1 }}>
            <MuiSkeleton variant="text" width="30%" height={18} />
            <MuiSkeleton variant="text" width="85%" height={18} />
          </Stack>
          <MuiSkeleton variant="rectangular" width={{ xs: 60, sm: 90 }} height={{ xs: 18, sm: 24 }} sx={{ borderRadius: '999px' }} />
        </Box>
      ))}
    </Stack>
  );
};

// Exact Match for FactCheckDashboard.jsx Layout
export const SkeletonFactCheckDashboard = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          maxWidth: 1200,
          margin: { xs: '12px auto', sm: '18px auto', md: '22px auto' },
          padding: 0,
        }}
      >
        {/* Title - Match actual h2 */}
        <MuiSkeleton
          variant="text"
          width="40%"
          height={40}
          sx={{
            mx: 'auto',
            mb: { xs: 1.5, sm: 1.75, md: 2.25 },
          }}
        />

        {/* Grid Layout: Left (Preview) & Right (Analysis) - Match actual grid ratio 1fr 1.75fr */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr' },
            gap: { xs: '12px' },
            marginBottom: { xs: '14px' },
            '@media (min-width: 900px)': {
              gridTemplateColumns: '1fr 1.75fr',
              gap: '18px',
              marginBottom: '22px',
            },
          }}
        >
          {/* Left Column: Content Preview Card */}
          <MuiSkeleton
            variant="rectangular"
            height={450}
            sx={{
              borderRadius: { xs: '6px', md: '8px' },
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          {/* Right Column: Analysis Cards Stack */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '10px', '@media (min-width: 900px)': '15px' },
            }}
          >
            {/* Overall Status Card */}
            <MuiSkeleton
              variant="rectangular"
              height={120}
              sx={{
                borderRadius: { xs: '6px', md: '8px' },
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
            {/* Verification Report Card */}
            <MuiSkeleton
              variant="rectangular"
              height={300}
              sx={{
                borderRadius: { xs: '6px', md: '8px' },
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
            {/* AI Edit Suggestions Card */}
            <MuiSkeleton
              variant="rectangular"
              height={200}
              sx={{
                borderRadius: { xs: '6px', md: '8px' },
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>
        </Box>

        {/* Bottom Actions Card */}
        <MuiSkeleton
          variant="rectangular"
          height={300}
          sx={{
            borderRadius: { xs: '6px', md: '8px' },
            border: (theme) => `1px solid ${theme.palette.divider}`,
            marginTop: { xs: 1.5, sm: 1.75, md: 2.25 },
          }}
        />
      </Box>
    </Box>
  );
};

// Exact Match for Feed.jsx Layout with Sidebar
export const SkeletonFeed = () => {
  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 2, md: 3, lg: 3 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          display: { xs: 'flex', lg: 'grid' },
          flexDirection: { xs: 'column', lg: 'row' },
          gridTemplateColumns: { lg: 'minmax(0, 1fr) 320px' },
          gap: { xs: 3, lg: 4 },
          alignItems: 'start',
        }}
      >
        {/* Main Feed Section */}
        <Box
          component="section"
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: 480, lg: 500 },
            mx: { xs: 'auto', lg: 0 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr)' },
              gap: 2,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonPostCard key={index} />
            ))}
          </Box>
        </Box>

        {/* Sidebar - Desktop only */}
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'sticky',
            top: 90,
            pt: 3,
          }}
        >
          {/* Processing Tracker Skeleton */}
          <MuiSkeleton
            variant="rectangular"
            height={60}
            sx={{
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              mb: 2,
            }}
          />
          {/* Suggested Users Card */}
          <MuiSkeleton
            variant="rectangular"
            height={400}
            sx={{
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
          {/* Footer Links */}
          <Box sx={{ mt: 2 }}>
            <MuiSkeleton variant="text" width="60%" height={12} sx={{ mb: 1 }} />
            <Stack direction="row" spacing={1}>
              <MuiSkeleton variant="text" width={40} height={12} />
              <MuiSkeleton variant="text" width={40} height={12} />
              <MuiSkeleton variant="text" width={50} height={12} />
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Exact Match for Explore.jsx Layout with Search Bar
export const SkeletonExplore = () => {
  return (
    <Box sx={{ width: '100%', px: 3 }}>
      {/* Search Bar Skeleton */}
      <Box
        sx={{
          my: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', md: '60%' },
            mx: 'auto',
          }}
        >
          <MuiSkeleton
            variant="rectangular"
            height={48}
            sx={{
              borderRadius: '9999px',
              border: (theme) => `2px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      </Box>

      {/* Content Grid - Match actual Explore grid layout */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            md: 'repeat(auto-fill, minmax(240px, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          maxWidth: { lg: 1200 },
          margin: { lg: '0 auto' },
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonPostCard key={index} />
        ))}
      </Box>
    </Box>
  );
};

// Kept for backward compatibility
export const SkeletonAnalyticsGrid = ({ count = 4 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {Array.from({ length: count }, (_, index) => index).map((index) => (
        <MuiSkeleton
          key={`analytics-skeleton-${index}`}
          variant="rectangular"
          height={120}
          sx={{
            borderRadius: 1.5,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        />
      ))}
    </Box>
  );
};

// Exact Match for Profile.jsx Layout
export const SkeletonProfile = () => {
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, sm: 3 } }}>
      {/* Profile Header - Match actual layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, sm: 2.5, md: 3 },
          padding: { xs: 2, sm: 2.25 },
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/* Avatar */}
        <MuiSkeleton
          variant="circular"
          width={{ xs: 80, sm: 90 }}
          height={{ xs: 80, sm: 90 }}
        />

        {/* Profile Info */}
        <Box sx={{ minWidth: 256, flex: 1 }}>
          {/* Username */}
          <MuiSkeleton variant="text" width="50%" height={32} sx={{ mb: 1 }} />

          {/* Stats Row */}
          <Stack direction="row" spacing={2} sx={{ mb: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <MuiSkeleton variant="text" width={80} height={20} />
            <MuiSkeleton variant="text" width={80} height={20} />
            <MuiSkeleton variant="text" width={80} height={20} />
          </Stack>

          {/* Full name */}
          <MuiSkeleton variant="text" width="35%" height={18} sx={{ mb: 0.5 }} />

          {/* Bio */}
          <MuiSkeleton variant="text" width="90%" height={16} sx={{ mb: 0.5 }} />
          <MuiSkeleton variant="text" width="70%" height={16} sx={{ mb: 2 }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <MuiSkeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            <MuiSkeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          </Stack>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Stack direction="row" spacing={0}>
          <MuiSkeleton variant="rectangular" width={80} height={48} />
          <MuiSkeleton variant="rectangular" width={80} height={48} />
        </Stack>
      </Box>

      {/* Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(220px, 1fr))' },
          gap: { xs: 2, sm: 3 },
          marginTop: 3.75,
        }}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonPostCard key={index} />
        ))}
      </Box>
    </Box>
  );
};

export const SkeletonText = ({ variant = 'medium', className = '' }) => {
  const widthMap = {
    short: '30%',
    medium: '50%',
    long: '85%',
    title: '50%',
    subtitle: '30%',
  };

  const heightMap = {
    short: 18,
    medium: 18,
    long: 18,
    title: 36,
    subtitle: 20,
  };

  return (
    <MuiSkeleton
      variant="text"
      width={widthMap[variant] || '50%'}
      height={heightMap[variant] || 18}
      sx={{ mb: variant === 'title' ? 3 : variant === 'subtitle' ? 2 : 1.25 }}
      className={className}
    />
  );
};

// Grid skeleton for loading more content in Explore/Feed
export const SkeletonPostGrid = ({ count = 12 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'repeat(auto-fill, minmax(240px, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        maxWidth: { lg: 1200 },
        margin: { lg: '0 auto' },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonPostCard key={index} />
      ))}
    </Box>
  );
};

// Default export removed - use named exports instead