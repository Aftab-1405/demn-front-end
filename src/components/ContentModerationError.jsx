import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const ContentModerationError = ({ isOpen, onClose, error }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // If modal is not open, don't render
  if (!isOpen) return null;

  // Normalize error object - handle different possible structures
  let normalizedError = null;
  
  if (error) {
    // If error is already an object with the expected structure
    if (typeof error === 'object' && !Array.isArray(error) && (error.error || error.message || error.violations || error.reason || Object.keys(error).length > 0)) {
      normalizedError = {
        message: error.message || error.error || error.detail || 'Content violates community guidelines',
        error: error.error || error.errorType || error.type || 'Content moderation error',
        violations: error.violations || error.violation || (Array.isArray(error.violation) ? error.violation : []),
        reason: error.reason || error.analysis || error.explanation,
        technical_details: error.technical_details || error.technicalDetails || error.details,
      };
    } 
    // If error is a string, wrap it in an object
    else if (typeof error === 'string') {
      normalizedError = { message: error, error: 'Content moderation error' };
    }
  }

  // If no valid error after normalization, show default message
  if (!normalizedError) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
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
          onClick={onClose}
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
          🛡️ Content Moderation
        </DialogTitle>

        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
            Your content was rejected by our moderation system. Please review our community guidelines and try again.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const {
    reason,
    violations = [],
    message,
    technical_details,
    error: errorType
  } = normalizedError;

  // Map violation codes to user-friendly text with icons
  const violationInfo = {
    'nudity': {
      icon: '🔞',
      title: 'Nudity Detected',
      description: 'Image contains nudity or explicit content'
    },
    'explicit_sexual_content': {
      icon: '🚫',
      title: 'Explicit Sexual Content',
      description: 'Image contains sexually explicit material'
    },
    'graphic_violence': {
      icon: '⚠️',
      title: 'Graphic Violence',
      description: 'Image contains graphic violence or gore'
    },
    'hate_symbols': {
      icon: '🛑',
      title: 'Hate Symbols',
      description: 'Image contains hate symbols or offensive imagery'
    },
    'hate_speech': {
      icon: '❌',
      title: 'Hate Speech',
      description: 'Caption contains hate speech or discriminatory language'
    },
    'harassment': {
      icon: '🚨',
      title: 'Harassment',
      description: 'Content contains harassment or bullying'
    },
    'self_harm': {
      icon: '⚠️',
      title: 'Self-Harm Content',
      description: 'Content promotes self-harm or dangerous activities'
    },
    'moderation_error': {
      icon: '⚙️',
      title: 'Moderation System Error',
      description: 'Content moderation system encountered an error'
    }
  };

  // Determine if it's a service unavailable error (503)
  const isServiceUnavailable = errorType === 'Content moderation service unavailable' ||
    message?.includes('GEMINI_API_KEY');

  // Determine if it's a moderation error (500)
  const isModerationError = errorType === 'Content moderation error';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      disableEscapeKeyDown={false}
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
        onClick={onClose}
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
        {isServiceUnavailable ? "⚠️ Uploads Temporarily Disabled" : "🛡️ Content Rejected"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
        <Box sx={{ p: { xs: 0, md: 1 } }}>
        {isServiceUnavailable ? (
          /* Service Unavailable (503) */
          <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
            <Typography
              sx={{
                fontSize: { xs: 48, sm: 56, md: 64 },
                textAlign: 'center',
                mb: { xs: 1.5, md: 2 },
              }}
            >
              🚧
            </Typography>
            <Typography
              variant="h5"
              sx={{
                m: 0,
                mb: 1.25,
                fontSize: { xs: '1.25rem', sm: '1.3125rem', md: '1.375rem' },
                fontWeight: 600,
                color: 'text.primary',
                textAlign: 'center',
              }}
            >
              Content Moderation Unavailable
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                lineHeight: 1.6,
                color: 'text.secondary',
                mb: { xs: 2, sm: 2.25 },
                textAlign: 'center',
              }}
            >
              Our content moderation system is temporarily unavailable due to a server configuration issue.
              Uploads are disabled as a safety measure to prevent inappropriate content from being published.
            </Typography>
            <Alert
              severity="info"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                mb: 2,
                '& .MuiAlert-icon': {
                  color: 'info.main',
                },
              }}
            >
              <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'info.dark', mb: 1 }}>
                Why is this happening?
              </AlertTitle>
              <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6 }}>
                The server&apos;s AI moderation service is not configured. This is a safety feature
                to ensure NSFW and harmful content is never published without proper screening.
              </Typography>
            </Alert>
            <Typography
              sx={{
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                color: 'text.secondary',
                textAlign: 'center',
                mt: 2,
                fontStyle: 'italic',
              }}
            >
              Please contact the platform administrator or try again later.
            </Typography>
          </Box>
        ) : isModerationError ? (
          /* Moderation Error (500) */
          <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
            <Typography
              sx={{
                fontSize: { xs: 48, sm: 56, md: 64 },
                textAlign: 'center',
                mb: { xs: 1.5, md: 2 },
              }}
            >
              ⚙️
            </Typography>
            <Typography
              variant="h5"
              sx={{
                m: 0,
                mb: 1.25,
                fontSize: { xs: '1.25rem', sm: '1.3125rem', md: '1.375rem' },
                fontWeight: 600,
                color: 'text.primary',
                textAlign: 'center',
              }}
            >
              Content Screening Failed
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                lineHeight: 1.6,
                color: 'text.secondary',
                mb: { xs: 2, sm: 2.25 },
                textAlign: 'center',
              }}
            >
              Our content moderation system encountered an error while screening your upload.
              Your content was not published as a safety precaution.
            </Typography>
            {technical_details && (
              <Box sx={{ my: 2 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, fontWeight: 500, color: 'text.secondary' }}>
                      Technical Details (for support)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      component="code"
                      sx={{
                        display: 'block',
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {technical_details}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
            <Typography
              sx={{
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                color: 'text.secondary',
                textAlign: 'center',
                mt: 2,
                fontStyle: 'italic',
              }}
            >
              Please try again in a few moments. If the problem persists, contact support.
            </Typography>
          </Box>
        ) : (
          /* Content Violation (400) */
          <>
            <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  lineHeight: 1.6,
                  color: 'text.secondary',
                  mb: { xs: 2, sm: 2.25 },
                  textAlign: 'center',
                }}
              >
                {message || 'Your content violates our community guidelines and cannot be published.'}
              </Typography>

              {violations && violations.length > 0 && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                    mb: 2,
                    '& .MuiAlert-icon': {
                      color: 'error.main',
                    },
                  }}
                >
                  <AlertTitle sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 600, color: 'error.dark', mb: 1.5 }}>
                    Detected Violations:
                  </AlertTitle>
                  <Stack spacing={1}>
                  {violations.map((violation, index) => {
                    const info = violationInfo[violation] || {
                      icon: '⚠️',
                      title: violation.replace(/_/g, ' ').toUpperCase(),
                      description: 'Content violates community guidelines'
                    };

                    return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            textAlign: { xs: 'center', sm: 'left' },
                            gap: 1.5,
                            p: 1.5,
                            bgcolor: 'background.paper',
                            borderRadius: 1.5,
                            border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: 28, sm: 24 }, flexShrink: 0, lineHeight: 1 }}>
                            {info.icon}
                          </Typography>
                          <Box sx={{ flex: 1, width: '100%' }}>
                            <Typography
                              component="strong"
                              sx={{
                                display: 'block',
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                fontWeight: 600,
                                color: 'error.main',
                                mb: 0.5,
                              }}
                            >
                              {info.title}
                            </Typography>
                            <Typography
                              sx={{
                                m: 0,
                                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                color: 'text.secondary',
                                lineHeight: 1.5,
                              }}
                            >
                              {info.description}
                            </Typography>
                          </Box>
                        </Box>
                    );
                  })}
                  </Stack>
                </Alert>
              )}

              {reason && (
                <Alert
                  severity="warning"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    borderLeft: (theme) => `4px solid ${theme.palette.warning.main}`,
                    borderRadius: 1,
                    my: 2,
                    '& .MuiAlert-icon': {
                      color: 'warning.main',
                    },
                  }}
                >
                  <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'warning.dark', mb: 0.75 }}>
                    Analysis Result:
                  </AlertTitle>
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.5, m: 0 }}>
                    {reason}
                  </Typography>
                </Alert>
              )}
            </Box>

            <Alert
              severity="success"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                my: 2,
                '& .MuiAlert-icon': {
                  color: 'success.main',
                },
              }}
            >
              <AlertTitle sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 600, color: 'success.dark', mb: 1.5 }}>
                📋 Community Guidelines
              </AlertTitle>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="No nudity or sexually explicit content (NSFW)"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="No hate speech, discrimination, or harassment"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="No graphic violence or disturbing imagery"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="No promotion of self-harm or dangerous activities"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="No illegal activities or weapons"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
              </List>
            </Alert>

            <Alert
              severity="info"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                my: 2,
                '& .MuiAlert-icon': {
                  color: 'info.main',
                },
              }}
            >
              <AlertTitle sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, fontWeight: 600, color: 'info.dark', mb: 1.5 }}>
                💡 What can you do?
              </AlertTitle>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="Review your image and caption to ensure they comply with our guidelines"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="Remove or replace any inappropriate content"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary="Try uploading different content that follows the guidelines"
                    primaryTypographyProps={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' }, color: 'text.secondary', lineHeight: 1.8 }}
                  />
                </ListItem>
              </List>
            </Alert>
          </>
        )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth
        >
          {isServiceUnavailable || isModerationError ? 'Close' : 'Try Different Content'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentModerationError;