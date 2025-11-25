import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/material';
import FollowButton from '../../../components/FollowButton';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileHeader = ({
  user,
  isOwnProfile,
  isMobile,
  uploadingPicture,
  fileInputRef,
  onProfilePictureClick,
  onProfilePictureChange,
  onFollowChange,
  onSettingsOpen,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, sm: 2.5, md: 3 },
        padding: { xs: 2, sm: 2.25 },
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
        animation: `${fadeInUp} 0.5s ease`,
      }}
    >
      {/* Profile Picture */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: 80, sm: 90 },
          height: { xs: 80, sm: 90 },
          borderRadius: '50%',
          '&:hover .profile-picture-overlay': {
            opacity: isOwnProfile ? 1 : 0,
          },
        }}
      >
        <Avatar
          src={user.profile_picture ? `${import.meta.env.VITE_BACKEND_URL || ''}${user.profile_picture}` : undefined}
          alt={user.username}
          onClick={onProfilePictureClick}
          sx={{
            width: { xs: 80, sm: 90 },
            height: { xs: 80, sm: 90 },
            border: 2,
            borderColor: 'primary.main',
            boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.light}40`,
            cursor: isOwnProfile ? 'pointer' : 'default',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: isOwnProfile ? 'scale(1.08) rotate(3deg)' : 'none',
              boxShadow: (theme) => `0 12px 32px ${theme.palette.primary.light}60`,
            },
          }}
        >
          {!user.profile_picture && user.username?.[0]?.toUpperCase()}
        </Avatar>
        {isOwnProfile && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onProfilePictureChange}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Change Profile Picture"
            />
            <Box
              className="profile-picture-overlay"
              onClick={onProfilePictureClick}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer',
              }}
            >
              {uploadingPicture ? (
                <Box
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.625,
                  }}
                >
                  Uploading...
                </Box>
              ) : (
                <Box
                  sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.625,
                  }}
                >
                  <UploadIcon sx={{ width: 16, height: 16 }} />
                  <Typography component="span" sx={{ fontSize: '10px' }}>
                    Change
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Profile Info */}
      <Box sx={{ minWidth: 256, flex: 1 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          sx={{ marginBottom: { xs: 1, sm: 1.5 } }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.3rem' },
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-0.4px',
              lineHeight: 1.2,
            }}
          >
            {user.username}
          </Typography>
          {!isOwnProfile && (
            <FollowButton
              username={user.username}
              initialIsFollowing={user.is_following || false}
              initialFollowersCount={user.followers_count}
              onFollowChange={onFollowChange}
            />
          )}
          {isOwnProfile && isMobile && (
            <IconButton
              onClick={onSettingsOpen}
              aria-label="Settings"
              sx={{
                ml: 1,
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          )}
        </Stack>

        {/* Stats */}
        <Stack
          direction="row"
          spacing={{ xs: 2, sm: 2.5 }}
          sx={{
            marginBottom: { xs: 1.25, sm: 2 },
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Box
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.8438rem' },
              fontWeight: 500,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.5, sm: 0.75 },
              transition: 'all 0.2s ease',
              letterSpacing: '0.2px',
              cursor: 'pointer',
              '&:hover': {
                color: 'text.primary',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography component="strong" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.0625rem' }, color: 'text.primary', display: 'block' }}>
              {user.posts_count}
            </Typography>
            <Typography component="span" sx={{ fontSize: 'inherit' }}>posts</Typography>
          </Box>
          <Box
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.8438rem' },
              fontWeight: 500,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.5, sm: 0.75 },
              transition: 'all 0.2s ease',
              letterSpacing: '0.2px',
              cursor: 'pointer',
              '&:hover': {
                color: 'text.primary',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography component="strong" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.0625rem' }, color: 'text.primary', display: 'block' }}>
              {user.followers_count}
            </Typography>
            <Typography component="span" sx={{ fontSize: 'inherit' }}>followers</Typography>
          </Box>
          <Box
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.8438rem' },
              fontWeight: 500,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.5, sm: 0.75 },
              transition: 'all 0.2s ease',
              letterSpacing: '0.2px',
              cursor: 'pointer',
              '&:hover': {
                color: 'text.primary',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography component="strong" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.0625rem' }, color: 'text.primary', display: 'block' }}>
              {user.following_count}
            </Typography>
            <Typography component="span" sx={{ fontSize: 'inherit' }}>following</Typography>
          </Box>
        </Stack>

        {user.full_name && (
          <Typography sx={{ fontWeight: 600, marginBottom: 0.5, color: 'text.primary' }}>
            {user.full_name}
          </Typography>
        )}
        {user.bio && (
          <Typography
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.8438rem' },
              color: 'text.secondary',
              lineHeight: 1.8,
              maxWidth: { xs: '100%', sm: 420 },
              marginTop: { xs: 0.75, sm: 1.25 },
              fontWeight: 400,
              letterSpacing: '0.1px',
            }}
          >
            {user.bio}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile_picture: PropTypes.string,
    posts_count: PropTypes.number.isRequired,
    followers_count: PropTypes.number.isRequired,
    following_count: PropTypes.number.isRequired,
    full_name: PropTypes.string,
    bio: PropTypes.string,
    is_following: PropTypes.bool,
  }).isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  uploadingPicture: PropTypes.bool.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  onProfilePictureClick: PropTypes.func.isRequired,
  onProfilePictureChange: PropTypes.func.isRequired,
  onFollowChange: PropTypes.func.isRequired,
  onSettingsOpen: PropTypes.func.isRequired,
};

export default ProfileHeader;
