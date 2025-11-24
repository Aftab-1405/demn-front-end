import { Card, Typography, Box, Stack, Chip, alpha } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { VerifiedUser as VerifiedIcon } from '@mui/icons-material';
import { useMemo } from 'react';
// Ensure these paths are correct based on your project structure
import useThemeTokens from '../../../hooks/useThemeTokens';
import { calculatePercentage } from '../utils/helpers';

const VerificationPieChart = ({ userStats }) => {
    const themeTokens = useThemeTokens();

    const statusPalette = useMemo(
        () => ({
            verified: {
                color: themeTokens.success,
                // FIXED: Use alpha transparency instead of solid light colors
                // This ensures the background is a subtle tint that looks good in Dark & Light mode
                bg: alpha(themeTokens.success, 0.15),
            },
            disputed: {
                color: themeTokens.error,
                bg: alpha(themeTokens.error, 0.15),
            },
            pending: {
                color: themeTokens.warning,
                bg: alpha(themeTokens.warning, 0.15),
            },
            personal: {
                color: themeTokens.personal,
                bg: alpha(themeTokens.personal, 0.15),
            },
        }),
        [themeTokens]
    );

    const pieData = [
        {
            id: 0,
            value: userStats.verification_stats.verified_count,
            label: 'Verified',
            color: statusPalette.verified.color,
        },
        {
            id: 1,
            value: userStats.verification_stats.disputed_count,
            label: 'Disputed',
            color: statusPalette.disputed.color,
        },
        {
            id: 2,
            value: userStats.verification_stats.pending_count,
            label: 'Pending',
            color: statusPalette.pending.color,
        },
        {
            id: 3,
            value: userStats.verification_stats.not_applicable_count,
            label: 'Personal',
            color: statusPalette.personal.color,
        },
    ];

    const totalContent = userStats.content_stats.total_content;

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                padding: { xs: 2, sm: 3 },
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 3 }}>
                <Box
                    sx={{
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'success.dark' : 'success.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <VerifiedIcon sx={{ fontSize: 24, color: 'success.main' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Verification Status
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Distribution of fact-check verification results
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: { xs: 2, sm: 3 } }}>
                <PieChart
                    series={[
                        {
                            data: pieData,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: {
                                innerRadius: 30,
                                additionalRadius: -30,
                                color: (theme) => theme.palette.text.disabled,
                            },
                            // Add rounded corners to pie segments
                            cornerRadius: 4,
                            paddingAngle: 2,
                        },
                    ]}
                    width={typeof window !== 'undefined' && window.innerWidth < 600 ? Math.min(window.innerWidth - 80, 250) : 280}
                    height={typeof window !== 'undefined' && window.innerWidth < 600 ? 180 : 220}
                    slotProps={{ legend: { hidden: true } }}
                />
            </Box>

            {/* Legend */}
            <Stack spacing={1.5}>
                {pieData.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: { xs: 1, sm: 1.5 },
                            borderRadius: 2,
                            // Use the transparency-safe background color
                            bgcolor: statusPalette[item.label.toLowerCase()]?.bg || 'action.selected',
                            border: 1,
                            borderColor: 'divider', // Subtle border for better definition
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: 1,
                                // Darken slightly on hover
                                bgcolor: (theme) => alpha(item.color, 0.25),
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    boxShadow: `0 0 8px ${item.color}`,
                                }}
                            />
                            <Typography
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Typography
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    fontSize: '1.125rem',
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Chip
                                label={`${calculatePercentage(item.value, totalContent)}%`}
                                size="small"
                                sx={{
                                    bgcolor: item.color,
                                    color: 'white', // Ensure text is always white on these solid chips
                                    fontWeight: 700,
                                    fontSize: '0.6875rem',
                                    height: '22px',
                                }}
                            />
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
};

export default VerificationPieChart;