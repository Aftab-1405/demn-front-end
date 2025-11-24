import { Card, Typography, Box, Stack, Button, Chip } from '@mui/material';
import { Assignment as ReportIcon, Image as ImageIcon, VideoLibrary as VideoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SkeletonReportList } from '../../../components/Skeleton';
import useThemeTokens from '../../../hooks/useThemeTokens';
import { useMemo } from 'react';

const ReportsList = ({ reports, loading }) => {
    const navigate = useNavigate();
    const themeTokens = useThemeTokens();

    const verificationColorMap = useMemo(
        () => ({
            verified: themeTokens.success,
            disputed: themeTokens.error,
            mixed: themeTokens.warning,
            pending: themeTokens.warning,
            not_applicable: themeTokens.personal,
            personal: themeTokens.personal,
            default: themeTokens.primary,
        }),
        [themeTokens]
    );

    const getVerificationLabel = (status) => {
        const labels = {
            verified: 'Verified',
            disputed: 'Disputed',
            mixed: 'Mixed',
            not_applicable: 'Personal',
            pending: 'Pending',
        };
        return labels[status] || 'Unverified';
    };

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                padding: { xs: 2, sm: 3 },
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                // FIXED: Strict height enforcement.
                height: { xs: 450, md: 500 },
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: { xs: 2, sm: 3 }, flexShrink: 0 }}>
                <Box
                    sx={{
                        bgcolor: 'info.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <ReportIcon sx={{ fontSize: 24, color: 'info.main' }} />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                        lineHeight: 1.2,
                    }}
                >
                    My Fact-Check Reports
                </Typography>
            </Stack>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    marginBottom: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    flexShrink: 0,
                }}
            >
                Recent fact-check verification reports for your content
            </Typography>

            {loading ? (
                <Box sx={{ flex: 1 }}>
                    <SkeletonReportList items={4} />
                </Box>
            ) : reports.length > 0 ? (
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: 0.5,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'divider',
                            borderRadius: '3px',
                            '&:hover': {
                                backgroundColor: 'text.disabled',
                            },
                        },
                    }}
                >
                    <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        {reports.slice(0, 5).map((report, index) => (
                            <Box
                                key={`${report.type}-${report.id}-${index}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: 1, sm: 2 },
                                    padding: { xs: 1.5, sm: 2 },
                                    bgcolor: 'background.default',
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: 'divider',
                                    transition: 'all 0.2s ease',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 2,
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        bgcolor: 'action.selected',
                                        borderRadius: 2,
                                        padding: { xs: 0.75, sm: 1 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {report.type === 'post' ? (
                                        <ImageIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'primary.main' }} />
                                    ) : (
                                        <VideoIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: 'secondary.main' }} />
                                    )}
                                </Box>

                                {/* Content */}
                                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {report.type === 'post' ? 'Post Report' : 'Reel Report'}
                                        </Typography>
                                        {report.processing_status === 'complete' && (
                                            <Chip
                                                label={getVerificationLabel(report.verification_status)}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.6875rem',
                                                    height: '20px',
                                                    bgcolor:
                                                        verificationColorMap[report.verification_status] ||
                                                        verificationColorMap.default,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        )}
                                        {report.processing_status === 'pending' && (
                                            <Chip
                                                label="Processing..."
                                                size="small"
                                                sx={{
                                                    fontSize: '0.6875rem',
                                                    height: '20px',
                                                    bgcolor: themeTokens.primary,
                                                    color: 'white',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        )}
                                    </Stack>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                            color: 'text.secondary',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            marginBottom: 0.5,
                                            width: '100%',
                                        }}
                                    >
                                        {report.caption ? report.caption.substring(0, 60) + '...' : 'No caption provided'}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                            color: 'text.disabled',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {new Date(report.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </Typography>
                                </Box>

                                {/* Action Button */}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => navigate(`/fact-check/${report.type}/${report.id}`)}
                                    disabled={report.processing_status !== 'complete'}
                                    sx={{
                                        fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                        padding: { xs: '6px 10px', sm: '8px 16px' },
                                        fontWeight: 700,
                                        minWidth: { xs: '60px', sm: '80px' },
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    View
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            ) : (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: { xs: 2, sm: 3 },
                        color: 'text.secondary',
                        textAlign: 'center',
                    }}
                >
                    <Box sx={{ fontSize: { xs: '48px', sm: '56px' }, marginBottom: 2 }}>📋</Box>
                    <Typography
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                            marginBottom: 1,
                            fontWeight: 700,
                            color: 'text.primary',
                        }}
                    >
                        No Fact-Check Reports Yet
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary' }}>
                        Your verification reports will appear here once you upload content
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default ReportsList;