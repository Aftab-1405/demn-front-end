import { Box, Typography, Card, Stack, Link, Divider } from '@mui/material';
import {
    CheckCircle as VerifiedIcon,
    Cancel as DisputedIcon,
    Help as UnverifiedIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { renderVerificationBadge, TruncatedText } from '../utils/helpers.jsx';

const VerificationReport = ({ verificationResults, showInModal }) => {
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
                        bgcolor: 'primary.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <VerifiedIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 700,
                    }}
                >
                    🔍 Detailed Verification Report
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Our AI has analyzed all factual claims in your content. Review each finding below:
            </Typography>

            <Stack spacing={2}>
                {verificationResults.map((result, index) => {
                    const isContextMismatch = result.issue && !result.verification;

                    if (isContextMismatch) {
                        return (
                            <Card
                                key={index}
                                sx={{
                                    border: 2,
                                    borderColor: result.severity === 'high' ? 'error.main' : 'warning.main',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 2,
                                        bgcolor: result.severity === 'high' ? 'error.light' : 'warning.light',
                                        borderBottom: 2,
                                        borderColor: result.severity === 'high' ? 'error.main' : 'warning.main',
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <WarningIcon
                                            sx={{
                                                color: result.severity === 'high' ? 'error.dark' : 'warning.dark',
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.9375rem',
                                                color: result.severity === 'high' ? 'error.dark' : 'warning.dark',
                                            }}
                                        >
                                            {result.issue}
                                        </Typography>
                                    </Stack>
                                    {renderVerificationBadge('flagged')}
                                </Box>

                                {/* Body */}
                                <Box sx={{ padding: 2 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                ISSUE TYPE
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, color: 'text.primary', marginTop: 0.5 }}>
                                                {result.mismatch_type || 'Content-Caption Mismatch'}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                RISK LEVEL
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: '1.125rem',
                                                    color: result.severity === 'high' ? 'error.main' : 'warning.main',
                                                    marginTop: 0.5,
                                                }}
                                            >
                                                {result.severity?.toUpperCase() || 'HIGH'} RISK
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                EXPLANATION
                                            </Typography>
                                            <Box sx={{ marginTop: 1 }}>
                                                <TruncatedText
                                                    text={
                                                        result.explanation ||
                                                        "Caption doesn't match the actual content in the media."
                                                    }
                                                    maxLength={150}
                                                    title="Explanation"
                                                    showInModal={showInModal}
                                                />
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                bgcolor: 'action.selected',
                                                padding: 1.5,
                                                borderRadius: 1,
                                                marginTop: 1,
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                ℹ️ AI Confidence: {result.confidence || 'High'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Card>
                        );
                    } else {
                        // Regular claim verification
                        const status = result.verification?.status || 'unverified';
                        const statusConfig = {
                            verified: {
                                bg: 'success.light',
                                border: 'success.main',
                                icon: VerifiedIcon,
                                color: 'success.dark',
                            },
                            disputed: {
                                bg: 'error.light',
                                border: 'error.main',
                                icon: DisputedIcon,
                                color: 'error.dark',
                            },
                            unverified: {
                                bg: 'warning.light',
                                border: 'warning.main',
                                icon: UnverifiedIcon,
                                color: 'warning.dark',
                            },
                        };
                        const config = statusConfig[status] || statusConfig.unverified;
                        const IconComponent = config.icon;

                        return (
                            <Card
                                key={index}
                                sx={{
                                    border: 2,
                                    borderColor: config.border,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                                }}
                            >
                                {/* Header */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 2,
                                        bgcolor: config.bg,
                                        borderBottom: 2,
                                        borderColor: config.border,
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconComponent sx={{ color: config.color }} />
                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.9375rem',
                                                color: config.color,
                                            }}
                                        >
                                            Claim #{index + 1}
                                        </Typography>
                                    </Stack>
                                    {renderVerificationBadge(status)}
                                </Box>

                                {/* Body */}
                                <Box sx={{ padding: 2 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                YOUR CLAIM
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontStyle: 'italic',
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    marginTop: 0.5,
                                                    fontSize: '0.9375rem',
                                                }}
                                            >
                                                &quot;{result.claim?.claim || 'N/A'}&quot;
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                AI FINDINGS
                                            </Typography>
                                            <Box sx={{ marginTop: 1 }}>
                                                <TruncatedText
                                                    text={result.verification?.verified_info || 'N/A'}
                                                    maxLength={150}
                                                    title="AI Findings"
                                                    showInModal={showInModal}
                                                />
                                            </Box>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                DETAILED EXPLANATION
                                            </Typography>
                                            <Box sx={{ marginTop: 1 }}>
                                                <TruncatedText
                                                    text={result.verification?.explanation || 'N/A'}
                                                    maxLength={150}
                                                    title="Explanation"
                                                    showInModal={showInModal}
                                                />
                                            </Box>
                                        </Box>

                                        {result.verification?.sources && result.verification.sources.length > 0 && (
                                            <>
                                                <Divider />
                                                <Box
                                                    sx={{
                                                        bgcolor: 'action.selected',
                                                        padding: 1.5,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ fontWeight: 700, color: 'text.secondary', marginBottom: 1 }}
                                                    >
                                                        📚 SOURCES
                                                    </Typography>
                                                    <Stack spacing={0.75} sx={{ marginTop: 1 }}>
                                                        {result.verification.sources.map((source, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={source.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    textDecoration: 'none',
                                                                    color: 'primary.main',
                                                                    fontSize: '0.8125rem',
                                                                    fontWeight: 600,
                                                                    '&:hover': {
                                                                        textDecoration: 'underline',
                                                                    },
                                                                }}
                                                            >
                                                                🔗 {source.name}
                                                            </Link>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </Card>
                        );
                    }
                })}
            </Stack>
        </Card>
    );
};

export default VerificationReport;