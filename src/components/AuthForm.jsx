import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Button,
  CircularProgress,
  IconButton,
  Fade,
  styled,
  Alert,
  Chip,
  Popover,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Styled components
const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

// Left Panel - Branding & Features
const BrandPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 42%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.info.main} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('md')]: {
    flex: '0 0 auto',
    minHeight: '180px',
    padding: theme.spacing(4, 3),
  },
}));

// Right Panel - Form
const FormPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 58%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  overflowY: 'auto',
  [theme.breakpoints.down('md')]: {
    flex: 1,
    padding: theme.spacing(3, 2),
  },
}));

const AuthCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  maxWidth: '420px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    maxWidth: '100%',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 900,
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  letterSpacing: '0.05em',
  textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  zIndex: 1,
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Unified authentication form component for Login and Register
 */
const AuthForm = ({
  mode, // 'login' or 'register'
  title,
  subtitle,
  submitLabel,
  submitLoadingLabel,
  linkText,
  linkPath,
  linkLabel,
  hookResult
}) => {
  const { formData, loading, fieldErrors, handleChange, handleSubmit } = hookResult;
  const isLogin = mode === 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [requirements, setRequirements] = useState(null);
  const [passwordAnchorEl, setPasswordAnchorEl] = useState(null);

  // Fetch password requirements on mount for register mode
  useEffect(() => {
    if (!isLogin) {
      axios.get('/api/auth/password-requirements')
        .then(response => {
          setRequirements(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch password requirements:', error);
          // Fallback requirements
          setRequirements({
            requirements: {
              min_length: 8,
              require_uppercase: true,
              require_lowercase: true,
              require_digit: true,
              require_special: true,
              special_chars: '!@#$%^&*(),.?":{}|<>-_=+[]\\;/'
            },
            username_requirements: {
              min_length: 3,
              max_length: 30,
              allowed_chars: 'Letters, numbers, and underscores only'
            }
          });
        });
    }
  }, [isLogin]);

  // Enhanced validation helpers
  const isUsernameValid = formData.username.length >= 3 && (isLogin || /^[a-zA-Z0-9_]+$/.test(formData.username));
  const isEmailValid = formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFullNameValid = formData.full_name && formData.full_name.length >= 2;

  // Password validation (enhanced for registration)
  const passwordChecks = !isLogin && requirements ? {
    minLength: formData.password.length >= requirements.requirements.min_length,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasDigit: /\d/.test(formData.password),
    hasSpecial: new RegExp(`[${requirements.requirements.special_chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(formData.password)
  } : null;

  const isPasswordValid = isLogin
    ? formData.password.length >= 6
    : passwordChecks && Object.values(passwordChecks).every(check => check);

  const getInputAdornment = (isValid, hasError, icon) => ({
    startAdornment: (
      <InputAdornment position="start">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: hasError ? 'error.main' : isValid ? 'success.main' : 'primary.main',
            transition: 'color 0.3s ease',
          }}
        >
          {icon}
        </Box>
      </InputAdornment>
    ),
    endAdornment: !hasError && isValid && (
      <InputAdornment position="end">
        <Fade in={isValid}>
          <CheckCircleIcon color="success" fontSize="small" />
        </Fade>
      </InputAdornment>
    ),
  });

  return (
    <AuthContainer>
      {/* Left Panel - Branding */}
      <BrandPanel>
        <Fade in={true} timeout={600}>
          <Box sx={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
              <LogoText variant="h2" component="div">
                D.E.M.N
              </LogoText>
            </Link>

            <Typography
              variant="h6"
              sx={{
                mb: { xs: 2, md: 4 },
                fontWeight: 500,
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              AI-Powered Social Media Platform
            </Typography>

            {/* Features - Hide on mobile for cleaner look */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 4 }}>
              <FeatureItem>
                <VerifiedIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Real-time fact verification
                </Typography>
              </FeatureItem>
              <FeatureItem>
                <SecurityIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  AI content moderation
                </Typography>
              </FeatureItem>
              <FeatureItem>
                <InfoIcon sx={{ fontSize: 24 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Truth-verified community
                </Typography>
              </FeatureItem>
            </Box>
          </Box>
        </Fade>
      </BrandPanel>

      {/* Right Panel - Form */}
      <FormPanel>
        <Fade in={true} timeout={800}>
          <AuthCard>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                {isLogin ? (
                  <>
                    <SecurityIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    {subtitle}
                  </>
                ) : (
                  <>
                    <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    {subtitle}
                  </>
                )}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {/* Username Input */}
              <TextField
                fullWidth
                size="small"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                error={!!fieldErrors.username}
                helperText={fieldErrors.username}
                InputProps={getInputAdornment(isUsernameValid, !!fieldErrors.username, <PersonIcon />)}
                autoComplete="username"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  },
                }}
              />

              {/* Email Input (Register only) */}
              {!isLogin && (
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  InputProps={getInputAdornment(isEmailValid, !!fieldErrors.email, <EmailIcon />)}
                  autoComplete="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    },
                  }}
                />
              )}

              {/* Full Name Input (Register only) */}
              {!isLogin && (
                <TextField
                  fullWidth
                  size="small"
                  name="full_name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!fieldErrors.full_name}
                  helperText={fieldErrors.full_name}
                  InputProps={getInputAdornment(isFullNameValid, !!fieldErrors.full_name, <PersonIcon />)}
                  autoComplete="name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    },
                  }}
                />
              )}

              {/* Password Input */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (!isLogin && requirements) {
                      setPasswordAnchorEl(e.currentTarget);
                    }
                  }}
                  onBlur={() => {
                    // Delay closing to allow clicking inside popover
                    setTimeout(() => setPasswordAnchorEl(null), 150);
                  }}
                  disabled={loading}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password || (isLogin ? '' : (!requirements ? 'Loading requirements...' : ''))}
                  InputProps={{
                    ...getInputAdornment(isPasswordValid, !!fieldErrors.password, <LockIcon />),
                    endAdornment: (
                      <InputAdornment position="end">
                        {!fieldErrors.password && isPasswordValid && (
                          <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                        )}
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                      },
                    },
                  }}
                />

                {/* Password Requirements Popover (Register only) */}
                <Popover
                  open={Boolean(passwordAnchorEl)}
                  anchorEl={passwordAnchorEl}
                  onClose={() => setPasswordAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{
                    mt: 1,
                  }}
                >
                  {!isLogin && requirements && (
                    <Paper sx={{ p: 2, maxWidth: 320, boxShadow: 3 }}>
                      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <InfoIcon fontSize="small" />
                        Password Requirements:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Chip
                          size="small"
                          icon={passwordChecks?.minLength ? <CheckCircleIcon /> : <CancelIcon />}
                          label={`At least ${requirements.requirements.min_length} characters`}
                          color={passwordChecks?.minLength ? 'success' : 'default'}
                          variant={passwordChecks?.minLength ? 'filled' : 'outlined'}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                        <Chip
                          size="small"
                          icon={passwordChecks?.hasUppercase ? <CheckCircleIcon /> : <CancelIcon />}
                          label="One uppercase letter (A-Z)"
                          color={passwordChecks?.hasUppercase ? 'success' : 'default'}
                          variant={passwordChecks?.hasUppercase ? 'filled' : 'outlined'}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                        <Chip
                          size="small"
                          icon={passwordChecks?.hasLowercase ? <CheckCircleIcon /> : <CancelIcon />}
                          label="One lowercase letter (a-z)"
                          color={passwordChecks?.hasLowercase ? 'success' : 'default'}
                          variant={passwordChecks?.hasLowercase ? 'filled' : 'outlined'}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                        <Chip
                          size="small"
                          icon={passwordChecks?.hasDigit ? <CheckCircleIcon /> : <CancelIcon />}
                          label="One number (0-9)"
                          color={passwordChecks?.hasDigit ? 'success' : 'default'}
                          variant={passwordChecks?.hasDigit ? 'filled' : 'outlined'}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                        <Chip
                          size="small"
                          icon={passwordChecks?.hasSpecial ? <CheckCircleIcon /> : <CancelIcon />}
                          label={`One special character (${requirements.requirements.special_chars.substring(0, 10)}...)`}
                          color={passwordChecks?.hasSpecial ? 'success' : 'default'}
                          variant={passwordChecks?.hasSpecial ? 'filled' : 'outlined'}
                          sx={{ justifyContent: 'flex-start' }}
                        />
                      </Box>
                    </Paper>
                  )}
                </Popover>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                sx={{
                  mt: 1.5,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: 'white',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 4px 14px rgba(139, 92, 246, 0.4)'
                      : '0 4px 14px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 8px 24px rgba(139, 92, 246, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)'
                        : '0 8px 24px rgba(139, 92, 246, 0.4), 0 0 20px rgba(236, 72, 153, 0.2)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.12)',
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(0, 0, 0, 0.26)',
                  },
                }}
              >
                {loading ? submitLoadingLabel : submitLabel}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2.5} fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}>
              {linkText}{' '}
              <Box
                component={Link}
                to={linkPath}
                sx={(theme) => ({
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    '&::after': {
                      width: '100%',
                    },
                  },
                })}
              >
                {linkLabel}
              </Box>
            </Typography>
          </AuthCard>
        </Fade>
      </FormPanel>
    </AuthContainer>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
  submitLoadingLabel: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkPath: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  hookResult: PropTypes.object.isRequired,
};

export default AuthForm;

