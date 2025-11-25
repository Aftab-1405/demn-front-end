import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const ProfileSettings = ({
  isOpen,
  onClose,
  isDarkMode,
  onThemeToggle,
  onEditProfile,
  onLogout,
}) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
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
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={onEditProfile}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <EditIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={onThemeToggle}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                {isDarkMode ? <LightModeIcon color="primary" /> : <DarkModeIcon color="primary" />}
              </ListItemIcon>
              <ListItemText primary="Toggle Theme" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={onLogout}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'error.light',
                  '& .MuiListItemIcon-root': {
                    color: 'error.main',
                  },
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

ProfileSettings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ProfileSettings;
