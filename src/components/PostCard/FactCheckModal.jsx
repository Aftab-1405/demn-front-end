import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Link,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Link as LinkIcon,
  FormatQuote as FormatQuoteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const FactCheckModal = ({ isOpen, onClose, factCheck, item, renderVerificationBadge }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [readerTheme, setReaderTheme] = useState('light'); // 'light', 'dark', 'warm'

  // Reader theme configurations
  const getReaderTheme = (themeName) => {
    const themes = {
      light: {
        bg: '#FFFFFF',
        paper: alpha('#000000', 0.02),
        text: '#1A1A1A',
        textSecondary: '#666666',
        border: alpha('#000000', 0.12),
        accent: '#1976d2',
      },
      dark: {
        bg: '#1A1A1A',
        paper: alpha('#FFFFFF', 0.05),
        text: '#E8E8E8',
        textSecondary: '#A0A0A0',
        border: alpha('#FFFFFF', 0.12),
        accent: '#64B5F6',
      },
      warm: {
        bg: '#F4F1EA',
        paper: '#FBF8F1',
        text: '#3E2723',
        textSecondary: '#6D4C41',
        border: alpha('#3E2723', 0.15),
        accent: '#8D6E63',
      },
    };
    return themes[themeName] || themes.light;
  };

  const currentTheme = getReaderTheme(readerTheme);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: currentTheme.bg,
          color: currentTheme.text,
          transition: 'all 0.3s ease',
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          bgcolor: readerTheme === 'dark' 
            ? 'rgba(0, 0, 0, 0.8)' 
            : readerTheme === 'warm'
            ? 'rgba(62, 39, 35, 0.4)'
            : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="Close dialog"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: currentTheme.text,
          opacity: 0.7,
          zIndex: 1,
          '&:hover': {
            opacity: 1,
            bgcolor: alpha(currentTheme.text, 0.1),
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Title with Theme Switcher */}
      <DialogTitle
        sx={{
          pt: 2.5,
          pr: 6,
          pb: 2,
          borderBottom: `1px solid ${currentTheme.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: currentTheme.text }}>
            Fact-Check Details
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setReaderTheme('light')}
              sx={{
                bgcolor: readerTheme === 'light' ? alpha(currentTheme.accent, 0.15) : 'transparent',
                border: 1,
                borderColor: readerTheme === 'light' ? currentTheme.accent : currentTheme.border,
                color: currentTheme.text,
                '&:hover': { 
                  bgcolor: alpha(currentTheme.accent, 0.1),
                },
              }}
              title="Light Theme"
            >
              <LightModeIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setReaderTheme('dark')}
              sx={{
                bgcolor: readerTheme === 'dark' ? alpha(currentTheme.accent, 0.15) : 'transparent',
                border: 1,
                borderColor: readerTheme === 'dark' ? currentTheme.accent : currentTheme.border,
                color: currentTheme.text,
                '&:hover': { 
                  bgcolor: alpha(currentTheme.accent, 0.1),
                },
              }}
              title="Dark Theme"
            >
              <DarkModeIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setReaderTheme('warm')}
              sx={{
                bgcolor: readerTheme === 'warm' ? alpha(currentTheme.accent, 0.15) : 'transparent',
                border: 1,
                borderColor: readerTheme === 'warm' ? currentTheme.accent : currentTheme.border,
                '&:hover': { 
                  bgcolor: alpha(currentTheme.accent, 0.1),
                },
              }}
              title="Warm Theme"
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: '#F4F1EA',
                  border: '2px solid #8D6E63',
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '960px' },
            mx: 'auto',
            color: currentTheme.text,
          }}
        >
          {factCheck && (
            <Box
              sx={{
                maxHeight: { xs: '60vh', sm: '65vh' },
                overflowY: 'auto',
                px: { xs: 0, sm: 1 },
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: currentTheme.border,
                  borderRadius: '4px',
                  '&:hover': {
                    bgcolor: currentTheme.textSecondary,
                  },
                },
              }}
            >
              {/* Claims Detected */}
              {factCheck.claims_detected && factCheck.claims_detected.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: { xs: '1.125rem', sm: '1.25rem' },
                      fontWeight: 700, 
                      color: currentTheme.text, 
                      mb: 3,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Claims Detected
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(350px, 1fr))' }, 
                      gap: 2.5 
                    }}
                  >
                    {factCheck.claims_detected.map((claim, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: currentTheme.paper,
                          p: { xs: 2, sm: 3 },
                          borderRadius: 2,
                          border: `1px solid ${currentTheme.border}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: currentTheme.accent,
                            boxShadow: `0 4px 12px ${alpha(currentTheme.text, 0.08)}`,
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative', pl: 4 }}>
                          <FormatQuoteIcon 
                            sx={{ 
                              position: 'absolute', 
                              left: -8, 
                              top: -8, 
                              fontSize: 32, 
                              color: alpha(currentTheme.accent, 0.3),
                              transform: 'rotate(180deg)'
                            }} 
                          />
                          <Typography
                            sx={{
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                              fontFamily: '"Georgia", "Times New Roman", serif',
                              fontStyle: 'italic',
                              color: currentTheme.text,
                              mb: 2,
                              lineHeight: 1.6,
                            }}
                          >
                            {claim.claim}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2, pl: 4 }}>
                          <Chip
                            label={`Type: ${claim.type}`}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: alpha(currentTheme.accent, 0.15),
                              color: currentTheme.accent,
                            }}
                          />
                          <Chip
                            label={`Importance: ${claim.importance}`}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: alpha(currentTheme.textSecondary, 0.15),
                              color: currentTheme.textSecondary,
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Verification Results */}
              {factCheck.verification_results && factCheck.verification_results.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: { xs: '1.125rem', sm: '1.25rem' },
                      fontWeight: 700, 
                      color: currentTheme.text, 
                      mb: 3,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Verification Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {factCheck.verification_results.map((result, idx) => {
                      const isContextMismatch = result.issue && !result.verification;

                      if (isContextMismatch) {
                        // Context Mismatch Case
                        return (
                          <Box
                            key={idx}
                            sx={{
                              bgcolor: alpha('#EF5350', 0.08),
                              p: { xs: 2.5, sm: 3 },
                              borderRadius: 2.5,
                              border: `2px solid ${alpha('#EF5350', 0.3)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: alpha('#EF5350', 0.5),
                                boxShadow: `0 4px 16px ${alpha('#EF5350', 0.15)}`,
                              },
                            }}
                          >
                            <Box sx={{ mb: 2.5 }}>
                              <Chip
                                label="Content Flagged"
                                size="medium"
                                icon={<WarningIcon sx={{ fontSize: 18 }} />}
                                color="error"
                                sx={{
                                  height: 32,
                                  fontSize: '0.875rem',
                                  fontWeight: 700,
                                  px: 1,
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                              <Box>
                                <Typography 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                    fontWeight: 700, 
                                    color: currentTheme.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    mb: 1,
                                  }}
                                >
                                  Issue
                                </Typography>
                                <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, lineHeight: 1.8, color: currentTheme.text }}>
                                  {result.issue || 'Content-Caption Mismatch'}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                    fontWeight: 700, 
                                    color: currentTheme.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    mb: 1,
                                  }}
                                >
                                  Issue Type
                                </Typography>
                                <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, lineHeight: 1.8, color: currentTheme.text }}>
                                  {result.mismatch_type || 'Content-Caption Mismatch'}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                    fontWeight: 700, 
                                    color: currentTheme.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    mb: 1,
                                  }}
                                >
                                  Explanation
                                </Typography>
                                <Typography sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, lineHeight: 1.8, color: currentTheme.text }}>
                                  {result.explanation || "Caption doesn't match the actual content in the media."}
                                </Typography>
                              </Box>
                              {result.severity && (
                                <Box>
                                  <Typography 
                                    component="h4" 
                                    sx={{ 
                                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                      fontWeight: 700, 
                                      color: currentTheme.textSecondary,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                      mb: 1,
                                    }}
                                  >
                                    Risk Level
                                  </Typography>
                                  <Chip
                                    label={result.severity.toUpperCase()}
                                    size="medium"
                                    sx={{
                                      height: 32,
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      bgcolor: alpha(result.severity === 'high' ? '#EF5350' : '#FF9800', 0.2),
                                      color: result.severity === 'high' ? '#EF5350' : '#FF9800',
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      } else {
                        // Normal Verification Case
                        return (
                          <Box
                            key={idx}
                            sx={{
                              bgcolor: currentTheme.paper,
                              p: { xs: 2.5, sm: 3 },
                              borderRadius: 2.5,
                              border: `1px solid ${currentTheme.border}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: currentTheme.accent,
                                boxShadow: `0 4px 16px ${alpha(currentTheme.text, 0.08)}`,
                              },
                            }}
                          >
                            <Box sx={{ mb: 3 }}>
                              {renderVerificationBadge(result.verification?.status || 'unverified')}
                            </Box>
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '4fr 6fr' }, gap: { xs: 3, md: 5 } }}>
                              {/* Left Column */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                  <Typography 
                                    component="h4" 
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      fontWeight: 700, 
                                      color: currentTheme.textSecondary,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.1em',
                                      mb: 1,
                                    }}
                                  >
                                    Claim
                                  </Typography>
                                  <Typography sx={{ fontSize: '1.125rem', lineHeight: 1.6, color: currentTheme.text, fontFamily: '"Georgia", "Times New Roman", serif' }}>
                                    {result.claim?.claim || 'N/A'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography 
                                    component="h4" 
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      fontWeight: 700, 
                                      color: currentTheme.textSecondary,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.1em',
                                      mb: 1,
                                    }}
                                  >
                                    Verified Fact
                                  </Typography>
                                  <Box 
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: alpha(currentTheme.accent, 0.1), 
                                      borderRadius: 1,
                                      borderLeft: `4px solid ${currentTheme.accent}`
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.6, color: currentTheme.text, fontWeight: 500 }}>
                                      {result.verification?.verified_info || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Right Column */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                  <Typography 
                                    component="h4" 
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      fontWeight: 700, 
                                      color: currentTheme.textSecondary,
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.1em',
                                      mb: 1,
                                    }}
                                  >
                                    Explanation
                                  </Typography>
                                  <Typography sx={{ fontSize: '1rem', lineHeight: 1.7, color: currentTheme.text, fontFamily: '"Georgia", "Times New Roman", serif' }}>
                                    {result.verification?.explanation || 'N/A'}
                                  </Typography>
                                </Box>

                                {/* Sources */}
                                {result.verification?.sources && result.verification.sources.length > 0 && (
                                  <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${currentTheme.border}` }}>
                                    <Typography
                                      component="h4"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: currentTheme.textSecondary,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        mb: 1.5,
                                      }}
                                    >
                                      <LinkIcon sx={{ fontSize: 16, color: currentTheme.textSecondary }} />
                                      Sources
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                      {result.verification.sources.map((source, sidx) => (
                                        <Link
                                          key={sidx}
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            px: 1.5,
                                            py: 0.75,
                                            borderRadius: 1,
                                            bgcolor: alpha(currentTheme.accent, 0.15),
                                            fontSize: '0.8125rem',
                                            fontWeight: 500,
                                            color: currentTheme.accent,
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                              bgcolor: alpha(currentTheme.accent, 0.25),
                                            }
                                          }}
                                        >
                                          {source.name}
                                          <Box component="span" sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'currentColor', mx: 0.5 }} />
                                          <Typography component="span" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                            {source.reliability}
                                          </Typography>
                                        </Link>
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        );
                      }
                    })}
                  </Box>
                </Box>
              )}

              {/* Footer */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: `2px solid ${currentTheme.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: currentTheme.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  Last verified: {new Date(factCheck.verified_at).toLocaleString()}
                </Typography>
                {item.is_edited && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<EditIcon sx={{ fontSize: 16 }} />}
                      label="AI-corrected for accuracy"
                      size="medium"
                      sx={{
                        height: 32,
                        py: 0.75,
                        px: 1.5,
                        bgcolor: alpha(currentTheme.accent, 0.15),
                        color: currentTheme.accent,
                        borderRadius: 2,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: currentTheme.accent,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

FactCheckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  factCheck: PropTypes.object,
  item: PropTypes.object.isRequired,
  renderVerificationBadge: PropTypes.func.isRequired,
};

export default FactCheckModal;
