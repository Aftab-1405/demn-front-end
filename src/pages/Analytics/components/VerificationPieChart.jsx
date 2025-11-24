import { Card, Typography, Box, Stack, Chip } from '@mui/material';
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
                bg: themeTokens.successBg,
            },
            disputed: {
                color: themeTokens.error,
                bg: themeTokens.errorBg,
            },
            pending: {
                color: themeTokens.warning,
                bg: themeTokens.warningBg,
            },
            personal: {
                color: themeTokens.personal,
                bg: themeTokens.personalBg,
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
                padding: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                height: '100%',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 3 }}>
                <Box
                    sx={{
                        bgcolor: 'success.light',
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
                    🔍 Verification Status
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Distribution of fact-check verification results
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
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
                        },
                    ]}
                    width={280}
                    height={220}
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
                            padding: 1.5,
                            borderRadius: 2,
                            bgcolor: statusPalette[item.label.toLowerCase()]?.bg || 'action.selected',
                            border: 1,
                            borderColor: 'divider',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: 1,
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
                                    // Fixed: Added backticks for template literal
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
                                // Fixed: Added backticks and braces for calculation
                                label={`${calculatePercentage(item.value, totalContent)}%`}
                                size="small"
                                sx={{
                                    bgcolor: item.color,
                                    color: 'white',
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