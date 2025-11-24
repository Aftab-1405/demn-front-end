import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const DeleteConfirmModal = ({ isOpen, onClose, isPost, isDeleting, onConfirm }) => {
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

      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2.5,
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
            borderRadius: '50%',
            color: 'error.main',
          }}
        >
          <DeleteIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
          Delete {isPost ? 'Post' : 'Reel'}?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9375rem',
            color: 'text.secondary',
            lineHeight: 1.6,
            mb: 3.5,
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          Are you sure you want to delete this {isPost ? 'post' : 'reel'}? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center">
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isDeleting}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={isDeleting}
            sx={{ minWidth: 120 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPost: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
