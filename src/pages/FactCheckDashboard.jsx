import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../context/NotificationContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Chip,
  Button,
  Link,
  Stack,
  Divider,
  IconButton,
  keyframes,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { factCheckAPI, postsAPI, reelsAPI, BACKEND_URL } from '../services/api';
import Spinner from '../components/Spinner';
import { SkeletonFactCheckDashboard } from '../components/Skeleton';

// Progress bar animation
const indeterminateProgress = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const FactCheckDashboard = () => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { type, id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  // [FIX] New state for button submission to avoid full page reload/skeleton
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [factCheck, setFactCheck] = useState(null);
  const [content, setContent] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [error, setError] = useState('');
  const [progressStage, setProgressStage] = useState('');

  // Modal state for long text
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // Helper to show long text in modal
  const showInModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Helper to truncate text
  const TruncatedText = ({ text, maxLength = 150, title }) => {
    if (!text) return <Typography>N/A</Typography>;
    if (text.length <= maxLength) return <Typography>{text}</Typography>;

    return (
      <Box>
        <Typography>{text.substring(0, maxLength)}...</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => showInModal(title, text)}
          sx={{ marginTop: 1, fontSize: '12px', padding: '6px 12px' }}
        >
          View Full Text
        </Button>
      </Box>
    );
  };

  const fetchContent = useCallback(() => {
    let pollInterval = null;
    const loadData = async () => {
      try {
        setLoading(true);

        const contentResponse = type === 'post'
          ? await postsAPI.getPost(id)
          : await reelsAPI.getReel(id);

        const contentData = contentResponse.data[type];
        setContent(contentData);

        const factCheckResponse = type === 'post'
          ? await factCheckAPI.getPostFactCheckStatus(id)
          : await factCheckAPI.getReelFactCheckStatus(id);

        const fcData = factCheckResponse.data.fact_check;

        if (fcData) {
          setFactCheck(fcData);
          setLoading(false);
          setProcessing(false);
        } else {
          setLoading(false);
          setProcessing(true);
          setProgressStage('AI is analyzing your content. This may take a moment...');

          pollInterval = setInterval(async () => {
            try {
              const statusResp = type === 'post'
                ? await factCheckAPI.getPostFactCheckStatus(id)
                : await factCheckAPI.getReelFactCheckStatus(id);

              const newFcData = statusResp.data.fact_check;

              if (newFcData) {
                clearInterval(pollInterval);
                setFactCheck(newFcData);
                setProcessing(false);
              }
            } catch (pollErr) {
              console.warn('Dashboard poll error:', pollErr);
            }
          }, 3000);
        }
      } catch (err) {
        const errorMsg = 'Failed to load content';
        setError(errorMsg);
        showSnackbar(errorMsg, 'error');
        setLoading(false);
        if (pollInterval) clearInterval(pollInterval);
      }
    };

    loadData();

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [type, id]);

  useEffect(() => {
    document.title = 'Fact Check Dashboard';
    const cleanup = fetchContent();
    return cleanup;
  }, [fetchContent]);

  // [FIX] Helper function to update Feed Cache Optimistically
  const updateFeedCache = (newItem) => {
    queryClient.setQueryData(['feed'], (oldData) => {
      if (!oldData || !oldData.pages) return undefined; // If no cache, let it fetch normally

      // Clone the pages array to ensure immutability
      const newPages = [...oldData.pages];

      // Prepend the new item to the first page's feed array
      if (newPages.length > 0) {
        const firstPage = newPages[0];
        newPages[0] = {
          ...firstPage,
          feed: [newItem, ...(firstPage.feed || [])],
        };
      }

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const handleApprove = async () => {
    if (!selectedAction) {
      showSnackbar('Please select an option', 'error');
      return;
    }
    try {
      // [FIX] Use isSubmitting instead of setLoading to prevent skeleton flash
      setIsSubmitting(true);

      const response = await (type === 'post'
        ? factCheckAPI.approvePost(id, selectedAction)
        : factCheckAPI.approveReel(id, selectedAction));

      if (selectedAction === 'cancel') {
        showSnackbar('Content deleted successfully', 'success');
        // [FIX] Removed state: { refresh: true } to prevent delayed reload
        navigate('/feed', { replace: true });
      } else {
        // [FIX] Optimistically update cache for instant UI
        const approvedItem = response.data[type]; // 'post' or 'reel' object from backend
        if (approvedItem) {
          // Inject the 'type' property which backend model to_dict() might miss but frontend Feed needs
          const itemWithMeta = { ...approvedItem, type: type };
          updateFeedCache(itemWithMeta);
        }

        if (selectedAction === 'apply_ai_fix') {
          showSnackbar('AI corrections applied! Content published! 🎉', 'success');
        } else {
          showSnackbar('Content published successfully! 🎉', 'success');
        }

        // [FIX] Navigate without forcing refresh, relying on the manual cache update for speed
        navigate('/feed', { replace: true });
      }
    } catch (err) {
      const errorMsg = 'Failed to process action';
      setError(errorMsg);
      showSnackbar(errorMsg, 'error');
      // [FIX] Turn off submitting state on error
      setIsSubmitting(false);
    }
  };

  const renderVerificationBadge = (status, size = 'medium') => {
    const badges = {
      verified: { text: '✅ Verified', color: 'success' },
      disputed: { text: '⚠️ Disputed', color: 'error' },
      unverified: { text: '🔍 Unverified', color: 'warning' },
      no_claims: { text: '✅ No Claims', color: 'success' },
      personal: { text: '👤 Personal', color: 'info' },
      context_mismatch: { text: '🚫 Context Mismatch', color: 'error' },
      flagged: { text: '⚠️ Flagged', color: 'error' },
      not_applicable: { text: '✅ Not Applicable', color: 'success' }
    };
    const badge = badges[status] || badges.unverified;
    return (
      <Chip
        label={badge.text}
        color={badge.color}
        size={size === 'large' ? 'medium' : 'small'}
        sx={{
          fontWeight: 700,
          fontSize: size === 'large' ? '0.8125rem' : '0.6875rem',
          padding: size === 'large' ? '4px 8px' : '2px 5px',
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <SkeletonFactCheckDashboard />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            maxWidth: 1200,
            margin: { xs: '12px auto', sm: '18px auto', md: '22px auto' },
            padding: 0,
          }}
        >
          <Box
            sx={{
              padding: 2,
              borderRadius: 1,
              bgcolor: 'error.light',
              color: 'error.dark',
              border: 1,
              borderColor: 'error.main',
            }}
          >
            {error}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          maxWidth: 1200,
          margin: { xs: '12px auto', sm: '18px auto', md: '22px auto' },
          padding: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '1.0625rem', sm: '1.25rem', md: '1.5rem' },
              marginTop: 0,
              marginBottom: { xs: 1.5, sm: 1.75, md: 2.25 },
              color: 'text.primary',
            }}
          >
            Creator Dashboard
          </Typography>
        </motion.div>

        {processing && (
          <Card
            sx={{
              padding: { xs: 1.25, sm: 1.375, md: 1.5 },
              borderRadius: { xs: '6px', md: '8px' },
              marginBottom: { xs: 1.5, sm: 1.75, md: 2.25 },
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" sx={{ margin: '0 0 0.75rem 0' }}>
              ⏳ Processing...
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2.5 }}>
              {progressStage}
            </Typography>
            <Box sx={{ width: '100%', marginTop: 2.5 }}>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: '6px',
                  bgcolor: 'action.selected',
                  '& .MuiLinearProgress-bar': {
                    background: (theme) =>
                      `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)',
                    animation: `${indeterminateProgress} 2s infinite ease-in-out`,
                  },
                }}
              />
            </Box>
          </Card>
        )}

        {!processing && factCheck && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr' },
                gap: { xs: '12px' },
                marginBottom: { xs: '14px' },
                '@media (min-width: 900px)': {
                  gridTemplateColumns: '1fr 1.75fr',
                  gap: '18px',
                  marginBottom: '22px',
                },
              }}
            >
              {/* --- Left Column: Content Preview --- */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: '10px' },
                  '@media (min-width: 900px)': {
                    gap: '15px',
                  },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card
                    sx={{
                      bgcolor: 'background.default',
                      padding: { xs: 1.25, sm: 1.5, md: 1.875 },
                      borderRadius: { xs: '6px', md: '8px' },
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: { xs: '0 1px 4px rgba(0, 0, 0, 0.03)', md: '0 3px 9px rgba(0, 0, 0, 0.03)' },
                      position: { md: 'sticky' },
                      top: { md: '12px' },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                        color: 'text.primary',
                        marginTop: 0,
                        marginBottom: { xs: 1.25, sm: 1.375, md: 1.5 },
                        paddingBottom: { xs: '5px', md: '6px' },
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      Your Content
                    </Typography>
                    {type === 'post' && content?.image_url && (
                      <Box
                        component="img"
                        src={`${BACKEND_URL}${content.image_url}`}
                        alt="Post"
                        sx={{
                          width: '100%',
                          borderRadius: '6px',
                          border: 1,
                          borderColor: 'divider',
                          height: 'auto',
                          marginBottom: content?.caption || factCheck.extracted_text ? 1.5 : 0,
                        }}
                      />
                    )}
                    {type === 'reel' && content?.video_url && (
                      <Box
                        component="video"
                        src={`${BACKEND_URL}${content.video_url}`}
                        controls
                        sx={{
                          width: '100%',
                          borderRadius: '6px',
                          border: 1,
                          borderColor: 'divider',
                          height: 'auto',
                          marginBottom: content?.caption || factCheck.extracted_text ? 1.5 : 0,
                        }}
                      />
                    )}
                    {content?.caption && (
                      <Box
                        sx={{
                          marginTop: 1.5,
                          paddingTop: 1.5,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            marginBottom: 0.625,
                            fontWeight: 600,
                          }}
                        >
                          Caption:
                        </Typography>
                        <Typography
                          sx={{
                            margin: 0,
                            fontSize: '0.8125rem',
                            lineHeight: 1.5,
                            color: 'text.primary',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {content.caption}
                        </Typography>
                      </Box>
                    )}
                    {factCheck.extracted_text && (
                      <Box
                        sx={{
                          marginTop: 1.5,
                          paddingTop: 1.5,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            marginBottom: 0.625,
                            fontWeight: 600,
                          }}
                        >
                          Extracted Text:
                        </Typography>
                        <Box
                          sx={{
                            fontFamily: 'Courier New, Courier, monospace',
                            fontSize: '0.75rem',
                            bgcolor: 'action.selected',
                            padding: 0.75,
                            borderRadius: '4px',
                          }}
                        >
                          <TruncatedText
                            text={factCheck.extracted_text}
                            maxLength={200}
                            title="Extracted Text"
                          />
                        </Box>
                      </Box>
                    )}
                  </Card>
                </motion.div>
              </Box>

              {/* --- Right Column: AI Analysis --- */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: '10px' },
                  '@media (min-width: 900px)': {
                    gap: '15px',
                  },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}
                >
                  {/* 1. Overall Status */}
                  <Card
                    sx={{
                      bgcolor: 'background.default',
                      padding: { xs: 1.25, sm: 1.5, md: 1.875 },
                      borderRadius: { xs: '6px', md: '8px' },
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: { xs: '0 1px 4px rgba(0, 0, 0, 0.03)', md: '0 3px 9px rgba(0, 0, 0, 0.03)' },
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                        color: 'text.primary',
                        marginTop: 0,
                        marginBottom: { xs: 1.25, sm: 1.375, md: 1.5 },
                        paddingBottom: { xs: '5px', md: '6px' },
                        borderBottom: 1,
                        borderColor: 'divider',
                        textAlign: 'left',
                      }}
                    >
                      Overall Status
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                      {renderVerificationBadge(factCheck.status, 'large')}
                    </Box>
                  </Card>

                  {/* 2. Verification Report Cards (Naya Design) */}
                  {factCheck.verification_results && factCheck.verification_results.length > 0 && (
                    <Card
                      sx={{
                        bgcolor: 'background.default',
                        padding: { xs: 1.25, sm: 1.5, md: 1.875 },
                        borderRadius: { xs: '6px', md: '8px' },
                        border: 1,
                        borderColor: 'divider',
                        boxShadow: { xs: '0 1px 4px rgba(0, 0, 0, 0.03)', md: '0 3px 9px rgba(0, 0, 0, 0.03)' },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                          color: 'text.primary',
                          marginTop: 0,
                          marginBottom: { xs: 1.25, sm: 1.375, md: 1.5 },
                          paddingBottom: { xs: '5px', md: '6px' },
                          borderBottom: 1,
                          borderColor: 'divider',
                        }}
                      >
                        🔍 AI Verification Report
                      </Typography>
                      <Stack spacing={1.5}>
                    {factCheck.verification_results.map((result, index) => {
                      const isContextMismatch = result.issue && !result.verification;

                        if (isContextMismatch) {
                          return (
                            <Card
                              key={index}
                              sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: '5px',
                                marginBottom: 1.5,
                                overflow: 'hidden',
                                '&:last-child': { marginBottom: 0 },
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 10px',
                                  fontWeight: 600,
                                  bgcolor: (theme) =>
                                    result.severity === 'high'
                                      ? theme.palette.error.light
                                      : theme.palette.warning.light,
                                  borderBottom: 1,
                                  borderColor: (theme) =>
                                    result.severity === 'high'
                                      ? theme.palette.error.main
                                      : theme.palette.warning.main,
                                }}
                              >
                                <Typography component="strong" sx={{ fontWeight: 600 }}>
                                  {result.issue}
                                </Typography>
                                {renderVerificationBadge('flagged', 'large')}
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Issue Type:
                                </Typography>
                                <Typography
                                  sx={{
                                    margin: 0,
                                    fontStyle: 'italic',
                                    fontSize: '0.875rem',
                                    color: 'text.primary',
                                    fontWeight: 500,
                                  }}
                                >
                                  {result.mismatch_type || 'Content-Caption Mismatch'}
                                </Typography>
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Risk Level:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    color: (theme) =>
                                      result.severity === 'high'
                                        ? theme.palette.error.main
                                        : theme.palette.warning.main,
                                  }}
                                >
                                  {result.severity?.toUpperCase() || 'HIGH'}
                                </Typography>
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Explanation:
                                </Typography>
                                <TruncatedText
                                  text={result.explanation || "Caption doesn't match the actual content in the media."}
                                  maxLength={150}
                                  title="Explanation"
                                />
                              </Box>
                              <Box sx={{ padding: 1.25 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Confidence:
                                </Typography>
                                <Typography sx={{ margin: 0, lineHeight: 1.5, color: 'text.primary' }}>
                                  {result.confidence || 'High'}
                                </Typography>
                              </Box>
                            </Card>
                          );
                        } else {
                          const status = result.verification?.status || 'unverified';
                          const statusColors = {
                            verified: { bg: 'success.light', border: 'success.main' },
                            disputed: { bg: 'error.light', border: 'error.main' },
                            unverified: { bg: 'warning.light', border: 'warning.main' },
                          };
                          const colors = statusColors[status] || statusColors.unverified;

                          return (
                            <Card
                              key={index}
                              sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: '5px',
                                marginBottom: 1.5,
                                overflow: 'hidden',
                                '&:last-child': { marginBottom: 0 },
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 10px',
                                  fontWeight: 600,
                                  bgcolor: colors.bg,
                                  borderBottom: 1,
                                  borderColor: colors.border,
                                }}
                              >
                                <Typography component="strong" sx={{ fontWeight: 600 }}>
                                  Claim {index + 1}:
                                </Typography>
                                {renderVerificationBadge(status)}
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Your Claim:
                                </Typography>
                                <Typography
                                  sx={{
                                    margin: 0,
                                    fontStyle: 'italic',
                                    fontSize: '0.875rem',
                                    color: 'text.primary',
                                    fontWeight: 500,
                                  }}
                                >
                                  &quot;{result.claim?.claim || 'N/A'}&quot;
                                </Typography>
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  AI Findings:
                                </Typography>
                                <TruncatedText
                                  text={result.verification?.verified_info || 'N/A'}
                                  maxLength={150}
                                  title="AI Findings"
                                />
                              </Box>
                              <Box sx={{ padding: 1.25, borderBottom: '1px dashed', borderColor: 'divider' }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: 0.625,
                                  }}
                                >
                                  Explanation:
                                </Typography>
                                <TruncatedText
                                  text={result.verification?.explanation || 'N/A'}
                                  maxLength={150}
                                  title="Explanation"
                                />
                              </Box>
                              {result.verification?.sources && result.verification.sources.length > 0 && (
                                <Box
                                  sx={{
                                    padding: 1.25,
                                    bgcolor: 'action.selected',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '0.75rem',
                                      color: 'text.secondary',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      fontWeight: 600,
                                      display: 'block',
                                      marginBottom: 0.625,
                                    }}
                                  >
                                    Sources:
                                  </Typography>
                                  <Stack spacing={0.5}>
                                    {result.verification.sources.map((source, idx) => (
                                      <Link
                                        key={idx}
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                          display: 'block',
                                          marginBottom: 0.5,
                                          textDecoration: 'none',
                                          color: 'primary.main',
                                          fontSize: '13px',
                                          '&:hover': {
                                            textDecoration: 'underline',
                                          },
                                        }}
                                      >
                                        {source.name}
                                      </Link>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </Card>
                          );
                        }
                      })}
                    </Stack>
                  </Card>
                )}

                  {/* 3. AI Edit Suggestions (Naya "Before/After" Design) */}
                  {factCheck.edit_suggestions && factCheck.edit_suggestions.length > 0 && (
                    <Card
                      sx={{
                        bgcolor: 'background.default',
                        padding: { xs: 1.25, sm: 1.5, md: 1.875 },
                        borderRadius: { xs: '6px', md: '8px' },
                        border: 1,
                        borderColor: 'divider',
                        boxShadow: { xs: '0 1px 4px rgba(0, 0, 0, 0.03)', md: '0 3px 9px rgba(0, 0, 0, 0.03)' },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                          color: 'info.dark',
                          marginTop: 0,
                          marginBottom: { xs: 1.25, sm: 1.375, md: 1.5 },
                          paddingBottom: { xs: '5px', md: '6px' },
                          borderBottom: 1,
                          borderColor: 'divider',
                        }}
                      >
                        🤖 AI Edit Suggestions
                      </Typography>
                      <Stack spacing={1}>
                        {factCheck.edit_suggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: { xs: '1fr' },
                              gap: { xs: '8px' },
                              marginBottom: { xs: '8px' },
                              '@media (min-width: 480px)': {
                                gridTemplateColumns: '1fr 1fr',
                                gap: '9px',
                              },
                              '@media (min-width: 900px)': {
                                gap: '9px',
                                marginBottom: '9px',
                              },
                              '&:last-child': {
                                marginBottom: 0,
                              },
                            }}
                          >
                            {/* Before Box */}
                            <Box
                              sx={{
                                borderRadius: '5px',
                                padding: { xs: '8px' },
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                  ? 'rgba(211, 47, 47, 0.15)' 
                                  : 'rgba(211, 47, 47, 0.1)',
                                border: 1,
                                borderColor: (theme) => theme.palette.mode === 'dark'
                                  ? 'rgba(211, 47, 47, 0.3)'
                                  : 'rgba(211, 47, 47, 0.2)',
                                '@media (min-width: 480px)': {
                                  padding: '9px',
                                },
                                '@media (min-width: 900px)': {
                                  padding: '10px',
                                },
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={{ xs: 0.5, sm: 0.625 }}
                                alignItems="center"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                  marginBottom: { xs: '5px', md: '6px' },
                                  color: 'error.dark',
                                }}
                              >
                                <XCircleIcon
                                  sx={{
                                    width: { xs: 16, md: 18 },
                                    height: { xs: 16, md: 18 },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                    color: 'error.dark',
                                  }}
                                >
                                  Before (Original)
                                </Typography>
                              </Stack>
                              <Typography
                                sx={{
                                  margin: 0,
                                  fontSize: { xs: '0.75rem', md: '0.8125rem' },
                                  lineHeight: { xs: 1.4, md: 1.5 },
                                  color: 'error.dark',
                                  textDecoration: 'line-through',
                                }}
                              >
                                &quot;{suggestion.claim}&quot;
                              </Typography>
                            </Box>

                            {/* After Box */}
                            <Box
                              sx={{
                                borderRadius: '5px',
                                padding: { xs: '8px' },
                                bgcolor: (theme) => theme.palette.mode === 'dark'
                                  ? 'rgba(46, 125, 50, 0.15)'
                                  : 'rgba(46, 125, 50, 0.1)',
                                border: 1,
                                borderColor: (theme) => theme.palette.mode === 'dark'
                                  ? 'rgba(46, 125, 50, 0.3)'
                                  : 'rgba(46, 125, 50, 0.2)',
                                '@media (min-width: 480px)': {
                                  padding: '9px',
                                },
                                '@media (min-width: 900px)': {
                                  padding: '10px',
                                },
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={{ xs: 0.5, sm: 0.625 }}
                                alignItems="center"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                  marginBottom: { xs: '5px', md: '6px' },
                                  color: 'success.dark',
                                }}
                              >
                                <CheckIcon
                                  sx={{
                                    width: { xs: 16, md: 18 },
                                    height: { xs: 16, md: 18 },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                    color: 'success.dark',
                                  }}
                                >
                                  After (Suggested)
                                </Typography>
                              </Stack>
                              <Typography
                                sx={{
                                  margin: 0,
                                  fontSize: { xs: '0.75rem', md: '0.8125rem' },
                                  lineHeight: { xs: 1.4, md: 1.5 },
                                  color: 'success.dark',
                                  fontWeight: 500,
                                }}
                              >
                                &quot;{suggestion.correction}&quot;
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Card>
                  )}
                </motion.div>
              </Box>
            </Box>

            {/* Action Options (Thoda improved UI) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  bgcolor: 'background.default',
                  padding: { xs: 1.25, sm: 1.5, md: 1.875 },
                  borderRadius: { xs: '6px', md: '8px' },
                  border: 1,
                  borderColor: 'divider',
                  boxShadow: { xs: '0 1px 4px rgba(0, 0, 0, 0.03)', md: '0 3px 9px rgba(0, 0, 0, 0.03)' },
                  marginTop: { xs: 1.5, sm: 1.75, md: 2.25 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.0625rem' },
                    color: 'text.primary',
                    marginTop: 0,
                    marginBottom: { xs: 1.25, sm: 1.375, md: 1.5 },
                    paddingBottom: { xs: '5px', md: '6px' },
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  What would you like to do?
                </Typography>
                <Grid
                  container
                  spacing={{ xs: 1, sm: 1.125, md: 1.25 }}
                  sx={{
                    marginBottom: { xs: 1.25, sm: 1.5, md: 1.875 },
                  }}
                >
                  <Grid item xs={12} sm={factCheck.edit_suggestions?.length > 0 ? 6 : 12} md={factCheck.edit_suggestions?.length > 0 ? 4 : 6}>
                    <Card
                      onClick={() => setSelectedAction('publish_as_is')}
                      sx={{
                        padding: 1.5,
                        borderRadius: '5px',
                        border: 2,
                        borderColor: selectedAction === 'publish_as_is' ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: selectedAction === 'publish_as_is' ? 'background.default' : 'background.paper',
                        position: 'relative',
                        boxShadow: selectedAction === 'publish_as_is' ? '0 0 15px rgba(255, 107, 53, 0.3)' : 'none',
                        transform: selectedAction === 'publish_as_is' ? 'translateY(-2px)' : 'none',
                        '&:hover': {
                          borderColor: 'primary.light',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {selectedAction === 'publish_as_is' && (
                        <CheckCircleIcon
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            color: 'primary.main',
                          }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          margin: '0 0 0.625rem 0',
                          color: 'text.primary',
                          fontSize: { xs: '0.8125rem', md: '0.875rem' },
                        }}
                      >
                        Publish As Is
                      </Typography>
                      <Typography
                        sx={{
                          margin: 0,
                          fontSize: '11px',
                          color: 'text.secondary',
                          lineHeight: 1.4,
                        }}
                      >
                        Publish with current verification status (tag will be visible to users)
                      </Typography>
                    </Card>
                  </Grid>

                  {factCheck.edit_suggestions && factCheck.edit_suggestions.length > 0 && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          padding: 1.5,
                          borderRadius: '5px',
                          border: 2,
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                          opacity: 0.6,
                          cursor: 'not-allowed',
                          pointerEvents: 'none',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            margin: '0 0 0.625rem 0',
                            color: 'text.primary',
                            fontSize: { xs: '0.8125rem', md: '0.875rem' },
                          }}
                        >
                          ✨ Apply AI Fix{' '}
                          <Typography component="span" sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600 }}>
                            (Coming Soon)
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            margin: 0,
                            fontSize: '11px',
                            color: 'text.secondary',
                            lineHeight: 1.4,
                          }}
                        >
                          Automatically correct misinformation and publish as &apos;Verified&apos;.
                        </Typography>
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={factCheck.edit_suggestions?.length > 0 ? 6 : 12} md={factCheck.edit_suggestions?.length > 0 ? 4 : 6}>
                    <Card
                      onClick={() => setSelectedAction('cancel')}
                      sx={{
                        padding: 1.5,
                        borderRadius: '5px',
                        border: 2,
                        borderColor: selectedAction === 'cancel' ? 'error.main' : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        bgcolor: selectedAction === 'cancel' ? 'background.default' : 'background.paper',
                        position: 'relative',
                        boxShadow: selectedAction === 'cancel' ? '0 0 15px rgba(211, 47, 47, 0.3)' : 'none',
                        transform: selectedAction === 'cancel' ? 'translateY(-2px)' : 'none',
                        '&:hover': {
                          borderColor: 'error.main',
                        },
                      }}
                    >
                      {selectedAction === 'cancel' && (
                        <CheckCircleIcon
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            color: 'error.main',
                          }}
                        />
                      )}
                      <Typography
                        variant="h6"
                        sx={{
                          margin: '0 0 0.625rem 0',
                          color: 'text.primary',
                          fontSize: { xs: '0.8125rem', md: '0.875rem' },
                        }}
                      >
                        Cancel & Delete
                      </Typography>
                      <Typography
                        sx={{
                          margin: 0,
                          fontSize: '11px',
                          color: 'text.secondary',
                          lineHeight: 1.4,
                        }}
                      >
                        Delete this content and start over
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Button
                  onClick={handleApprove}
                  variant="contained"
                  fullWidth
                  disabled={!selectedAction || isSubmitting}
                  sx={{
                    marginTop: { xs: 1.25, sm: 1.5, md: 1.875 },
                    padding: { xs: '8px', sm: '9px', md: '10px' },
                    fontSize: { xs: '0.8125rem', md: '0.875rem' },
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  {isSubmitting && <Spinner size="sm" color="white" />}
                  {selectedAction === 'cancel' ? 'Delete Content' : 'Publish Content'}
                </Button>
              </Card>
            </motion.div>
          </>
        )}

        {/* Modal for displaying long text */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
              m: isMobile ? 0 : 2,
            },
          }}
          sx={{
            '& .MuiBackdrop-root': {
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <IconButton
            aria-label="Close dialog"
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              opacity: 0.7,
              zIndex: 1,
              '&:hover': {
                opacity: 1,
                bgcolor: 'action.hover',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogTitle sx={{ pt: 2.5, pr: 6, fontWeight: 700 }}>
            {modalTitle}
          </DialogTitle>

          <DialogContent sx={{ pt: 2, px: 3, pb: 3 }}>
            <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {modalContent}
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default FactCheckDashboard;