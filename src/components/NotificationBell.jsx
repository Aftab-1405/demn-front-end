// DONE - Refactored with MUI components

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Button,
  styled,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { notificationsAPI, BACKEND_URL, API_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Styled components for custom styling
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    animation: 'pulse 2s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
  },
}));

const NotificationPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '380px',
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: '500px',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[8],
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 32px)',
    },
  },
}));

const NotificationItem = styled(ListItem)(({ theme, unread }) => ({
  backgroundColor: unread ? `${theme.palette.primary.main}08` : 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: unread ? `${theme.palette.primary.main}15` : theme.palette.action.hover,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  cursor: 'pointer',
  transition: 'background-color 200ms',
}));

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  const open = Boolean(anchorEl);

  // Connect to SSE notification stream
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch initial unread count
    fetchUnreadCount();

    // Get JWT token for SSE authentication
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to SSE stream
    const eventSource = new EventSource(`${API_URL}/notifications/stream?token=${token}`);

    eventSource.onopen = () => {
      console.log('[SSE] Connected to notification stream');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle connection message
        if (data.type === 'connected') {
          console.log('[SSE]', data.message);
          return;
        }

        // Handle new notification
        console.log('[SSE] New notification:', data);

        // Update unread count
        setUnreadCount(prev => prev + 1);

        // If popover is open, prepend notification to list
        if (open) {
          setNotifications(prev => [data, ...prev]);
        }

        // Show MUI Snackbar notification
        setCurrentNotification(data);
        setSnackbarOpen(true);
      } catch (error) {
        console.error('[SSE] Error parsing notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[SSE] Connection error:', error);
      // EventSource will automatically reconnect
    };

    // Cleanup on unmount
    return () => {
      console.log('[SSE] Disconnecting from notification stream');
      eventSource.close();
    };
  }, [isAuthenticated]); // Removed showDropdown to prevent reconnecting on dropdown toggle

  // Fetch notifications when popover opens
  useEffect(() => {
    if (open && isAuthenticated) {
      fetchNotifications();
    }
  }, [open, isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications(1, 10);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationText = (notification) => {
    const actor = notification.actor?.username || 'Someone';

    switch (notification.type) {
      case 'follow':
        return `${actor} started following you`;
      case 'like':
        return `${actor} liked your ${notification.post_id ? 'post' : 'reel'}`;
      case 'comment':
        return `${actor} commented: "${notification.comment_text?.substring(0, 30)}${notification.comment_text?.length > 30 ? '...' : ''}"`;
      default:
        return `${actor} interacted with you`;
    }
  };

  const getNotificationSeverity = (type) => {
    switch (type) {
      case 'follow':
        return 'info';
      case 'like':
        return 'error';
      case 'comment':
        return 'success';
      default:
        return 'info';
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getNotificationLink = (notification) => {
    if (notification.type === 'follow') {
      return `/profile/${notification.actor?.username}`;
    }
    // Since individual post/reel pages don't exist, redirect to feed
    // User will see their content in the feed
    if (notification.post_id || notification.reel_id) {
      return `/feed`;
    }
    return '#';
  };

  // Memoized icon renderer using MUI icons
  const getNotificationIcon = useMemo(() => (type) => {
    const iconSize = isMobile ? '1.125rem' : isTablet ? '1.1875rem' : '1.25rem';
    const iconSx = { fontSize: iconSize };
    switch (type) {
      case 'follow':
        return <PersonAddIcon sx={iconSx} />;
      case 'like':
        return <FavoriteIcon sx={iconSx} />;
      case 'comment':
        return <CommentIcon sx={iconSx} />;
      default:
        return <NotificationsIcon sx={iconSx} />;
    }
  }, [isMobile, isTablet]);

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Event handlers
  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    handleClose();
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      <IconButton
        aria-label="notifications"
        onClick={handleOpen}
        sx={{
          position: 'relative',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <StyledBadge
          badgeContent={unreadCount > 99 ? '99+' : unreadCount}
          color="primary"
          invisible={unreadCount === 0}
          max={99}
        >
          <NotificationsIcon />
        </StyledBadge>
      </IconButton>

      <NotificationPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                variant="text"
                size="small"
                onClick={markAllAsRead}
                sx={{ fontSize: '0.875rem' }}
              >
                Mark all read
              </Button>
            )}
          </Box>

          {/* Notification List */}
          <List
            sx={{
              maxHeight: '420px',
              overflowY: 'auto',
              p: 0,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.3)',
                },
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  py: 8,
                }}
              >
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : notifications.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 3,
                }}
              >
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  unread={!notification.is_read}
                  component={Link}
                  to={getNotificationLink(notification)}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ textDecoration: 'none' }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Avatar
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: notification.type === 'follow' ? 'primary.main' :
                                     notification.type === 'like' ? 'error.main' :
                                     'secondary.main',
                            border: '2px solid',
                            borderColor: 'background.paper',
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      }
                    >
                      <Avatar
                        src={
                          notification.actor?.profile_picture
                            ? `${BACKEND_URL}${notification.actor.profile_picture}`
                            : undefined
                        }
                        alt={notification.actor?.username}
                      >
                        {notification.actor?.username?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {getNotificationText(notification)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.created_at)}
                      </Typography>
                    }
                  />

                  {!notification.is_read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                        ml: 1,
                      }}
                    />
                  )}
                </NotificationItem>
              ))
            )}
          </List>
        </Box>
      </NotificationPopover>

      {/* Optimized Snackbar for social notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
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
        {currentNotification && (
          <Alert
            onClose={handleSnackbarClose}
            severity={getNotificationSeverity(currentNotification.type)}
            variant="filled"
            icon={getNotificationIcon(currentNotification.type)}
            sx={{
              width: '100%',
              minWidth: isMobile ? 'calc(100vw - 32px)' : isTablet ? '320px' : '280px',
              maxWidth: isMobile ? 'calc(100vw - 32px)' : isTablet ? '400px' : '380px',
              borderRadius: isMobile ? '12px' : '10px',
              boxShadow: isDark
                ? '0 6px 24px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2)'
                : '0 6px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
              padding: isMobile ? '12px 16px' : '10px 14px',
              fontSize: isMobile ? '0.9375rem' : '0.875rem',
              fontWeight: 500,
              lineHeight: isMobile ? 1.5 : 1.4,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: isDark
                  ? '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)'
                  : '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
                '&::before': {
                  opacity: 1,
                },
              },
              '&:active': {
                transform: 'translateY(-1px) scale(1)',
              },
              // Social notification specific styling
              ...(currentNotification.type === 'follow' && {
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                '& .MuiAlert-icon': {
                  color: theme.palette.info.contrastText,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                },
                '& .MuiAlert-message': {
                  color: theme.palette.info.contrastText,
                },
              }),
              ...(currentNotification.type === 'like' && {
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                '& .MuiAlert-icon': {
                  color: theme.palette.error.contrastText,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                  animation: 'pulse 0.6s ease-in-out',
                },
                '& .MuiAlert-message': {
                  color: theme.palette.error.contrastText,
                },
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.15)',
                  },
                },
              }),
              ...(currentNotification.type === 'comment' && {
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                '& .MuiAlert-icon': {
                  color: theme.palette.success.contrastText,
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                },
                '& .MuiAlert-message': {
                  color: theme.palette.success.contrastText,
                },
              }),
            }}
            onClick={() => {
              const link = getNotificationLink(currentNotification);
              if (link && link !== '#') {
                navigate(link);
              }
              handleSnackbarClose();
            }}
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
                {getNotificationText(currentNotification)}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  opacity: 0.9,
                  fontWeight: 600,
                  ml: 0.5,
                }}
              >
                →
              </Box>
            </Box>
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default NotificationBell;