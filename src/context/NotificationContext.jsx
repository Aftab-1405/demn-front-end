import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Box, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ProcessingSSEClient from '../utils/processingSSE';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [notifications, setNotifications] = useState([]);
  const [sseClients, setSseClients] = useState({});
  const [snackbarQueue, setSnackbarQueue] = useState([]);
  const [currentSnackbar, setCurrentSnackbar] = useState(null);

  /**
   * Show snackbar notification
   */
  const showSnackbar = useCallback((message, severity = 'info', options = {}) => {
    const snackbar = {
      id: Date.now(),
      message,
      severity,
      duration: options.duration || 5000,
      onClick: options.onClick,
      clickable: !!options.onClick,
      ...options
    };
    setSnackbarQueue(prev => [...prev, snackbar]);
  }, []);

  // Process snackbar queue
  useEffect(() => {
    if (snackbarQueue.length > 0 && !currentSnackbar) {
      const nextSnackbar = snackbarQueue[0];
      setCurrentSnackbar(nextSnackbar);
      setSnackbarQueue(prev => prev.slice(1));
    }
  }, [snackbarQueue, currentSnackbar]);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCurrentSnackbar(null);
  }, []);

  /**
   * Add a new notification
   */
  const addNotification = useCallback((notif) => {
    const id = notif.id || notif.postId || notif.reelId || Date.now();

    const notification = {
      id,
      type: notif.type, // 'success' | 'error' | 'processing' | 'info'
      message: notif.message,
      progress: notif.progress || 0,
      persistent: notif.persistent || false, // Don't auto-dismiss if true
      postId: notif.postId,
      reelId: notif.reelId,
      contentType: notif.postId ? 'post' : 'reel',
      timestamp: new Date(),
      action: notif.action // Optional callback function
    };

    setNotifications(prev => {
      // Check if notification already exists
      const existing = prev.find(n => n.id === id);
      if (existing) {
        // Update existing notification
        return prev.map(n => n.id === id ? { ...n, ...notification } : n);
      }
      // Add new notification
      return [...prev, notification];
    });

    // Auto-dismiss non-persistent notifications
    if (!notif.persistent && notif.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notif.duration);
    }

    // If processing notification, start SSE
    if (notif.type === 'processing' && (notif.postId || notif.reelId)) {
      startSSE(notif.postId, notif.reelId);
    }

    return id;
  }, []);

  /**
   * Start SSE for a post/reel
   */
  const startSSE = useCallback((postId, reelId) => {
    const contentType = postId ? 'post' : 'reel';
    const contentId = postId || reelId;
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('[NotificationContext] No auth token found');
      return;
    }

    // Check if SSE already exists for this content
    if (sseClients[contentId]) {
      console.log('[NotificationContext] SSE already exists for', contentType, contentId);
      return;
    }

    console.log('[NotificationContext] Starting SSE for', contentType, contentId);

    const client = new ProcessingSSEClient(contentType, contentId, token);

    // Update on progress
    client.on('update', (data) => {
      console.log('[NotificationContext] SSE Update:', {
        contentId,
        progress: data.progress,
        message: data.message,
        step: data.step,
        status: data.processing_status
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === contentId
            ? {
              ...notif,
              progress: data.progress || notif.progress || 0,
              message: data.message || notif.message,
              step: data.step
            }
            : notif
        )
      );
    });

    // Complete
    client.on('complete', (data) => {
      console.log('[NotificationContext] Processing complete for', contentType, contentId);

      // Remove processing notification from progress bar
      setNotifications(prev =>
        prev.filter(notif => notif.id !== contentId)
      );

      // Show toast notification based on status
      if (data.processing_status === 'complete') {
        const path = contentType === 'post' ? `/fact-check/post/${contentId}` : `/fact-check/reel/${contentId}`;

        // Clean up stored data if this is factual content (not personal)
        // Factual content requires user action in fact-check dashboard
        if (data.verification_status && data.verification_status !== 'not_applicable') {
          const storageKey = `pending_${contentType}_${contentId}`;
          sessionStorage.removeItem(storageKey);
        }

        // Dispatch custom event to trigger feed refresh (only for personal content)
        // Pass contentId and contentType for instant feed updates
        window.dispatchEvent(new CustomEvent('content-processing-complete', {
          detail: {
            contentId: contentId,
            contentType: contentType,
            status: data.processing_status,
            verificationStatus: data.verification_status
          }
        }));

        // Show success snackbar notification
        showSnackbar(
          `Your ${contentType} is ready! Click to view report`,
          'success',
          {
            duration: 8000,
            onClick: () => navigate(path)
          }
        );
      } else if (data.processing_status === 'error') {
        showSnackbar(
          data.message || 'Processing failed. Please try again.',
          'error',
          { duration: 5000 }
        );
      } else if (data.processing_status === 'rejected') {
        showSnackbar(
          data.message || 'Content was rejected during moderation.',
          'warning',
          { duration: 5000 }
        );
      }

      // Cleanup SSE client
      client.disconnect();
      setSseClients(prev => {
        const updated = { ...prev };
        delete updated[contentId];
        return updated;
      });
    });

    // Error
    client.on('error', (error) => {
      console.error('[NotificationContext] SSE error for', contentType, contentId, error);

      setNotifications(prev =>
        prev.filter(notif => notif.id !== contentId)
      );

      addNotification({
        id: `${contentId}-error`,
        type: 'error',
        message: 'Connection lost. Processing continues in background.',
        duration: 5000
      });

      client.disconnect();
      setSseClients(prev => {
        const updated = { ...prev };
        delete updated[contentId];
        return updated;
      });
    });

    // Connect
    client.connect();

    // Store client
    setSseClients(prev => ({ ...prev, [contentId]: client }));
  }, [addNotification, navigate, showSnackbar]);

  /**
   * Remove notification
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));

    // Disconnect SSE if exists
    if (sseClients[id]) {
      sseClients[id].disconnect();
      setSseClients(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  }, [sseClients]);

  /**
   * Update existing notification
   */
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, ...updates } : notif
      )
    );
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[NotificationContext] Cleaning up SSE clients');
      Object.values(sseClients).forEach(client => client.disconnect());
    };
  }, [sseClients]);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    updateNotification,
    showSnackbar
  }), [notifications, addNotification, removeNotification, updateNotification, showSnackbar]);

  // Get optimized icon based on severity and screen size
  const getSnackbarIcon = (severity) => {
    const iconSize = isMobile ? '1.125rem' : isTablet ? '1.1875rem' : '1.25rem';
    switch (severity) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: iconSize }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: iconSize }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: iconSize }} />;
      case 'info':
      default:
        return <InfoIcon sx={{ fontSize: iconSize }} />;
    }
  };

  // Get optimized styles based on severity, context, and screen size
  const getSnackbarStyles = (severity, clickable) => {
    const baseStyles = {
      width: '100%',
      minWidth: isMobile ? 'calc(100vw - 32px)' : isTablet ? '320px' : '280px',
      maxWidth: isMobile ? 'calc(100vw - 32px)' : isTablet ? '420px' : '400px',
      borderRadius: isMobile ? '12px' : '10px',
      boxShadow: isDark
        ? '0 6px 24px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)'
        : '0 6px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      padding: isMobile ? '12px 16px' : '10px 14px',
      fontSize: isMobile ? '0.9375rem' : '0.875rem',
      fontWeight: 500,
      lineHeight: isMobile ? 1.5 : 1.4,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: clickable ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden',
      '&::before': clickable ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
      } : {},
      '&:hover': clickable ? {
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: isDark
          ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
        '&::before': {
          opacity: 1,
        },
      } : {},
      '&:active': clickable ? {
        transform: 'translateY(-1px) scale(1)',
      } : {},
    };

    // Severity-specific enhancements
    const severityStyles = {
      success: {
        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
        '& .MuiAlert-icon': {
          color: theme.palette.success.contrastText,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        },
        '& .MuiAlert-message': {
          color: theme.palette.success.contrastText,
          fontWeight: 500,
        },
      },
      error: {
        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
        '& .MuiAlert-icon': {
          color: theme.palette.error.contrastText,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        },
        '& .MuiAlert-message': {
          color: theme.palette.error.contrastText,
          fontWeight: 500,
        },
      },
      warning: {
        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
        '& .MuiAlert-icon': {
          color: theme.palette.warning.contrastText,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        },
        '& .MuiAlert-message': {
          color: theme.palette.warning.contrastText,
          fontWeight: 500,
        },
      },
      info: {
        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
        '& .MuiAlert-icon': {
          color: theme.palette.info.contrastText,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        },
        '& .MuiAlert-message': {
          color: theme.palette.info.contrastText,
          fontWeight: 500,
        },
      },
    };

    return {
      ...baseStyles,
      ...severityStyles[severity],
    };
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Optimized MUI Snackbar for system notifications */}
      <Snackbar
        open={!!currentSnackbar}
        autoHideDuration={currentSnackbar?.duration || 5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ 
          vertical: 'bottom', 
          horizontal: isMobile ? 'center' : 'right' 
        }}
        sx={{
          '& .MuiSnackbar-root': {
            bottom: { xs: '16px', sm: '20px', md: '24px' },
            right: { xs: 'auto', sm: '20px', md: '24px' },
            left: { xs: '16px', sm: 'auto' },
            width: isMobile ? 'calc(100% - 32px)' : 'auto',
            maxWidth: isMobile ? 'calc(100% - 32px)' : 'none',
          },
        }}
      >
        {currentSnackbar && (
          <Alert
            onClose={handleSnackbarClose}
            severity={currentSnackbar.severity}
            variant="filled"
            onClick={currentSnackbar.clickable ? currentSnackbar.onClick : undefined}
            icon={getSnackbarIcon(currentSnackbar.severity)}
            sx={getSnackbarStyles(currentSnackbar.severity, currentSnackbar.clickable)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
              }}
            >
              <Box
                component="span"
                sx={{
                  flex: 1,
                  wordBreak: 'break-word',
                }}
              >
                {currentSnackbar.message}
              </Box>
              {currentSnackbar.clickable && (
                <Box
                  component="span"
                  sx={{
                    fontSize: isMobile ? '1rem' : '0.875rem',
                    opacity: 0.9,
                    fontWeight: 600,
                    ml: 0.5,
                    flexShrink: 0,
                  }}
                >
                  →
                </Box>
              )}
            </Box>
          </Alert>
        )}
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;