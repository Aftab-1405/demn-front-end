import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Stack,
  alpha,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 *
 * Features:
 * - Prevents entire app from crashing due to component errors
 * - Displays user-friendly fallback UI
 * - Logs error details to console for debugging
 * - Provides recovery options (reload, go home)
 * - Can be nested for granular error handling
 *
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Update state with error details
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Optional: Send error to error reporting service
    // Example: logErrorToService(error, errorInfo);

    // You can also log to backend for monitoring
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // sendErrorToMonitoring({ error, errorInfo, componentStack: errorInfo.componentStack });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback, showDetails } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error, errorInfo, reset: this.handleReset })
          : fallback;
      }

      // Default fallback UI
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.error.dark, 0.1)
                  : alpha(theme.palette.error.light, 0.1),
              border: (theme) => `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                }}
              >
                <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />
              </Box>
            </Box>

            <Typography variant="h4" fontWeight={700} color="error.main" gutterBottom>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              {errorCount > 1
                ? 'This error keeps occurring. Please try refreshing the page or contact support if the problem persists.'
                : "We're sorry for the inconvenience. An unexpected error occurred while rendering this page."}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: showDetails && error ? 4 : 0 }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                size="large"
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go to Home
              </Button>
            </Stack>

            {/* Error Details - Only in development or if showDetails is true */}
            {(showDetails || process.env.NODE_ENV === 'development') && error && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.5)
                      : alpha(theme.palette.grey[100], 0.5),
                  borderRadius: 2,
                  textAlign: 'left',
                  overflow: 'auto',
                  maxHeight: 400,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="error.main"
                  gutterBottom
                >
                  Error Details (Development Only):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: 'text.secondary',
                  }}
                >
                  {error.toString()}
                </Typography>
                {errorInfo && (
                  <>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="error.main"
                      sx={{ mt: 2 }}
                      gutterBottom
                    >
                      Component Stack:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: 'text.secondary',
                      }}
                    >
                      {errorInfo.componentStack}
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {/* Error count warning */}
            {errorCount > 2 && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{ mt: 3, display: 'block', fontStyle: 'italic' }}
              >
                This error has occurred {errorCount} times. Please contact support.
              </Typography>
            )}
          </Paper>
        </Container>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  showDetails: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  showDetails: false,
};

export default ErrorBoundary;
