import { Box, Typography, Card, Stack, Chip, LinearProgress } from '@mui/material';
import {
    CheckCircle as VerifiedIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { renderVerificationBadge, getStatusIcon, calculateRiskScore } from '../utils/helpers.jsx';

const ExecutiveSummary = ({ factCheck }) => {
    const riskScore = calculateRiskScore(factCheck);
    const totalClaims = factCheck.verification_results?.length || 0;
    const verifiedClaims = factCheck.verification_results?.filter(
        (r) => r.verification?.status === 'verified'
    ).length || 0;
    const disputedClaims = factCheck.verification_results?.filter(
        (r) => r.verification?.status === 'disputed' || r.issue
    ).length || 0;

    const getSummaryMessage = () => {
        if (factCheck.status === 'verified') {
            return 'Your content has been verified and is ready to publish.';
        } else if (factCheck.status === 'disputed' || factCheck.status === 'context_mismatch') {
            return 'Issues detected in your content. Please review the findings below.';
        } else if (factCheck.status === 'no_claims' || factCheck.status === 'not_applicable') {
            return 'No factual claims detected. Your content is ready to publish.';
        }
        return 'Review the verification report below before publishing.';
    };

    const StatusIcon = getStatusIcon(factCheck.status);

    return (
        <Card
            sx={{
                marginTop: 3,
                padding: { xs: 2.5, md: 3 },
                borderRadius: 3,
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.9) 100%)',
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginBottom: 2 }}>
                <Box
                    sx={{
                        bgcolor: 'action.selected',
                        borderRadius: 2,
                        padding: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <StatusIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 0.5 }}>
                        Executive Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {getSummaryMessage()}
                    </Typography>
                </Box>
                {renderVerificationBadge(factCheck.status, 'large')}
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                    marginTop: 3,
                }}
            >
                {/* Risk Score */}
                <Card
                    sx={{
                        padding: 2,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        RISK SCORE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: riskScore.color }}>
                            {riskScore.score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            / 100
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={riskScore.score}
                        sx={{
                            marginTop: 1.5,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'action.selected',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: riskScore.color,
                                borderRadius: 3,
                            },
                        }}
                    />
                    <Typography variant="caption" sx={{ marginTop: 1, display: 'block', fontWeight: 600 }}>
                        {riskScore.label}
                    </Typography>
                </Card>

                {/* Claims Analyzed */}
                <Card
                    sx={{
                        padding: 2,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        CLAIMS ANALYZED
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, marginTop: 1, color: 'info.main' }}>
                        {totalClaims}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ marginTop: 1.5 }}>
                        <Chip
                            icon={<VerifiedIcon />}
                            label={`${verifiedClaims} Verified`}
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.75rem' }}
                        />
                        {disputedClaims > 0 && (
                            <Chip
                                icon={<ErrorIcon />}
                                label={`${disputedClaims} Flagged`}
                                size="small"
                                color="error"
                                sx={{ fontSize: '0.75rem' }}
                            />
                        )}
                    </Stack>
                </Card>

                {/* AI Suggestions */}
                <Card
                    sx={{
                        padding: 2,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        AI CORRECTIONS
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, marginTop: 1, color: 'warning.main' }}>
                        {factCheck.edit_suggestions?.length || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ marginTop: 1.5, display: 'block' }}>
                        {factCheck.edit_suggestions?.length > 0
                            ? 'AI has suggested improvements'
                            : 'No corrections needed'}
                    </Typography>
                </Card>
            </Box>
        </Card>
    );
};

export default ExecutiveSummary;