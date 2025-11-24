import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    People as PeopleIcon,
    ThumbUp as ThumbUpIcon,
    Comment as CommentIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { formatNumber } from '../utils/helpers';

const OverviewCards = ({ userStats }) => {
    const cards = [
        {
            icon: ImageIcon,
            value: userStats.content_stats.total_posts,
            label: 'Total Posts',
            color: 'primary.main',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            icon: VideoIcon,
            value: userStats.content_stats.total_reels,
            label: 'Total Reels',
            color: 'secondary.main',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            icon: PeopleIcon,
            value: formatNumber(userStats.audience_stats.followers_count),
            label: 'Followers',
            color: 'info.main',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            icon: ThumbUpIcon,
            value: formatNumber(userStats.engagement_stats.total_likes),
            label: 'Total Likes',
            color: 'success.main',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        },
        {
            icon: CommentIcon,
            value: formatNumber(userStats.engagement_stats.total_comments),
            label: 'Total Comments',
            color: 'warning.main',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        {
            icon: TrendingIcon,
            value: `${userStats.engagement_stats.avg_engagement_rate.toFixed(1)}%`,
            label: 'Avg Engagement',
            color: 'error.main',
            gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
        },
    ];

    return (
        <Grid container spacing={2.5} sx={{ marginBottom: 4 }}>
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                    <Grid item xs={6} sm={4} md={2} key={index}>
                        <Card
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            sx={{
                                height: '100%',
                                background: card.gradient,
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    textAlign: 'center',
                                    padding: { xs: 2, md: 2.5 },
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: 2,
                                        padding: 1,
                                        display: 'inline-flex',
                                        marginBottom: 1.5,
                                    }}
                                >
                                    <IconComponent sx={{ fontSize: 32 }} />
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        marginBottom: 0.5,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {card.value}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: { xs: '0.75rem', md: '0.8125rem' },
                                        fontWeight: 600,
                                        opacity: 0.95,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {card.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default OverviewCards;