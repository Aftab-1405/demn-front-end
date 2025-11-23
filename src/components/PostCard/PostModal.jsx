import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { BACKEND_URL } from '../../services/api';

const PostModal = ({ isOpen, onClose, item, isPost }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          m: isMobile ? 0 : 2,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="Close dialog"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'text.secondary',
          opacity: 0.7,
          zIndex: 1,
          '&:hover': {
            opacity: 1,
            bgcolor: 'action.hover',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { xs: '60vh', md: '70vh' },
            maxHeight: '90vh',
          }}
        >
          <Box
            sx={{
              flex: { xs: 1, md: 1.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
              overflow: 'hidden',
              borderRight: { md: (theme) => `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: (theme) => `1px solid ${theme.palette.divider}`, md: 'none' },
            }}
          >
            {isPost && item.image_url && (
              <Box
                component="img"
                src={`${BACKEND_URL}${item.image_url}`}
                alt="Post"
                loading="lazy"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
            {!isPost && item.video_url && (
              <Box
                component="video"
                src={`${BACKEND_URL}${item.video_url}`}
                controls
                autoPlay
                sx={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              flex: { xs: 1, md: 1 },
              maxWidth: { md: 400 },
              p: 2,
              borderTop: { xs: (theme) => `1px solid ${theme.palette.divider}`, md: 'none' },
              borderLeft: { md: (theme) => `1px solid ${theme.palette.divider}` },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                mb: { xs: 1.5, md: 0 },
                pb: { md: 2 },
                borderBottom: { md: (theme) => `1px solid ${theme.palette.divider}` },
              }}
            >
              <Link
                component={RouterLink}
                to={`/profile/${item.author.username}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  textDecoration: 'none',
                }}
              >
                <Avatar
                  src={item.author.profile_picture ? `${BACKEND_URL}${item.author.profile_picture}` : undefined}
                  sx={{
                    width: 32,
                    height: 32,
                    border: (theme) => `2px solid ${theme.palette.divider}`,
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {!item.author.profile_picture && item.author.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.8125rem',
                  }}
                >
                  {item.author.username}
                </Typography>
              </Link>
            </Box>
            {item.caption && (
              <Box
                sx={{
                  p: { md: 2 },
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'text.primary',
                }}
              >
                <Typography component="span" sx={{ fontWeight: 600 }}>
                  {item.author.username}
                </Typography>{' '}
                <Typography component="span">{item.caption}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

PostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isPost: PropTypes.bool.isRequired,
};

export default PostModal;
