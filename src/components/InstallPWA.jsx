import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Avatar,
  keyframes,
  alpha,
} from '@mui/material';
import { Close as CloseIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import { canInstallPWA, showInstallPrompt, isPWA } from '../serviceWorkerRegistration';

// Animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const InstallPWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const android = /android/i.test(userAgent);

    setIsIOS(iOS);
    setIsAndroid(android);

    // Check if app is already installed
    if (isPWA()) {
      return;
    }

    // Check if install prompt is available
    const checkInstallability = setInterval(() => {
      if (canInstallPWA()) {
        setCanInstall(true);
        clearInterval(checkInstallability);

        // Show banner after a delay (don't be intrusive immediately)
        setTimeout(() => {
          const hasSeenBanner = localStorage.getItem('pwa-install-banner-dismissed');
          const dismissedTime = localStorage.getItem('pwa-install-banner-dismissed-time');

          // Show again after 7 days
          if (!hasSeenBanner || (dismissedTime && (Date.now() - parseInt(dismissedTime)) > 7 * 24 * 60 * 60 * 1000)) {
            setShowBanner(true);
          }
        }, 3000);
      }
    }, 1000);

    // For iOS users, show manual install instructions
    if (iOS && !isPWA()) {
      setTimeout(() => {
        const hasSeenBanner = localStorage.getItem('pwa-install-banner-dismissed');
        if (!hasSeenBanner) {
          setShowBanner(true);
          setCanInstall(true); // Show banner even without prompt
        }
      }, 5000);
    }

    return () => clearInterval(checkInstallability);
  }, []);

  const handleInstall = () => {
    showInstallPrompt();
    setShowBanner(false);
    setCanInstall(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-banner-dismissed', 'true');
    localStorage.setItem('pwa-install-banner-dismissed-time', Date.now().toString());
  };

  if (!canInstall || !showBanner) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, sm: 20, md: 30 },
        left: { xs: '50%', md: 'auto' },
        right: { xs: 'auto', md: 30 },
        transform: { xs: 'translateX(-50%)', md: 'none' },
        zIndex: 9999,
        maxWidth: { xs: 500, sm: 450, md: 400 },
        width: { xs: 'calc(100% - 40px)', sm: 'calc(100% - 40px)', md: 'auto' },
        animation: `${slideUp} 0.4s ease-out`,
        [theme => theme.breakpoints.up('md')]: {
          animation: `${slideInRight} 0.4s ease-out`,
        },
      }}
    >
      <Card
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          borderRadius: 2,
          boxShadow: (theme) =>
            `0 10px 40px ${alpha(theme.palette.common.black, 0.4)}, 0 0 80px ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2, md: 2 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2 } },
          }}
        >
          <Avatar
            src="/icons/icon-96x96.png"
            alt="D.E.M.N"
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              minWidth: { xs: 40, sm: 48 },
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
                m: 0,
              }}
            >
              📱 Install D.E.M.N App
            </Typography>
            {isIOS ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: 'text.secondary',
                  m: 0,
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                Tap{' '}
                <Box
                  component="svg"
                  sx={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    width: 16,
                    height: 16,
                    mb: 0.25,
                  }}
                  viewBox="0 0 50 50"
                  fill="currentColor"
                >
                  <path d="M 25 2 C 24.285156 2 23.570313 2.179688 22.933594 2.539063 L 6.089844 12.003906 C 4.800781 12.730469 4 14.082031 4 15.535156 L 4 34.464844 C 4 35.917969 4.800781 37.269531 6.089844 37.996094 L 22.933594 47.460938 C 24.222656 48.1875 25.777344 48.1875 27.066406 47.460938 L 43.910156 37.996094 C 45.199219 37.269531 46 35.917969 46 34.464844 L 46 15.535156 C 46 14.082031 45.199219 12.730469 43.910156 12.003906 L 27.066406 2.539063 C 26.429688 2.179688 25.714844 2 25 2 Z M 25 13 L 25 24 L 19 24 L 25 37 L 31 24 L 25 24 L 25 13 Z" />
                </Box>{' '}
                Share → &quot;Add to Home Screen&quot;
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  color: 'text.secondary',
                  m: 0,
                  lineHeight: 1.4,
                }}
              >
                Get offline access, faster load times, and a native app experience!
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {!isIOS && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleInstall}
                startIcon={<GetAppIcon />}
              >
                Install
              </Button>
            )}
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              {isIOS ? (
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Got it!
                </Typography>
              ) : (
                <CloseIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InstallPWA;