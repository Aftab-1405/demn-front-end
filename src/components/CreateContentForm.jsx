import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Alert,
  LinearProgress,
  styled,
  keyframes,
  Fade,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Send as SendIcon,
  Verified as VerifiedIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import Spinner from './Spinner';
import ContentModerationError from './ContentModerationError';

// ==================== ANIMATIONS ====================

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(236, 72, 153, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(236, 72, 153, 0.3);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// ==================== STYLED COMPONENTS ====================

// Main Split-Screen Container
const CreateContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

// Left Panel - Branding & Features
const BrandPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 42%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.info.main} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('md')]: {
    flex: '0 0 auto',
    minHeight: '180px',
    padding: theme.spacing(4, 3),
  },
}));

// Right Panel - Form
const FormPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 58%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    flex: 1,
    padding: theme.spacing(3, 2),
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 900,
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  letterSpacing: '0.05em',
  textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  zIndex: 1,
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(1),
  },
}));

const FormCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  maxWidth: '520px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxWidth: '100%',
  },
}));

const StyledFormCard = styled(Card)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  border: `2px solid ${theme.palette.divider}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg,
      transparent,
      ${alpha(theme.palette.common.white, 0.1)},
      transparent
    )`,
    backgroundSize: '1000px 100%',
    animation: `${shimmer} 3s infinite`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
  },
}));

const StyledIconBox = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.common.white, 0.2),
  borderRadius: theme.spacing(1.5),
  color: theme.palette.common.white,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.common.white,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const StyledMediaPreview = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasMedia' && prop !== 'isDragging',
})(({ theme, hasMedia, isDragging }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: hasMedia ? 'default' : 'pointer',
  minHeight: hasMedia ? 'auto' : '320px',
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  ...(isDragging && {
    borderColor: theme.palette.primary.main,
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.primary.main, 0.1)} 0%,
      ${alpha(theme.palette.secondary.main, 0.1)} 100%
    )`,
    animation: `${pulseGlow} 2s ease-in-out infinite`,
  }),
  '&:hover': !hasMedia && {
    borderColor: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.02),
  },
}));

const StyledImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  objectFit: 'contain',
  display: 'block',
});

const StyledVideo = styled('video')({
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  objectFit: 'contain',
  display: 'block',
});

const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.error.main, 0.9),
  color: theme.palette.common.white,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    transform: 'scale(1.1)',
    boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.5)}`,
  },
}));

const StyledEmptyStateIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})(({ theme, isDragging }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.common.white,
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
  animation: isDragging ? 'none' : `${float} 3s ease-in-out infinite`,
  transition: 'all 0.3s ease',
  '& svg': {
    width: 40,
    height: 40,
  },
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  minWidth: 140,
  height: 48,
  borderRadius: theme.spacing(1.5),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '1rem',
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
  },
}));

const StyledSectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  fontSize: '0.8125rem',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    width: 4,
    height: 16,
    borderRadius: 2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

const StyledContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
}));

const StyledCaptionField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '1rem',
    lineHeight: 1.6,
    minHeight: '120px',
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  background: alpha(theme.palette.background.default, 0.5),
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const StyledFileInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1.5),
  background: theme.palette.background.default,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  flex: 1,
  minWidth: 0,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 1),
  },
}));

// ==================== COMPONENT ====================

const CreateContentForm = ({
  contentType,
  title,
  icon,
  fileInputLabel,
  emptyStateIcon,
  emptyStateText,
  placeholder,
  captionPlaceholder,
  hookResult,
}) => {
  const {
    file,
    fileURL,
    caption,
    loading,
    error,
    isPreProcessing,
    preProcessComplete,
    preProcessFailed,
    preProcessStatus,
    moderationError,
    setCaption,
    handleFileChange,
    handleRemoveMedia,
    handleSubmit,
    fileInputRef,
  } = hookResult;

  const [isDragging, setIsDragging] = useState(false);
  const [showModerationError, setShowModerationError] = useState(false);

  const isPost = contentType === 'post';

  // Show moderation error when it occurs
  useState(() => {
    if (moderationError) {
      setShowModerationError(true);
    }
  }, [moderationError]);

  // ==================== DRAG AND DROP HANDLERS ====================

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (file) return; // Don't allow drop if file already exists

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Create a synthetic event to pass to handleFileChange
      const syntheticEvent = {
        target: {
          files: [droppedFile],
        },
      };
      handleFileChange(syntheticEvent);
    }
  };

  const handleMediaClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <CreateContainer>
      {/* Left Panel - Branding */}
      <BrandPanel>
        <Fade in={true} timeout={600}>
          <Box sx={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <LogoText variant="h2" component="div">
              {isPost ? 'Create Post' : 'Create Reel'}
            </LogoText>

            <Typography
              variant="h6"
              sx={{
                mb: { xs: 2, md: 4 },
                fontWeight: 500,
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Share your story with the world
            </Typography>

            {/* Features - Hide on mobile for cleaner look */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 4 }}>
              <FeatureItem>
                <VerifiedIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  AI-powered fact verification
                </Typography>
              </FeatureItem>
              <FeatureItem>
                <SecurityIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Automatic content moderation
                </Typography>
              </FeatureItem>
              <FeatureItem>
                <SpeedIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Fast processing & optimization
                </Typography>
              </FeatureItem>
              <FeatureItem>
                <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Reach verified community
                </Typography>
              </FeatureItem>
            </Box>
          </Box>
        </Fade>
      </BrandPanel>

      {/* Right Panel - Form */}
      <FormPanel>
        <Fade in={true} timeout={800}>
          <FormCard>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <StyledFormCard>
                {/* Header */}
                <StyledHeader>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                    <StyledIconBox>{icon}</StyledIconBox>
                    <StyledTitle>{title}</StyledTitle>
                  </Stack>
                </StyledHeader>

                {/* Content Area */}
                <StyledContentArea>
                  {/* Media Upload Section */}
                  <Box>
                    <StyledSectionLabel>
                      {isPost ? 'Image' : 'Video'}
                    </StyledSectionLabel>
                    <StyledMediaPreview
                      hasMedia={!!file}
                      isDragging={isDragging}
                      onClick={handleMediaClick}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {file && fileURL ? (
                        <>
                          {isPost ? (
                            <StyledImage src={fileURL} alt="Preview" />
                          ) : (
                            <StyledVideo src={fileURL} controls />
                          )}
                          <StyledRemoveButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMedia();
                            }}
                            size="small"
                            aria-label={`Remove ${contentType}`}
                          >
                            <CloseIcon />
                          </StyledRemoveButton>
                        </>
                      ) : (
                        <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
                          <StyledEmptyStateIcon isDragging={isDragging}>
                            {isDragging ? <CloudUploadIcon sx={{ fontSize: 40 }} /> : emptyStateIcon}
                          </StyledEmptyStateIcon>
                          <Box
                            sx={{
                              textAlign: 'center',
                              color: 'text.secondary',
                              '& strong': {
                                display: 'block',
                                color: 'text.primary',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                mb: 0.5,
                              },
                            }}
                          >
                            {isDragging ? (
                              <strong>Drop your file here!</strong>
                            ) : (
                              emptyStateText
                            )}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.disabled',
                              fontSize: '0.75rem',
                            }}
                          >
                            or click to browse
                          </Typography>
                        </Stack>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={isPost ? "image/*" : "video/*"}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </StyledMediaPreview>
                  </Box>

                  {/* Caption Input */}
                  <Box>
                    <StyledSectionLabel>
                      Caption (Optional)
                    </StyledSectionLabel>
                    <StyledCaptionField
                      id="caption"
                      multiline
                      fullWidth
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder={captionPlaceholder}
                      variant="outlined"
                    />

                    {/* Processing Status */}
                    {isPreProcessing && (
                      <Alert
                        severity="info"
                        icon={<Spinner size="sm" />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          border: 1,
                          borderColor: 'info.main',
                        }}
                      >
                        {preProcessStatus || placeholder}
                        <LinearProgress sx={{ mt: 1.5, borderRadius: 1 }} />
                      </Alert>
                    )}
                    {preProcessComplete && !isPreProcessing && !preProcessFailed && (
                      <Alert
                        severity="success"
                        icon={<CheckIcon />}
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          border: 1,
                          borderColor: 'success.main',
                        }}
                      >
                        {preProcessStatus}
                      </Alert>
                    )}
                  </Box>

                  {/* Error Alert */}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        borderRadius: 2,
                        border: 2,
                        borderColor: 'error.main',
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </StyledContentArea>

                {/* Footer */}
                <StyledFooter>
                  {file && (
                    <StyledFileInfo>
                      {isPost ? (
                        <ImageIcon sx={{ fontSize: 24, color: 'primary.main', flexShrink: 0 }} />
                      ) : (
                        <VideoIcon sx={{ fontSize: 24, color: 'secondary.main', flexShrink: 0 }} />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'text.primary',
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          {formatFileSize(file.size)}
                        </Typography>
                      </Box>
                    </StyledFileInfo>
                  )}

                  <StyledSubmitButton
                    type="submit"
                    disabled={loading || !file || isPreProcessing || preProcessFailed}
                    endIcon={loading ? null : <SendIcon />}
                    aria-label={loading ? 'Publishing...' : `Publish ${isPost ? 'Post' : 'Reel'}`}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <Box component="span" sx={{ ml: 1.5 }}>
                          Publishing...
                        </Box>
                      </>
                    ) : (
                      'Publish'
                    )}
                  </StyledSubmitButton>
                </StyledFooter>
              </StyledFormCard>
            </Box>
          </FormCard>
        </Fade>
      </FormPanel>

      <ContentModerationError
        isOpen={showModerationError}
        onClose={() => {
          setShowModerationError(false);
          setModerationError(null);
        }}
        error={moderationError}
      />
    </CreateContainer>
  );
};

CreateContentForm.propTypes = {
  contentType: PropTypes.oneOf(['post', 'reel']).isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  fileInputLabel: PropTypes.string.isRequired,
  emptyStateIcon: PropTypes.node.isRequired,
  emptyStateText: PropTypes.node.isRequired,
  placeholder: PropTypes.string.isRequired,
  captionPlaceholder: PropTypes.string.isRequired,
  hookResult: PropTypes.object.isRequired,
};

export default CreateContentForm;
