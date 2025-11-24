import { useState, useMemo } from 'react';
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
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Link as LinkIcon,
  FormatQuote as FormatQuoteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  MenuBook as BookIcon, // Warm/Sepia icon
  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon,
  Verified as VerifiedIcon,
  WarningAmber as WarningIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

const FactCheckModal = ({ isOpen, onClose, factCheck, item, renderVerificationBadge }) => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Reader States
  const [readerTheme, setReaderTheme] = useState('light'); // 'light', 'dark', 'warm'
  const [fontLevel, setFontLevel] = useState(1); // 0: Small, 1: Normal, 2: Large, 3: Huge

  // 1. Font Scale Engine
  const fontConfig = useMemo(() => {
    const scales = [
      { body: '0.9375rem', h3: '1.25rem', height: 1.6 },   // Level 0 (Compact)
      { body: '1.0625rem', h3: '1.5rem', height: 1.7 },    // Level 1 (Default - Optimized for reading)
      { body: '1.25rem', h3: '1.75rem', height: 1.8 },     // Level 2 (Large)
      { body: '1.4rem', h3: '2rem', height: 1.9 },         // Level 3 (Accessibility+)
    ];
    return scales[fontLevel];
  }, [fontLevel]);

  // 2. Reader Theme Engine (Optimized for Contrast)
  const currentTheme = useMemo(() => {
    const themes = {
      light: {
        bg: '#FFFFFF',
        paper: '#F8F9FA',
        text: '#212121', // High contrast grey
        textSecondary: '#5f6368',
        accent: '#8B5CF6', // Primary Purple
        border: '#E0E0E0',
        quoteBg: alpha('#8B5CF6', 0.04),
        fontFamily: '"Georgia", "Times New Roman", serif',
      },
      dark: {
        bg: '#121212',
        paper: '#1E1E1E',
        text: '#E4E6EB',
        textSecondary: '#B0B3B8',
        accent: '#A78BFA',
        border: '#2D2D2D',
        quoteBg: alpha('#A78BFA', 0.08),
        fontFamily: '"Georgia", "Times New Roman", serif',
      },
      warm: { // Sepia / Eye-Care Mode
        bg: '#FBF0D9', // Classic Sepia background
        paper: '#F5E6C8', // Darker Sepia
        text: '#433422', // Dark Brown text (easier on eyes than black)
        textSecondary: '#6F5B3E',
        accent: '#A0522D', // Sienna
        border: alpha('#433422', 0.1),
        quoteBg: alpha('#A0522D', 0.06),
        fontFamily: '"Merriweather", "Georgia", serif',
      },
    };
    return themes[readerTheme];
  }, [readerTheme]);

  // Handlers
  const handleFontChange = (delta) => {
    setFontLevel((prev) => Math.min(Math.max(prev + delta, 0), 3));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md" // Constrain width for optimal line length (60-75 chars)
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        elevation: 0,
        sx: {
          bgcolor: currentTheme.bg,
          color: currentTheme.text,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          backgroundImage: 'none',
        },
      }}
      sx={{
        backdropFilter: 'blur(8px)', // Modern glassmorphism backdrop
        '& .MuiBackdrop-root': {
          bgcolor: readerTheme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)',
        },
      }}
    >
      {/* --- READER HEADER (Controls) --- */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${currentTheme.border}`,
          bgcolor: currentTheme.bg,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AIIcon sx={{ color: currentTheme.accent }} />
            Fact-Check Report
          </Typography>
        </Box>

        {/* Reader Controls Toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: currentTheme.paper,
            p: 0.5,
            borderRadius: '50px',
            border: `1px solid ${currentTheme.border}`
          }}
        >
          {/* Font Controls */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, borderRight: `1px solid ${currentTheme.border}`, pr: 1, mr: 1 }}>
            <Tooltip title="Decrease Text Size">
              <IconButton size="small" onClick={() => handleFontChange(-1)} disabled={fontLevel === 0}>
                <TextDecreaseIcon fontSize="small" sx={{ color: currentTheme.textSecondary }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Increase Text Size">
              <IconButton size="small" onClick={() => handleFontChange(1)} disabled={fontLevel === 3}>
                <TextIncreaseIcon fontSize="small" sx={{ color: currentTheme.textSecondary }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Theme Controls */}
          <Tooltip title="Light Mode">
            <IconButton size="small" onClick={() => setReaderTheme('light')}>
              <LightModeIcon fontSize="small" sx={{ color: readerTheme === 'light' ? '#FDB813' : currentTheme.textSecondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sepia Mode (Reading)">
            <IconButton size="small" onClick={() => setReaderTheme('warm')}>
              <BookIcon fontSize="small" sx={{ color: readerTheme === 'warm' ? '#8D6E63' : currentTheme.textSecondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dark Mode">
            <IconButton size="small" onClick={() => setReaderTheme('dark')}>
              <DarkModeIcon fontSize="small" sx={{ color: readerTheme === 'dark' ? '#90CAF9' : currentTheme.textSecondary }} />
            </IconButton>
          </Tooltip>

          {/* Close */}
          <Box sx={{ width: 1, height: 24, bgcolor: currentTheme.border, mx: 0.5 }} />
          <IconButton size="small" onClick={onClose} sx={{ color: currentTheme.text }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* --- READER CONTENT --- */}
      <DialogContent sx={{ p: 0 }}>
        {factCheck ? (
          <Box
            sx={{
              maxWidth: '720px', // Optimal reading width
              mx: 'auto',
              px: { xs: 3, md: 0 },
              py: 5,
            }}
          >
            {/* 1. Verdict Banner */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', mb: 2 }}>
                {renderVerificationBadge(factCheck.overall_status || 'unverified')}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: currentTheme.textSecondary,
                  mt: 2,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Verified on {new Date(factCheck.verified_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>

            {/* 2. Verification Results Loop */}
            {factCheck.verification_results?.map((result, idx) => {
              const isMismatch = !result.verification; // Context mismatch vs fact check

              return (
                <Box key={idx} component="article" sx={{ mb: 8 }}>

                  {/* The Claim Section */}
                  <Box sx={{ mb: 4, position: 'relative' }}>
                    <FormatQuoteIcon
                      sx={{
                        fontSize: 40,
                        color: currentTheme.accent,
                        opacity: 0.2,
                        position: 'absolute',
                        left: -20,
                        top: -15
                      }}
                    />
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: fontConfig.h3,
                        fontWeight: 700,
                        color: currentTheme.text,
                        lineHeight: 1.3,
                        mb: 1,
                        fontFamily: currentTheme.fontFamily,
                      }}
                    >
                      {isMismatch ? "Context Mismatch Detected" : `Claim: ${result.claim?.claim}`}
                    </Typography>

                    {/* Metadata Tags */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {!isMismatch && (
                        <Chip
                          label={result.claim?.type?.toUpperCase() || 'CLAIM'}
                          size="small"
                          sx={{
                            bgcolor: alpha(currentTheme.accent, 0.1),
                            color: currentTheme.accent,
                            fontWeight: 700,
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                      {result.severity && (
                        <Chip
                          label={`RISK: ${result.severity.toUpperCase()}`}
                          size="small"
                          color={result.severity === 'high' ? 'error' : 'warning'}
                          variant={readerTheme === 'dark' ? 'outlined' : 'filled'}
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* The Analysis Body */}
                  <Box
                    sx={{
                      pl: { xs: 0, md: 3 },
                      borderLeft: { xs: 'none', md: `3px solid ${isMismatch ? muiTheme.palette.error.main : muiTheme.palette.success.main}` }
                    }}
                  >
                    {/* Verdict / Key Finding */}
                    <Box
                      sx={{
                        bgcolor: currentTheme.paper,
                        p: 3,
                        borderRadius: 2,
                        mb: 3,
                        border: `1px solid ${currentTheme.border}`
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: isMismatch ? muiTheme.palette.error.main : muiTheme.palette.success.main,
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          mb: 1,
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {isMismatch ? "The Issue" : "The Facts"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: fontConfig.body,
                          fontWeight: 600,
                          color: currentTheme.text,
                          lineHeight: fontConfig.height,
                          fontFamily: currentTheme.fontFamily
                        }}
                      >
                        {isMismatch
                          ? result.explanation
                          : result.verification?.verified_info || result.verification?.explanation}
                      </Typography>
                    </Box>

                    {/* Deep Dive Explanation */}
                    {!isMismatch && result.verification?.explanation && (
                      <Typography
                        sx={{
                          fontSize: fontConfig.body,
                          color: currentTheme.text,
                          lineHeight: fontConfig.height,
                          mb: 3,
                          opacity: 0.9,
                          fontFamily: currentTheme.fontFamily
                        }}
                      >
                        {result.verification.explanation}
                      </Typography>
                    )}

                    {/* Sources / Footnotes */}
                    {!isMismatch && result.verification?.sources?.length > 0 && (
                      <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${currentTheme.border}` }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: currentTheme.textSecondary,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            mb: 1.5,
                            display: 'block'
                          }}
                        >
                          Supported Sources
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {result.verification.sources.map((source, sIdx) => (
                            <Link
                              key={sIdx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="none"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '4px',
                                bgcolor: alpha(currentTheme.accent, 0.08),
                                color: currentTheme.accent,
                                fontSize: '0.8rem',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                border: `1px solid ${alpha(currentTheme.accent, 0.2)}`,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: alpha(currentTheme.accent, 0.15),
                                  transform: 'translateY(-1px)'
                                }
                              }}
                            >
                              <LinkIcon sx={{ fontSize: 14 }} />
                              {source.name}
                            </Link>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {idx < factCheck.verification_results.length - 1 && (
                    <Divider sx={{ mt: 6, borderColor: currentTheme.border }} />
                  )}
                </Box>
              );
            })}
          </Box>
        ) : (
          /* Loading / Empty State */
          <Box sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: currentTheme.textSecondary }}>Loading verification data...</Typography>
          </Box>
        )}
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