import { Box, Typography, Card, Chip, Stack } from '@mui/material';
import {
    Assessment as AnalyticsIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { getTimeRangeLabel } from '../utils/helpers';

const AnalyticsHeader = ({ timeRange }) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <Card
            sx={{
                background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                padding: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid',
                borderColor: 'primary.light',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 3,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                },
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ marginBottom: 2, textAlign: { xs: 'left', sm: 'left' } }}
            >
                <Box
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        padding: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AnalyticsIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                            marginBottom: 0.5,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        Analytics Dashboard
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            opacity: 0.95,
                            fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                        }}
                    >
                        Comprehensive performance insights and metrics
                    </Typography>
                </Box>
            </Stack>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    marginTop: 2,
                    paddingTop: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <Chip
                    icon={<TrendingIcon />}
                    label={`Period: ${getTimeRangeLabel(timeRange)}`}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        '& .MuiChip-icon': { color: 'white' },
                    }}
                />
                <Chip
                    label={`Generated: ${currentDate}`}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                />
                <Chip
                    label="Live Data"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                        },
                    }}
                />
            </Box>
        </Card>
    );
};

export default AnalyticsHeader;