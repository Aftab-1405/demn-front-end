import { useState, useEffect, useCallback } from 'react';
import { Box, Alert, AlertTitle, Button, Container } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { analyticsAPI, factCheckAPI } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { SkeletonAnalyticsDashboard } from '../../components/Skeleton';
import { motion } from 'framer-motion';

// Components
import AnalyticsHeader from './components/AnalyticsHeader';
import TimeRangeSelector from './components/TimeRangeSelector';
import OverviewCards from './components/OverviewCards';
import EngagementChart from './components/EngagementChart';
import VerificationPieChart from './components/VerificationPieChart';
import ReportsList from './components/ReportsList';
import TopContent from './components/TopContent';
import PlatformStats from './components/PlatformStats';

// Utils
import { getUserIdFromToken } from './utils/helpers';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState(30);

    const [userStats, setUserStats] = useState(null);
    const [factCheckStats, setFactCheckStats] = useState(null);
    const [myReports, setMyReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);

    const { showSnackbar } = useNotifications();

    const loadAnalytics = useCallback(async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            const errorMsg = 'Please login to view analytics';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [userAnalytics, factCheck] = await Promise.all([
                analyticsAPI.getUserAnalytics(userId, timeRange),
                analyticsAPI.getFactCheckStats(timeRange),
            ]);

            setUserStats(userAnalytics.data);
            setFactCheckStats(factCheck.data);
        } catch (err) {
            console.error('Error loading analytics:', err);
            const errorMsg = err.response?.data?.error || 'Failed to load analytics';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    }, [timeRange, showSnackbar]);

    const loadReports = useCallback(async () => {
        setReportsLoading(true);
        try {
            const response = await factCheckAPI.getMyReports();
            setMyReports(response.data.reports || []);
        } catch (err) {
            console.error('Error loading reports:', err);
        } finally {
            setReportsLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = 'Analytics Dashboard | D.E.M.N';
        loadAnalytics();
        loadReports();
    }, [loadAnalytics, loadReports]);

    if (loading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    paddingX: { xs: 2, sm: 3, md: 4 },
                    paddingY: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Container maxWidth="xl" disableGutters>
                    <SkeletonAnalyticsDashboard />
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    paddingX: { xs: 2, sm: 3, md: 4 },
                    paddingY: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Container maxWidth="xl" disableGutters>
                    <Alert
                        severity="error"
                        icon={<ErrorIcon />}
                        sx={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            minHeight: '300px',
                            justifyContent: 'center',
                            borderRadius: 3,
                            '& .MuiAlert-message': {
                                width: '100%',
                                textAlign: 'center',
                            },
                        }}
                    >
                        <AlertTitle sx={{ fontSize: '20px', marginBottom: 1, fontWeight: 700 }}>
                            Error Loading Analytics
                        </AlertTitle>
                        <Box sx={{ fontSize: '16px', marginBottom: 2, color: 'text.secondary' }}>
                            {error}
                        </Box>
                        <Button variant="contained" onClick={loadAnalytics} size="large">
                            Retry
                        </Button>
                    </Alert>
                </Container>
            </Box>
        );
    }

    if (!userStats) return null;

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                bgcolor: 'background.default',
                paddingX: { xs: 2, sm: 3, md: 4 },
                paddingY: { xs: 2, sm: 3, md: 4 },
                boxSizing: 'border-box',
            }}
        >
            <Container maxWidth="xl" disableGutters>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnalyticsHeader timeRange={timeRange} />
                </motion.div>

                {/* Time Range Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
                </motion.div>

                {/* Overview Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <OverviewCards userStats={userStats} />
                </motion.div>

                {/* Charts Row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
                        gap: { xs: 2, sm: 3 },
                        marginTop: { xs: 2, sm: 3 },
                        marginBottom: { xs: 2, sm: 3 },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ width: '100%', minWidth: 0 }}
                    >
                        <EngagementChart userStats={userStats} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        style={{ width: '100%', minWidth: 0 }}
                    >
                        <VerificationPieChart userStats={userStats} />
                    </motion.div>
                </Box>

                {/* Reports and Top Content Row */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                        gap: { xs: 2, sm: 3 },
                        marginBottom: { xs: 2, sm: 3 },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        style={{ width: '100%', minWidth: 0 }}
                    >
                        <ReportsList reports={myReports} loading={reportsLoading} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{ width: '100%', minWidth: 0 }}
                    >
                        <TopContent topContent={userStats.top_content} />
                    </motion.div>
                </Box>

                {/* Platform Stats */}
                {factCheckStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        style={{ width: '100%', minWidth: 0 }}
                    >
                        <PlatformStats factCheckStats={factCheckStats} />
                    </motion.div>
                )}
            </Container>
        </Box>
    );
};

export default Analytics;