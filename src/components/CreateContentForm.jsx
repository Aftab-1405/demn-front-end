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
  background: theme.palette.background.default,
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const StyledSidePanel = styled(Box)(({ theme }) => ({
  flex: '0 0 50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    flex: '0 0 auto',
    minHeight: '400px',
    padding: theme.spacing(3),
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledRightPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 50%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  background: theme.palette.background.default,
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    flex: 1,
    padding: theme.spacing(3),
  },
}));


const StyledMediaPreview = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasMedia' && prop !== 'isDragging',
})(({ theme, hasMedia, isDragging }) => ({
  width: '100%',
  maxWidth: 600,
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
        maxHeight: 500,
        border: `2px solid ${theme.palette.divider}`,
      }
    : {
        minHeight: 400,
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

const StyledPublishButton = styled(IconButton)(({ theme }) => ({
  width: 56,
  height: 56,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
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
      {/* Left Panel - Media Upload */}
      <StyledSidePanel>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your {isPost ? 'image' : 'video'}
            </Typography>
          </Box>

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
      </StyledSidePanel>

      {/* Right Panel - Form Controls */}
      <StyledRightPanel>
        <Box component="form" onSubmit={handleSubmit} sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header with icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: 'common.white',
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fill in the details below
              </Typography>
            </Box>
          </Box>

          {/* Caption Field */}
          <Box sx={{ flex: 1 }}>
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
          </Box>

          {/* Quick Tips */}
          <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1.5, display: 'block' }}>
              Quick Tips
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <CheckIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.2 }} />
                <Typography variant="body2" color="text.secondary">
                  {isPost ? 'Max 20MB image size' : 'Max 100MB video size'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <CheckIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.2 }} />
                <Typography variant="body2" color="text.secondary">
                  AI-powered content moderation
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <CheckIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.2 }} />
                <Typography variant="body2" color="text.secondary">
                  Automatic fact verification
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* File Info Display */}
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

          {/* Processing Status / Analysis Modal */}
          {isPreProcessing && (
            <Alert
              severity="info"
              icon={<Spinner size="sm" />}
              sx={{
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
                borderRadius: 2,
                border: 1,
                borderColor: 'success.main',
              }}
            >
              {preProcessStatus}
            </Alert>
          )}

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

          {/* Publish Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <StyledPublishButton
              type="submit"
              disabled={loading || !file || isPreProcessing || preProcessFailed}
              aria-label={loading ? 'Publishing...' : `Publish ${isPost ? 'Post' : 'Reel'}`}
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <SendIcon />
              )}
            </StyledPublishButton>
          </Box>
        </Box>
      </StyledRightPanel>

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
