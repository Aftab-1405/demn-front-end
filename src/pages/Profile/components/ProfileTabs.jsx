import PropTypes from 'prop-types';
import { Box, Tabs, Tab } from '@mui/material';

const ProfileTabs = ({ activeTab, onChange }) => {
  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        marginTop: 1.5,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={onChange}
        centered
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTab-root': {
            minHeight: 48,
            padding: '8px 0',
            marginTop: '-1px',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
            color: 'text.secondary',
            borderTop: '2px solid transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'text.primary',
            },
            '&.Mui-selected': {
              color: 'text.primary',
              borderTopColor: 'text.primary',
            },
          },
        }}
      >
        <Tab label="POSTS" value="posts" />
        <Tab label="REELS" value="reels" />
      </Tabs>
    </Box>
  );
};

ProfileTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProfileTabs;
