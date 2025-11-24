import { Card, Typography, Box, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { TrendingUp as ChartIcon } from '@mui/icons-material';
import useThemeTokens from '../../../hooks/useThemeTokens';

const EngagementChart = ({ userStats }) => {
    const themeTokens = useThemeTokens();

    const chartData = [
        {
            label: 'Avg Likes',
            value: userStats.engagement_stats.avg_likes_per_post,
            color: themeTokens.primary,
        },
        {
            label: 'Avg Comments',
            value: userStats.engagement_stats.avg_comments_per_post,
            color: themeTokens.secondary,
        },
        {
            label: 'Total Likes (÷100)',
            value: userStats.engagement_stats.total_likes / 100,
            color: themeTokens.success,
        },
        {
            label: 'Total Comments (÷10)',
            value: userStats.engagement_stats.total_comments / 10,
            color: themeTokens.warning,
        },
    ];

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                padding: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                height: '100%',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 3 }}>
                <Box
                    sx={{
                        bgcolor: 'primary.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ChartIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Engagement Breakdown
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Detailed analysis of your content engagement metrics
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    minHeight: { xs: 250, sm: 300 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <BarChart
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: chartData.map((d) => d.label),
                        },
                    ]}
                    series={[
                        {
                            data: chartData.map((d) => d.value),
                            color: themeTokens.primary,
                        },
                    ]}
                    width={
                        typeof window !== 'undefined'
                            ? Math.min(
                                  window.innerWidth > 1200
                                      ? 600
                                      : window.innerWidth > 600
                                        ? window.innerWidth * 0.85
                                        : window.innerWidth - 80,
                                  600
                              )
                            : 600
                    }
                    height={typeof window !== 'undefined' && window.innerWidth < 600 ? 250 : 300}
                    slotProps={{ legend: { hidden: true } }}
                    sx={{
                        '& .MuiChartsAxis-tickLabel': {
                            fill: (theme) => theme.palette.text.secondary,
                            fontSize: { xs: '10px', sm: '12px' },
                            fontWeight: 500,
                        },
                        '& .MuiChartsAxis-line': {
                            stroke: (theme) => theme.palette.divider,
                            strokeWidth: 2,
                        },
                        '& .MuiChartsAxis-tick': {
                            stroke: (theme) => theme.palette.divider,
                        },
                    }}
                />
            </Box>

            {/* Stats Summary */}
            <Box
                sx={{
                    marginTop: { xs: 2, sm: 3 },
                    padding: { xs: 1.5, sm: 2 },
                    bgcolor: 'action.selected',
                    borderRadius: 2,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: { xs: 1.5, sm: 2 },
                }}
            >
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        HIGHEST ENGAGEMENT
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {Math.max(...chartData.map((d) => d.value)).toFixed(1)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        AVERAGE VALUE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default EngagementChart;