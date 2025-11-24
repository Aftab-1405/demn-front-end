import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Report as ReportIcon,
} from '@mui/icons-material';

const PostOptionsModal = ({
  isOpen,
  onClose,
  isOwnPost,
  isPost,
  onDelete,
  onViewDetails,
  onShare
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
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

      <DialogTitle
        sx={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'text.primary',
          p: 2.5,
          pr: 6,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        Post Options
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 1 }}>
          {isOwnPost && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={onDelete}
                  sx={{
                    py: 1.75,
                    px: 3,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DeleteIcon sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText primary={`Delete ${isPost ? 'Post' : 'Reel'}`} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={onViewDetails}
                  sx={{
                    py: 1.75,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Details" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton
              onClick={onShare}
              sx={{
                py: 1.75,
                px: 3,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary={`Share ${isPost ? 'Post' : 'Reel'}`} />
            </ListItemButton>
          </ListItem>
          {!isOwnPost && (
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  py: 1.75,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ReportIcon />
                </ListItemIcon>
                <ListItemText primary="Report" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

PostOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isOwnPost: PropTypes.bool.isRequired,
  isPost: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default PostOptionsModal;
