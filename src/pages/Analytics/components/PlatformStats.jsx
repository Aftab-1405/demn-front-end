import { Card, Typography, Box, Grid, Stack } from '@mui/material';
import { Public as PlatformIcon } from '@mui/icons-material';
import useThemeTokens from '../../../hooks/useThemeTokens';

const PlatformStats = ({ factCheckStats }) => {
    const themeTokens = useThemeTokens();

    const stats = [
        {
            label: 'Total Fact-Checks',
            value: factCheckStats.total_fact_checks,
            icon: '🔍',
            color: 'primary.main',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            label: 'Claims Analyzed',
            value: factCheckStats.total_claims,
            icon: '📊',
            color: 'secondary.main',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            label: 'Platform Accuracy',
            value: factCheckStats.accuracy_rate
                ? `${factCheckStats.accuracy_rate.toFixed(1)}%`
                : 'N/A',
            icon: '✓',
            color: 'success.main',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
    ];

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                padding: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
                    <PlatformIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    🌐 Platform Fact-Check Insights
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Global statistics across the entire platform
            </Typography>

            <Grid container spacing={2}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box
                            sx={{
                                padding: 3,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                border: 2,
                                borderColor: 'divider',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: stat.color,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: '48px',
                                    marginBottom: 2,
                                }}
                            >
                                {stat.icon}
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    marginBottom: 1,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 700,
                                }}
                            >
                                {stat.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '2rem',
                                    fontWeight: 800,
                                    background: stat.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {stat.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
};

export default PlatformStats;