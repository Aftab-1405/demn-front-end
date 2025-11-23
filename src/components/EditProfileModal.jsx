import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { usersAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import Spinner from './Spinner';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSnackbar } = useNotifications();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bio.length > 150) {
      showSnackbar('Bio must be 150 characters or less', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await usersAPI.updateProfile({
        full_name: fullName.trim(),
        bio: bio.trim(),
      });

      showSnackbar('Profile updated successfully!', 'success');

      if (onProfileUpdated) {
        onProfileUpdated(response.data.user);
      }

      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      showSnackbar(err.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || '');
    setBio(user?.bio || '');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth="md"
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
      <IconButton
        aria-label="Close dialog"
        onClick={handleCancel}
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
          pt: 2.5,
          pr: 6,
          fontWeight: 700,
          fontSize: '1.25rem',
        }}
      >
        Edit Profile
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
        <Box
          component="form"
          id="edit-profile-form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <TextField
            id="fullName"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            inputProps={{ maxLength: 150 }}
            disabled={saving}
            autoComplete="name"
            fullWidth
          />

          <Box>
            <TextField
              id="bio"
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about yourself..."
              inputProps={{ maxLength: 150 }}
              disabled={saving}
              multiline
              rows={4}
              fullWidth
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: 'text.disabled',
                textAlign: 'right',
                display: 'block',
                mt: 0.5,
              }}
            >
              {bio.length}/150
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          type="button"
          onClick={handleCancel}
          variant="outlined"
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-profile-form"
          variant="contained"
          color="primary"
          disabled={saving}
          startIcon={saving ? <Spinner size="sm" color="white" /> : null}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    full_name: PropTypes.string,
    bio: PropTypes.string,
  }),
  onProfileUpdated: PropTypes.func,
};

export default EditProfileModal;
