import { Box, Typography, Card, Stack } from '@mui/material';
import {
    Cancel as BeforeIcon,
    CheckCircle as AfterIcon,
    AutoAwesome as AIIcon,
} from '@mui/icons-material';

const EditSuggestions = ({ editSuggestions }) => {
    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                padding: { xs: 2, md: 3 },
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 2.5 }}>
                <Box
                    sx={{
                        bgcolor: 'info.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <AIIcon sx={{ fontSize: 24, color: 'info.main' }} />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 700,
                    }}
                >
                    🤖 AI-Powered Corrections
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Our AI has generated accurate corrections for the flagged content:
            </Typography>

            <Stack spacing={2.5}>
                {editSuggestions.map((suggestion, index) => (
                    <Box
                        key={index}
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Before Section */}
                        <Box
                            sx={{
                                padding: 2,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(211, 47, 47, 0.15)'
                                        : 'rgba(211, 47, 47, 0.08)',
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 1 }}>
                                <BeforeIcon sx={{ color: 'error.main', fontSize: 20 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'error.dark' }}>
                                    BEFORE (INCORRECT)
                                </Typography>
                            </Stack>
                            <Typography
                                sx={{
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    color: 'error.dark',
                                    textDecoration: 'line-through',
                                    fontStyle: 'italic',
                                }}
                            >
                                &quot;{suggestion.claim}&quot;
                            </Typography>
                        </Box>

                        {/* After Section */}
                        <Box
                            sx={{
                                padding: 2,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(46, 125, 50, 0.15)'
                                        : 'rgba(46, 125, 50, 0.08)',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 1 }}>
                                <AfterIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.dark' }}>
                                    AFTER (AI CORRECTED)
                                </Typography>
                            </Stack>
                            <Typography
                                sx={{
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    color: 'success.dark',
                                    fontWeight: 600,
                                }}
                            >
                                &quot;{suggestion.correction}&quot;
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>

            <Box
                sx={{
                    marginTop: 2,
                    padding: 1.5,
                    bgcolor: 'info.lighter',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'info.light',
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.dark' }}>
                    💡 Pro Tip: You can automatically apply these corrections when publishing to ensure your
                    content is verified and accurate.
                </Typography>
            </Box>
        </Card>
    );
};

export default EditSuggestions;