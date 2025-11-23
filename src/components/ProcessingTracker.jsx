import React from 'react';
import { Box, Tooltip, keyframes, alpha } from '@mui/material';
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
  }
  to {
    opacity: 1;
  }
`;

/**
 * ProcessingTracker - Ultra-minimal thin line progress indicator
 * Vertical on desktop, horizontal on mobile
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
          gap: 1,
        }}
      >
        {processingNotifications.map(notif => (
          <TrackerCard
            key={notif.id}
            progress={notif.progress}
          />
        ))}
      </Box>
    </Snackbar>
  );
}

/**
 * Ultra-minimal tracker card - just circles and line
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const TrackerCard = React.memo(({ progress }) => {
  // 5 simple steps
  const steps = React.useMemo(() => [
    { id: 1, label: 'Moderating', threshold: 20 },
    { id: 2, label: 'Extracting', threshold: 40 },
    { id: 3, label: 'Classifying', threshold: 60 },
    { id: 4, label: 'Verifying', threshold: 80 },
    { id: 5, label: 'Finalizing', threshold: 100 }
  ], []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1.5,
        pointerEvents: 'auto',
        animation: `${fadeIn} 0.3s ease-out`,
      }}
    >
      {/* Thin progress line with steps */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {steps.map((step, index) => {
          const isComplete = progress >= step.threshold;
          const isActive = !isComplete && (index === 0 || progress >= steps[index - 1].threshold);

          return (
            <React.Fragment key={step.id}>
              {/* Step circle with tooltip on hover */}
              <Tooltip title={step.label} arrow>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
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
                    ...(isComplete && {
                      bgcolor: 'info.main',
                      color: 'white',
                      border: (theme) => `2px solid ${theme.palette.info.main}`,
                    }),
                    ...(isActive && {
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
                    ...(!isComplete && !isActive && {
                      bgcolor: 'background.default',
                      color: 'text.disabled',
                      border: (theme) => `2px solid ${theme.palette.divider}`,
                    }),
                  }}
                >
                  {step.id}
                </Box>
              </Tooltip>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 24,
                    height: 2,
                    bgcolor: isComplete ? 'info.main' : 'divider',
                    transition: 'background 0.5s ease-out',
                    zIndex: 1,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Small percentage indicator */}
      <Box
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: 'text.secondary',
          ml: 1,
          py: 0.5,
          px: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {progress}%
      </Box>
    </Box>
  );
});

// Display name for debugging
TrackerCard.displayName = 'TrackerCard';

export default ProcessingTracker;
