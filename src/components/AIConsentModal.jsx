import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Link,
  Divider,
  keyframes,
  styled,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Comment as CommentIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 800,
    width: '100%',
    maxHeight: '85vh',
    height: '85vh',
    borderRadius: theme.spacing(3),
    background: theme.palette.mode === 'dark'
      ? 'rgba(20, 20, 24, 0.95)'
      : 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.5)'
      : '0 20px 60px rgba(0, 0, 0, 0.15)',
    animation: `${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
      height: '90vh',
      borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`,
    },
  },
  '& .MuiBackdrop-root': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.85)'
      : 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    animation: `${fadeIn} 0.3s ease-out`,
  },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 3),
  },
}));

const StyledContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: 4,
    '&:hover': {
      background: theme.palette.text.secondary,
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const StyledFeature = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  background: 'transparent',
  borderRadius: theme.spacing(1.5),
  border: 'none',
  borderLeft: `3px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderLeftColor: theme.palette.primary.main,
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
  },
}));

const StyledFeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: '1.5rem',
  flexShrink: 0,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
    width: 28,
    height: 28,
  },
}));

const StyledPrivacyBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(34, 197, 94, 0.08)'
    : 'rgba(34, 197, 94, 0.05)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}));

const StyledCheckboxContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2.5),
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.03)'
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === 'dark'
    ? 'rgba(20, 20, 24, 0.8)'
    : 'rgba(248, 249, 255, 0.9)',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 3),
  },
}));

const AIConsentModal = ({ isOpen, onAccept }) => {
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <StyledDialog
      open={isOpen}
      onClose={() => {}} // Prevent closing by clicking outside
      maxWidth={false}
      PaperProps={{
        sx: {
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '90vh', sm: '85vh' },
        },
      }}
    >
      <StyledHeader>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 700,
            color: 'text.primary',
            marginBottom: 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Welcome to D.E.M.N
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: 'text.disabled',
            margin: 0,
          }}
        >
          Understand our platform
        </Typography>
      </StyledHeader>

      <StyledContent>
        <Stack spacing={2.5}>
          <StyledFeature>
            <StyledFeatureIcon>✅</StyledFeatureIcon>
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  marginBottom: 0.5,
                }}
              >
                Fact-Checking
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                We verify your posts and reels for accuracy to combat misinformation
              </Typography>
            </Box>
          </StyledFeature>

          <StyledFeature>
            <StyledFeatureIcon>🛡️</StyledFeatureIcon>
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  marginBottom: 0.5,
                }}
              >
                Content Moderation
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Automated protection against hate speech, harassment, and inappropriate content
              </Typography>
            </Box>
          </StyledFeature>

          <StyledFeature>
            <StyledFeatureIcon>💬</StyledFeatureIcon>
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  marginBottom: 0.5,
                }}
              >
                Smart Suggestions
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Helpful comment suggestions to boost engagement
              </Typography>
            </Box>
          </StyledFeature>

          <StyledPrivacyBox>
            <Typography
              variant="h6"
              component="h4"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'success.main',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <LockIcon sx={{ fontSize: 20 }} />
              Your Privacy Guaranteed
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '0 0 1.5rem 0' }}>
              {[
                'Your personal identity is NEVER shared with third parties',
                'Only content (text/images) is processed temporarily for verification',
                'All data is encrypted and securely stored',
                'You retain full ownership and can delete content anytime',
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1.25,
                    position: 'relative',
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    '&::before': {
                      content: '"✓"',
                      position: 'absolute',
                      left: 1,
                      color: 'success.main',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: 'text.disabled',
                margin: 0,
              }}
            >
              Learn more in our{' '}
              <Link
                component={RouterLink}
                to="/privacy"
                target="_blank"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Policy
              </Link>
            </Typography>
          </StyledPrivacyBox>

          <StyledCheckboxContainer>
            <FormControlLabel
              control={
                <Checkbox
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.primary',
                    lineHeight: 1.6,
                  }}
                >
                  I understand and agree to D.E.M.N&apos;s use of AI technology as described above
                </Typography>
              }
              sx={{
                margin: 0,
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  marginLeft: 1.5,
                },
              }}
            />
          </StyledCheckboxContainer>
        </Stack>
      </StyledContent>

      <StyledFooter>
        <Button
          variant="contained"
          fullWidth
          onClick={onAccept}
          disabled={!understood}
          sx={{
            minHeight: 48,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Accept & Continue
        </Button>
      </StyledFooter>
    </StyledDialog>
  );
};

export default AIConsentModal;