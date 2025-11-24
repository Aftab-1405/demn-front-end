import { Box, Typography, Chip, Card, LinearProgress, Stack } from '@mui/material';
import {
    Assignment as ReportIcon,
    Article as ArticleIcon,
    VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import { indeterminateProgress } from '../styles/animations';

const ReportHeader = ({ type, id, processing, progressStage, createdAt }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card
            sx={{
                background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                padding: { xs: 2.5, md: 4 },
                borderRadius: 3,
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid',
                borderColor: 'primary.light',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginBottom: 2 }}>
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
                    <ReportIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            marginBottom: 0.5,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        Fact-Check Report
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.9,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                        }}
                    >
                        AI-Powered Content Verification Analysis
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
                    icon={type === 'post' ? <ArticleIcon /> : <VideoIcon />}
                    label={`Content Type: ${type === 'post' ? 'Post' : 'Reel'}`}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'white' },
                    }}
                />
                <Chip
                    label={`Report ID: #${id.substring(0, 8)}`}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                    }}
                />
                <Chip
                    label={`Generated: ${formatDate(createdAt)}`}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                    }}
                />
            </Box>

            {processing && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            marginBottom: 1.5,
                            opacity: 0.9,
                            fontWeight: 500,
                        }}
                    >
                        ⏳ {progressStage}
                    </Typography>
                    <LinearProgress
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                                borderRadius: 4,
                                animation: `${indeterminateProgress} 2s infinite ease-in-out`,
                            },
                        }}
                    />
                </Box>
            )}
        </Card>
    );
};

export default ReportHeader;