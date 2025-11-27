import React from 'react';
import { Box, Typography, LinearProgress, alpha } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useNotifications } from '../context/NotificationContext';

/**
 * Map backend processing status to color
 */
const getStatusColor = (processing_status) => {
  const statusColors = {
    'pending': 'info',
    'pending_moderation': 'info',
    'moderating': 'primary',
    'extracting_content': 'primary',
    'classifying_nature': 'primary',
    'verifying_facts': 'primary',
    'complete': 'success',
    'rejected': 'error',
    'error': 'error',
  };
  return statusColors[processing_status] || 'primary';
};

/**
 * ProcessingTracker - Real-time progress indicator with MUI LinearProgress
 * Shows current status message and progress bar
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
 * Tracker card with MUI LinearProgress bar
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const TrackerCard = React.memo(({ progress, message, step, processing_status }) => {
  const statusColor = React.useMemo(
    () => getStatusColor(processing_status),
    [processing_status]
  );

  return (
    <Box
      sx={{
        minWidth: 320,
        maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: (theme) => theme.shadows[8],
        border: (theme) => `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease-out',
      }}
    >
      {/* Status Message */}
      <Box sx={{ mb: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.9375rem',
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
            Step {step}
          </Typography>
        )}
      </Box>

      {/* MUI Linear Progress Bar */}
      <Box sx={{ mb: 1.5 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={statusColor}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: (theme) => alpha(theme.palette[statusColor].main, 0.15),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              transition: 'transform 0.5s ease-out, background-color 0.3s ease',
            },
          }}
        />
      </Box>

      {/* Progress Info */}
      <Box
        sx={{
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
            textTransform: 'capitalize',
          }}
        >
          {processing_status ? processing_status.replace(/_/g, ' ') : 'processing'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: `${statusColor}.main`,
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
