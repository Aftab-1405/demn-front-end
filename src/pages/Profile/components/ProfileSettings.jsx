import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const ProfileSettings = ({
  isOpen,
  onClose,
  isDarkMode,
  onThemeToggle,
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
          <ListItem
            button
            onClick={onThemeToggle}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              {isDarkMode ? <LightModeIcon color="primary" /> : <DarkModeIcon color="primary" />}
            </ListItemIcon>
            <ListItemText primary="Toggle Theme" />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem
            button
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
  onLogout: PropTypes.func.isRequired,
};

export default ProfileSettings;
