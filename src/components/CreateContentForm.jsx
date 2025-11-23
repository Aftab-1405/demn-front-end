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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import Spinner from './Spinner';
import ContentModerationError from './ContentModerationError';

// ==================== STYLED COMPONENTS ====================

const StyledPageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  padding: theme.spacing(2),
  background: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledWrapper = styled(Box)({
  maxWidth: 900,
  margin: '0 auto',
  width: '100%',
});

const StyledFormCard = styled(Card)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
}));

const StyledIconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.1),
  borderRadius: theme.spacing(1),
  color: theme.palette.primary.main,
  '& svg': {
    width: 20,
    height: 20,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const StyledMediaPreview = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasMedia' && prop !== 'isDragging',
})(({ theme, hasMedia, isDragging }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.default,
  border: isDragging
    ? `2px solid ${theme.palette.primary.main}`
    : `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.2s',
  ...(hasMedia
    ? {
        aspectRatio: '16 / 9',
        maxHeight: 400,
      }
    : {
        minHeight: 200,
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          background: alpha(theme.palette.primary.main, 0.05),
        },
      }),
  ...(isDragging && {
    borderColor: theme.palette.primary.main,
    background: alpha(theme.palette.primary.main, 0.1),
  }),
}));

const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: 36,
  height: 36,
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
  color: theme.palette.text.primary,
  '&:hover': {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const StyledEmptyStateIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.1),
  borderRadius: '50%',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& svg': {
    width: 32,
    height: 32,
  },
}));

const StyledContentArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2.5),
  },
}));

const StyledCaptionField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.background.default,
    '& textarea': {
      minHeight: 120,
    },
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

const StyledFileInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 1.5),
  background: alpha(theme.palette.primary.main, 0.08),
  borderRadius: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
            <Stack direction="row" spacing={1.5} alignItems="center">
              <StyledIconBox>{icon}</StyledIconBox>
              <StyledTitle>{title}</StyledTitle>
            </Stack>
          </StyledHeader>

          {/* Content Area */}
          <Box component="form" onSubmit={handleSubmit}>
            <StyledContentArea>
              {/* Media Preview */}
              <Box sx={{ order: { xs: 1, md: 1 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  {isPost ? 'Image' : 'Video'}
                </Typography>
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
                        <CloseIcon sx={{ fontSize: 20 }} />
                      </StyledRemoveButton>
                    </>
                  ) : (
                    <Stack spacing={2} alignItems="center" sx={{ p: 3 }}>
                      <StyledEmptyStateIcon>
                        {isDragging ? <CloudUploadIcon /> : emptyStateIcon}
                      </StyledEmptyStateIcon>
                      <Box
                        sx={{
                          textAlign: 'center',
                          color: 'text.secondary',
                          '& strong': {
                            display: 'block',
                            color: 'text.primary',
                            fontWeight: 600,
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
                <Typography
                  component="label"
                  htmlFor="caption"
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    display: 'block',
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Caption (Optional)
                </Typography>
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
                    sx={{ mt: 2 }}
                  >
                    {preProcessStatus || placeholder}
                    <LinearProgress sx={{ mt: 1 }} />
                  </Alert>
                )}
                {preProcessComplete && !isPreProcessing && !preProcessFailed && (
                  <Alert
                    severity="success"
                    icon={<CheckIcon />}
                    sx={{ mt: 2 }}
                  >
                    {preProcessStatus}
                  </Alert>
                )}
              </Box>

              {/* Error Alert */}
              {error && (
                <Box sx={{ gridColumn: { md: '1 / -1' }, order: 3 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
            </StyledContentArea>

            {/* Footer */}
            <StyledFooter>
              {file && (
                <StyledFileInfo>
                  {isPost ? (
                    <ImageIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  ) : (
                    <VideoIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </StyledFileInfo>
              )}

              <IconButton
                type="submit"
                color="primary"
                disabled={loading || !file || isPreProcessing || preProcessFailed}
                sx={{
                  ml: 'auto',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
                aria-label={loading ? 'Publishing...' : `Publish ${isPost ? 'Post' : 'Reel'}`}
              >
                {loading ? <Spinner size="sm" color="white" /> : <CheckIcon />}
              </IconButton>
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
