import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
  Divider,
  Button,
  styled,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  AddBox as AddBoxIcon,
  VideoLibrary as VideoLibraryIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Edit as EditIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BACKEND_URL } from '../services/api';
import NotificationBell from './NotificationBell';
import EditProfileModal from './EditProfileModal';

// Animations
const slideUpMobile = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styled components
const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  minWidth: 48,
  width: 48,
  height: 48,
  [theme.breakpoints.up('lg')]: {
    minWidth: 44,
    width: 44,
    height: 44,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    left: 0,
    width: '3px',
    height: '70%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '0 4px 4px 0',
  } : {},
}));

const StyledNavbar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible' && prop !== 'isDesktopLeft',
})(({ theme, isVisible, isDesktopLeft }) => ({
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  padding: 0,
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow: theme.shadows[1],
  transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
  opacity: isVisible ? 1 : 0.95,
  ...(isDesktopLeft && {
    [theme.breakpoints.up('lg')]: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 80,
      borderRight: `1px solid ${theme.palette.divider}`,
      borderBottom: 'none',
      boxShadow: theme.shadows[8],
      transform: 'none',
      opacity: 1,
    },
  }),
}));

const StyledNavbarContent = styled(Box)(({ theme }) => ({
  maxWidth: 'min(100%, 1200px)',
  margin: '0 auto',
  padding: theme.spacing(1, 1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [theme.breakpoints.up('lg')]: {
    height: '100%',
    maxWidth: '100%',
    padding: theme.spacing(2.5, 1),
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
}));

const StyledBrandLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover img': {
    transform: 'scale(1.08)',
    filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.4)})`,
  },
}));

const StyledBrandIcon = styled('img')(({ theme }) => ({
  height: theme.spacing(4),
  width: 'auto',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.up('sm')]: {
    height: theme.spacing(5.25),
  },
}));

const StyledMobileNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  bgcolor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  boxShadow: theme.shadows[4],
  zIndex: 1100,
  justifyContent: 'space-around',
  alignItems: 'center',
  px: 0.5,
  py: 1,
  height: 56,
  animation: `${slideUpMobile} 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both`,
  [theme.breakpoints.up('md')]: {
    display: 'none !important',
  },
}));

const Navbar = () => {
  const { isAuthenticated, user, logout, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [isVisible, setIsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Optimized scroll handler with requestAnimationFrame throttling
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Don't hide if at the top of the page
          if (currentScrollY < 10) {
            setIsVisible(true);
          }
          // Scrolling down - hide navbar
          else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setIsVisible(false);
          }
          // Scrolling up - show navbar
          else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, []);

  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(() => {
    if (!isAuthenticated) return [];

    return [
      {
        to: '/feed',
        label: 'Feed',
        icon: <HomeIcon />,
      },
      {
        to: '/explore',
        label: 'Explore',
        icon: <ExploreIcon />,
      },
      {
        to: '/create/post',
        label: 'Create Post',
        icon: <AddBoxIcon />,
      },
      {
        to: '/create/reel',
        label: 'Create Reel',
        icon: <VideoLibraryIcon />,
      },
      {
        to: '/analytics',
        label: 'Analytics',
        icon: <AnalyticsIcon />,
      },
    ];
  }, [isAuthenticated]);

  // Memoized handlers
  const handleSettingsOpen = useCallback(() => setIsSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setIsSettingsOpen(false), []);
  const handleEditProfileOpen = useCallback(() => {
    setIsEditProfileOpen(true);
    setIsSettingsOpen(false);
  }, []);
  const handleEditProfileClose = useCallback(() => setIsEditProfileOpen(false), []);
  const handleProfileUpdated = useCallback((updatedUser) => {
    updateUser(updatedUser);
  }, [updateUser]);
  const handleLogout = useCallback(() => {
    logout();
    setIsSettingsOpen(false);
  }, [logout]);
  const handleThemeToggle = useCallback(() => {
    toggleTheme();
    setIsSettingsOpen(false);
  }, [toggleTheme]);

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add('has-left-nav');
    } else {
      document.body.classList.remove('has-left-nav');
    }

    return () => {
      document.body.classList.remove('has-left-nav');
    };
  }, [isAuthenticated]);

  return (
    <>
      <StyledNavbar
        component="nav"
        isVisible={isVisible}
        isDesktopLeft={isAuthenticated}
      >
        <StyledNavbarContent>
          <StyledBrandLink to="/">
            <StyledBrandIcon src="/icons/icon-source.svg" alt="D.E.M.N" />
          </StyledBrandLink>

          {isAuthenticated ? (
            <>
              {/* Desktop Navigation Links - Hidden on Mobile */}
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  flexDirection: 'column',
                  gap: 1,
                  flex: 1,
                  width: { lg: 'auto' },
                  alignItems: { lg: 'center' },
                }}
              >
                {navItems.map((item) => (
                  <Tooltip key={item.to} title={item.label} placement="right" arrow>
                    <StyledIconButton
                      component={NavLink}
                      to={item.to}
                      aria-label={item.label}
                      sx={(theme) => ({
                        '&.active': {
                          color: theme.palette.primary.main,
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            width: '3px',
                            height: '70%',
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '0 4px 4px 0',
                          },
                        },
                      })}
                    >
                      {item.icon}
                    </StyledIconButton>
                  </Tooltip>
                ))}
              </Box>

              {/* Mobile Top Bar - Only Logo and Notification */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flex: 1,
                  gap: 1,
                  pr: 2
                }}
              >
                <NotificationBell />
              </Box>

              {/* Desktop Controls - Hidden on Mobile */}
              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: { lg: 'center' },
                  width: { lg: 'auto' },
                  mt: { lg: 'auto' },
                }}
              >
                <NotificationBell />
                {user?.username && (
                  <Tooltip title="Profile" placement="right" arrow>
                    <IconButton
                      component={NavLink}
                      to={`/profile/${user.username}`}
                      sx={{
                        p: 0.5,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Avatar
                        src={user.profile_picture ? `${BACKEND_URL}${user.profile_picture}` : undefined}
                        alt={user.username}
                        sx={{
                          width: 40,
                          height: 40,
                          border: 2,
                          borderColor: 'primary.main',
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Settings" placement="right" arrow>
                  <IconButton onClick={handleSettingsOpen} aria-label="Settings">
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                <IconButton onClick={toggleTheme} aria-label="Toggle theme">
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Button variant="outlined" color="primary" component={Link} to="/login" size="small">
                Login
              </Button>
              <Button variant="contained" color="primary" component={Link} to="/register" size="small">
                Register
              </Button>
            </Box>
          )}
        </StyledNavbarContent>
      </StyledNavbar>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={isSettingsOpen}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            width: 300,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Quick Actions
          </Typography>
          <List>
            {user && (
              <>
                <ListItem
                  button
                  onClick={handleEditProfileOpen}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(4px)',
                      boxShadow: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      '& .MuiListItemIcon-root': {
                        transform: 'scale(1.1)',
                      },
                    },
                    '&:active': {
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ transition: 'transform 0.2s ease' }}>
                    <EditIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Edit Profile" />
                </ListItem>
                <Divider sx={{ my: 1 }} />
              </>
            )}
            <ListItem
              button
              component={Link}
              to="/stats"
              onClick={handleSettingsClose}
              sx={{
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '& .MuiListItemIcon-root': {
                    transform: 'scale(1.1)',
                  },
                },
                '&:active': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon sx={{ transition: 'transform 0.2s ease' }}>
                <BarChartIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Platform Stats" />
            </ListItem>
            <ListItem
              button
              onClick={handleThemeToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '& .MuiListItemIcon-root': {
                    transform: 'scale(1.1)',
                  },
                },
                '&:active': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon sx={{ transition: 'transform 0.2s ease' }}>
                {isDarkMode ? <LightModeIcon color="primary" /> : <DarkModeIcon color="primary" />}
              </ListItemIcon>
              <ListItemText primary="Toggle Theme" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'error.light',
                  transform: 'translateX(4px)',
                  boxShadow: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? '0 2px 8px rgba(211, 47, 47, 0.3)' 
                      : '0 2px 8px rgba(211, 47, 47, 0.2)',
                  '& .MuiListItemIcon-root': {
                    color: 'error.main',
                    transform: 'scale(1.1)',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'error.main',
                    fontWeight: 600,
                  },
                },
                '&:active': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              <ListItemIcon sx={{ transition: 'transform 0.2s ease' }}>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={handleEditProfileClose}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <StyledMobileNav>
          <IconButton
            component={NavLink}
            to="/feed"
            sx={{
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <HomeIcon />
          </IconButton>

          <IconButton
            component={NavLink}
            to="/explore"
            sx={{
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <ExploreIcon />
          </IconButton>

          <IconButton
            component={NavLink}
            to="/create/post"
            sx={{
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <AddBoxIcon />
          </IconButton>

          <IconButton
            component={NavLink}
            to="/create/reel"
            sx={{
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <VideoLibraryIcon />
          </IconButton>

          <IconButton
            component={NavLink}
            to="/analytics"
            sx={{
              color: 'text.secondary',
              '&.active': {
                color: 'primary.main',
              },
            }}
          >
            <AnalyticsIcon />
          </IconButton>

          {user?.username ? (
            <IconButton
              component={NavLink}
              to={`/profile/${user.username}`}
              sx={{
                p: 0.5,
                '&.active': {
                  '& .MuiAvatar-root': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            >
              <Avatar
                src={user.profile_picture ? `${BACKEND_URL}${user.profile_picture}` : undefined}
                alt={user.username}
                sx={{
                  width: 28,
                  height: 28,
                  border: 2,
                  borderColor: 'transparent',
                  transition: 'border-color 200ms',
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          ) : (
            <IconButton disabled sx={{ opacity: 0.3 }}>
              <Avatar sx={{ width: 28, height: 28 }}>?</Avatar>
            </IconButton>
          )}
        </StyledMobileNav>
      )}
    </>
  );
};

export default React.memo(Navbar);