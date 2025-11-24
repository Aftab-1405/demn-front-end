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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Send as SendIcon,
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

const StyledPageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  padding: theme.spacing(3),
  background: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledWrapper = styled(Box)({
  maxWidth: 1000,
  margin: '0 auto',
  width: '100%',
});

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
  ...(hasMedia
    ? {
        aspectRatio: '16 / 9',
        maxHeight: 450,
        border: `2px solid ${theme.palette.divider}`,
      }
    : {
        minHeight: 280,
        cursor: 'pointer',
        border: isDragging
          ? `3px solid ${theme.palette.primary.main}`
          : `3px dashed ${theme.palette.divider}`,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.05)} 0%,
            ${alpha(theme.palette.secondary.main, 0.05)} 100%
          )`,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }),
  ...(isDragging && {
    borderColor: theme.palette.primary.main,
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.primary.main, 0.1)} 0%,
      ${alpha(theme.palette.secondary.main, 0.1)} 100%
    )`,
    animation: `${pulseGlow} 2s ease-in-out infinite`,
  }),
}));

const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  width: 40,
  height: 40,
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    transform: 'scale(1.1) rotate(90deg)',
    boxShadow: '0 6px 16px rgba(244, 63, 94, 0.3)',
  },
}));

const StyledEmptyStateIcon = styled(Box)(({ theme, isDragging }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: '50%',
  color: theme.palette.common.white,
  marginBottom: theme.spacing(2),
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
  animation: isDragging ? `${float} 2s ease-in-out infinite` : 'none',
  transition: 'transform 0.3s ease',
}));

const StyledContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
}));

const StyledCaptionField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '& textarea': {
      minHeight: 140,
    },
    '&:hover': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderTop: `2px solid ${theme.palette.divider}`,
  background: alpha(theme.palette.background.default, 0.6),
  backdropFilter: 'blur(10px)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledFileInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 1.75),
  background: `linear-gradient(135deg,
    ${alpha(theme.palette.primary.main, 0.08)} 0%,
    ${alpha(theme.palette.secondary.main, 0.08)} 100%
  )`,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  flex: 1,
  minWidth: 0,
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
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 120,
    height: 44,
    fontSize: '0.9375rem',
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

// ==================== UTILITY FUNCTIONS ====================

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// ==================== MAIN COMPONENT ====================

const CreateContentForm = ({
  contentType,
  title,
  icon,
  fileInputLabel,
  emptyStateIcon,
  emptyStateText,
  placeholder,
  captionPlaceholder,
  hookResult
}) => {
  const {
    file,
    caption,
    setCaption,
    preview,
    loading,
    error,
    isPreProcessing,
    preProcessComplete,
    preProcessStatus,
    preProcessFailed,
    moderationError,
    showModerationError,
    setShowModerationError,
    setModerationError,
    fileInputRef,
    handleFileChange,
    handleRemoveMedia,
    handleSubmit,
  } = hookResult;

  const [isDragging, setIsDragging] = useState(false);
  const isPost = contentType === 'post';

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const event = {
        target: {
          files: droppedFiles
        }
      };
      handleFileChange(event);
    }
  };

  return (
    <StyledPageContainer>
      <StyledWrapper>
        <StyledFormCard>
          {/* Header */}
          <StyledHeader>
            <Stack direction="row" spacing={2} alignItems="center">
              <StyledIconBox>{icon}</StyledIconBox>
              <StyledTitle>{title}</StyledTitle>
            </Stack>
          </StyledHeader>

          {/* Content Area */}
          <Box component="form" onSubmit={handleSubmit}>
            <StyledContentArea>
              {/* Media Preview */}
              <Box sx={{ order: { xs: 1, md: 1 } }}>
                <StyledSectionLabel>
                  {isPost ? 'Image' : 'Video'}
                </StyledSectionLabel>
                <StyledMediaPreview
                  hasMedia={!!preview}
                  isDragging={isDragging}
                  onClick={() => !preview && fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  role={!preview ? "button" : undefined}
                  tabIndex={!preview ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (!preview && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label={`Upload ${contentType} preview area`}
                >
                  {preview ? (
                    <>
                      {isPost ? (
                        <Box
                          component="img"
                          src={preview}
                          alt="Preview"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Box
                          component="video"
                          src={preview}
                          controls
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      )}
                      <StyledRemoveButton
                        type="button"
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
              <Box sx={{ order: { xs: 2, md: 2 } }}>
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
                <Box sx={{ gridColumn: { md: '1 / -1' }, order: 3 }}>
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
                </Box>
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
          </Box>
        </StyledFormCard>
      </StyledWrapper>

      <ContentModerationError
        isOpen={showModerationError}
        onClose={() => {
          setShowModerationError(false);
          setModerationError(null);
        }}
        error={moderationError}
      />
    </StyledPageContainer>
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
