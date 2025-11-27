import React from 'react';
import { Box, Tooltip, Typography, keyframes, alpha } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useNotifications } from '../context/NotificationContext';

// Animations
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Map backend processing status to step index and label
 * Backend states: pending, pending_moderation, moderating, extracting_content, classifying_nature, verifying_facts, complete, rejected, error
 */
const getStepInfo = (processing_status, progress) => {
  const statusMap = {
    'pending': { index: 0, label: 'Queued', color: 'info' },
    'pending_moderation': { index: 1, label: 'Waiting', color: 'info' },
    'moderating': { index: 1, label: 'Moderating', color: 'primary' },
    'extracting_content': { index: 2, label: 'Extracting', color: 'primary' },
    'classifying_nature': { index: 3, label: 'Classifying', color: 'primary' },
    'verifying_facts': { index: 4, label: 'Verifying', color: 'primary' },
    'complete': { index: 5, label: 'Complete', color: 'success' },
    'rejected': { index: 1, label: 'Rejected', color: 'error' },
    'error': { index: -1, label: 'Error', color: 'error' },
  };

  // Fallback to progress-based estimation if status not recognized
  if (!statusMap[processing_status]) {
    if (progress < 20) return { index: 0, label: 'Starting', color: 'info' };
    if (progress < 40) return { index: 1, label: 'Moderating', color: 'primary' };
    if (progress < 60) return { index: 2, label: 'Extracting', color: 'primary' };
    if (progress < 80) return { index: 3, label: 'Classifying', color: 'primary' };
    if (progress < 100) return { index: 4, label: 'Verifying', color: 'primary' };
    return { index: 5, label: 'Complete', color: 'success' };
  }

  return statusMap[processing_status];
};

/**
 * ProcessingTracker - Real-time progress indicator with actual backend state
 * Shows current status message and progress
 */
export function ProcessingTracker() {
  const { notifications } = useNotifications();

  // Only show processing notifications
  const processingNotifications = notifications.filter(n => n.type === 'processing');

  // Debug logging
  if (processingNotifications.length > 0) {
    console.log('ProcessingTracker - Showing tracker with notifications:', processingNotifications);
  }

  if (processingNotifications.length === 0) return null;

  return (
    <Snackbar
      open={processingNotifications.length > 0}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {processingNotifications.map(notif => (
          <TrackerCard
            key={notif.id}
            progress={notif.progress || 0}
            message={notif.message || 'Processing...'}
            step={notif.step}
            processing_status={notif.processing_status}
          />
        ))}
      </Box>
    </Snackbar>
  );
}

/**
 * Tracker card with progress steps and status message
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const TrackerCard = React.memo(({ progress, message, step, processing_status }) => {
  // 5 processing steps
  const steps = React.useMemo(() => [
    { id: 1, baseLabel: 'Queue' },
    { id: 2, baseLabel: 'Moderate' },
    { id: 3, baseLabel: 'Extract' },
    { id: 4, baseLabel: 'Classify' },
    { id: 5, baseLabel: 'Verify' }
  ], []);

  const currentStepInfo = React.useMemo(
    () => getStepInfo(processing_status, progress),
    [processing_status, progress]
  );

  return (
    <Box
      sx={{
        minWidth: 320,
        maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: (theme) => theme.shadows[6],
        animation: `${fadeIn} 0.4s ease-out`,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Status Message */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          {message}
        </Typography>
        {step && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            {step}
          </Typography>
        )}
      </Box>

      {/* Step Indicators */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
        }}
      >
        {steps.map((stepDef, index) => {
          const isComplete = currentStepInfo.index > index;
          const isActive = currentStepInfo.index === index;
          const isFailed = currentStepInfo.color === 'error' && currentStepInfo.index === index;

          // Use actual label from backend if on current step, otherwise use base label
          const displayLabel = isActive && currentStepInfo.label
            ? currentStepInfo.label
            : stepDef.baseLabel;

          return (
            <React.Fragment key={stepDef.id}>
              {/* Step circle with tooltip */}
              <Tooltip title={displayLabel} arrow>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease-out',
                    cursor: 'help',
                    zIndex: 2,
                    position: 'relative',
                    flexShrink: 0,
                    ...(isComplete && {
                      bgcolor: 'success.main',
                      color: 'white',
                      border: (theme) => `2px solid ${theme.palette.success.main}`,
                    }),
                    ...(isActive && !isFailed && {
                      bgcolor: 'primary.main',
                      color: 'white',
                      border: (theme) => `2px solid ${theme.palette.primary.main}`,
                      animation: `${pulse} 2s ease-in-out infinite`,
                      boxShadow: (theme) => `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                      '@keyframes pulse': {
                        '0%, 100%': {
                          boxShadow: (theme) => `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                        '50%': {
                          boxShadow: (theme) => `0 0 0 8px ${alpha(theme.palette.primary.main, 0)}`,
                        },
                      },
                    }),
                    ...(isFailed && {
                      bgcolor: 'error.main',
                      color: 'white',
                      border: (theme) => `2px solid ${theme.palette.error.main}`,
                    }),
                    ...(!isComplete && !isActive && {
                      bgcolor: 'background.default',
                      color: 'text.disabled',
                      border: (theme) => `2px solid ${theme.palette.divider}`,
                    }),
                  }}
                >
                  {stepDef.id}
                </Box>
              </Tooltip>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    bgcolor: isComplete ? 'success.main' : 'divider',
                    transition: 'background 0.5s ease-out',
                    zIndex: 1,
                    minWidth: 8,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Progress Percentage */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          {processing_status ? processing_status.replace('_', ' ') : 'processing'}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: currentStepInfo.color === 'error' ? 'error.main' : 'primary.main',
            fontSize: '0.875rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
});

// Display name for debugging
TrackerCard.displayName = 'TrackerCard';

export default ProcessingTracker;
