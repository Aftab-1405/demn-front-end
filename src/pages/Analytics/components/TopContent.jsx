import { Card, Typography, Box, Stack, Button } from '@mui/material';
import { EmojiEvents as TrophyIcon, Comment, TrendingUp, Image as ImageIcon, VideoLibrary as VideoIcon, ThumbUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TopContent = ({ topContent }) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                padding: { xs: 1.5, sm: 2, md: 3 },
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                minHeight: 450,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 3 }}>
                <Box
                    sx={{
                        bgcolor: 'warning.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TrophyIcon sx={{ fontSize: 24, color: 'warning.main' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Top Performing Content
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Your best content ranked by engagement rate
            </Typography>

            {topContent && topContent.length > 0 ? (
                <Stack spacing={2} sx={{ maxHeight: 450, overflowY: 'auto' }}>
                    {topContent.map((content, index) => (
                        <Box
                            key={`top-${content.type}-${content.id}-${index}`}
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
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 2,
                                    borderColor: 'warning.main',
                                },
                            }}
                        >
                            {/* Rank Badge */}
                            <Box
                                sx={{
                                    minWidth: { xs: '36px', sm: '48px' },
                                    height: { xs: '36px', sm: '48px' },
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: { xs: '1rem', sm: '1.25rem' },
                                    background: (theme) =>
                                        index === 0
                                            ? `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`
                                            : index === 1
                                                ? `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[600]} 100%)`
                                                : index === 2
                                                    ? `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.error.dark} 100%)`
                                                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    color: 'white',
                                    boxShadow: 2,
                                }}
                            >
                                #{index + 1}
                            </Box>

                            {/* Content Details */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ marginBottom: 0.5 }}>
                                    {content.type === 'post' ? (
                                        <ImageIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                    ) : (
                                        <VideoIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                    )}
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                            fontWeight: 700,
                                            color: 'text.primary',
                                        }}
                                    >
                                        {content.type === 'post' ? 'Post' : 'Reel'}
                                    </Typography>
                                </Stack>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                        color: 'text.secondary',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginBottom: 1,
                                    }}
                                >
                                    {content.caption ? content.caption.substring(0, 50) + '...' : 'No caption'}
                                </Typography>
                                <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}
                                    >
                                        <ThumbUp sx={{ fontSize: { xs: 12, sm: 14 }, color: 'text.disabled' }} />
                                        <Typography
                                            sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, fontWeight: 600, color: 'text.primary' }}
                                        >
                                            {content.likes_count}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Comment sx={{ fontSize: { xs: 12, sm: 14 }, color: 'text.disabled' }} />
                                        <Typography
                                            sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' }, fontWeight: 600, color: 'text.primary' }}
                                        >
                                            {content.comments_count}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}
                                    >
                                        <TrendingUp sx={{ fontSize: { xs: 12, sm: 14 }, color: 'text.disabled' }} />
                                        <Typography
                                            sx={{
                                                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                                fontWeight: 700,
                                                color: 'warning.main',
                                            }}
                                        >
                                            {content.engagement_rate.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Action Button */}
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() =>
                                    navigate(`/${content.type === 'post' ? 'posts' : 'reels'}/${content.id}`)
                                }
                                sx={{
                                    fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                                    padding: { xs: '6px 12px', sm: '8px 16px' },
                                    fontWeight: 700,
                                    minWidth: { xs: '60px', sm: '80px' },
                                    borderRadius: 2,
                                }}
                            >
                                View
                            </Button>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Box
                    sx={{
                        textAlign: 'center',
                        padding: 6,
                        color: 'text.secondary',
                    }}
                >
                    <Box sx={{ fontSize: '64px', marginBottom: 2 }}>🏆</Box>
                    <Typography
                        sx={{
                            fontSize: '1.125rem',
                            marginBottom: 1,
                            fontWeight: 700,
                            color: 'text.primary',
                        }}
                    >
                        No Content Yet
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        Start creating content to see your top performers here
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default TopContent;