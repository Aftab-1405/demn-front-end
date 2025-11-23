import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Container,
  Button,
  CircularProgress,
  IconButton,
  Fade,
  Slide,
  keyframes,
  styled,
  Alert,
  Chip,
  Collapse,
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

// Animations
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), 0 0 60px rgba(236, 72, 153, 0.3);
  }
`;

const networkPulse = keyframes`
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
`;

const dataFlow = keyframes`
  0% {
    transform: translateX(-100%) translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translateX(100vw) translateY(-50px);
    opacity: 0;
  }
`;

// Styled components
const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const AuthCard = styled(Box)(({ theme }) => {
  const darkBg = theme.palette.mode === 'dark' 
    ? theme.palette.background.paper 
    : 'rgba(255, 255, 255, 0.95)';
  
  return {
    padding: theme.spacing(5),
    maxWidth: '500px',
    width: '100%',
    borderRadius: '24px',
    background: `linear-gradient(${darkBg}, ${darkBg}) padding-box, linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%) border-box`,
    border: '2px solid transparent',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15)'
      : '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 20px rgba(236, 72, 153, 0.1)',
    animation: `${glowPulse} 4s ease-in-out infinite`,
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      borderRadius: '20px',
    },
  };
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 900,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  letterSpacing: '0.05em',
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const BackgroundAnimation = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
  pointerEvents: 'none',
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
  const [showRequirements, setShowRequirements] = useState(false);
  const [requirements, setRequirements] = useState(null);

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
    <AuthContainer maxWidth={false}>
      {/* Advanced Background Animation */}
      <BackgroundAnimation>
        {/* Base Aurora Gradients */}
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(100px)',
            mixBlendMode: 'screen',
            width: '400px',
            height: '400px',
            top: '-150px',
            left: '-150px',
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            animation: `${floatAnimation} 20s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(100px)',
            mixBlendMode: 'screen',
            width: '350px',
            height: '350px',
            bottom: '-100px',
            right: '-100px',
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
            animation: `${floatAnimation} 18s ease-in-out infinite reverse`,
          }}
        />

        {/* Network Grid */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: (theme) => `
              linear-gradient(${theme.palette.primary.main}22 1px, transparent 1px),
              linear-gradient(90deg, ${theme.palette.primary.main}22 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: `${networkPulse} 4s ease-in-out infinite`,
          }}
        />

        {/* Data Flow Streams */}
        {[...Array(2)].map((_, i) => (
          <Box
            key={`dataflow-${i}`}
            sx={{
              position: 'absolute',
              width: '2px',
              height: '150px',
              background: (theme) =>
                `linear-gradient(180deg, transparent, ${theme.palette.primary.main}44, transparent)`,
              left: `${30 + i * 40}%`,
              top: '-150px',
              animation: `${dataFlow} ${10 + i * 2}s linear infinite`,
              animationDelay: `${i * 3}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </BackgroundAnimation>

      <Slide direction="up" in={true} timeout={600}>
        <AuthCard>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <LogoText variant="h4" component="div">
              D.E.M.N
            </LogoText>
          </Link>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Fade in={true} timeout={800}>
              <Box>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  gutterBottom 
                  sx={{
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                  }}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 1,
                    mt: 1 
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
            </Fade>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Username Input */}
            <Fade in={true} timeout={1000}>
              <TextField
                fullWidth
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
            </Fade>

            {/* Email Input (Register only) */}
            {!isLogin && (
              <Fade in={true} timeout={1200}>
                <TextField
                  fullWidth
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
              </Fade>
            )}

            {/* Full Name Input (Register only) */}
            {!isLogin && (
              <Fade in={true} timeout={1400}>
                <TextField
                  fullWidth
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
              </Fade>
            )}

            {/* Password Input */}
            <Fade in={true} timeout={!isLogin ? 1600 : 1200}>
              <Box>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => !isLogin && setShowRequirements(true)}
                  disabled={loading}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password || (isLogin ? '' : (!requirements ? 'Loading requirements...' : 'Click to see password requirements'))}
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

                {/* Password Requirements Checklist (Register only) */}
                {!isLogin && requirements && (
                  <Collapse in={showRequirements || formData.password.length > 0}>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
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
                    </Box>
                  </Collapse>
                )}

                {/* Username Requirements Info (Register only) */}
                {!isLogin && requirements && formData.username.length > 0 && formData.username.length < 3 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Username must be 3-30 characters and contain only letters, numbers, and underscores.
                  </Alert>
                )}
              </Box>
            </Fade>

            <Fade in={true} timeout={!isLogin ? 1800 : 1400}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                sx={{
                  mt: 2,
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
            </Fade>
          </Box>

          <Fade in={true} timeout={2000}>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
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
          </Fade>
        </AuthCard>
      </Slide>
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

