import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  Stack,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
  keyframes,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import PostCard from '../../components/PostCard';
import ProfileHeader from './components/ProfileHeader';
import ProfileSettings from './components/ProfileSettings';
import TypeWriter from '../../components/TypeWriter';
import EmptyState from '../../components/EmptyState';
import { SkeletonProfile } from '../../components/Skeleton';
import { compressProfilePicture } from '../../utils/imageCompression';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showSnackbar } = useNotifications();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // Debug: Log username parameter and validate
  useEffect(() => {
    if (username && username !== 'undefined' && username !== 'null') {
      console.log('[Profile] Loading profile for username:', username);
    } else {
      console.error('[Profile] Invalid username parameter in URL:', username);
    }
  }, [username]);

  const [activeTab, setActiveTab] = useState('posts');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef(null);

  // AI Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [aiNarration, setAiNarration] = useState('');
  const [, setResultDetails] = useState(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  // --- REACT QUERY HOOKS ---

  // 1. Fetch User Profile
  const {
    data: user,
    isLoading: userLoading,
    error: userError
  } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      if (!username || username === 'undefined' || username === 'null') {
        throw new Error('Username is required');
      }
      try {
        console.log('[Profile] Fetching user profile for:', username);
        const res = await usersAPI.getUserProfile(username);
        console.log('[Profile] Profile response:', res.data);
        if (!res.data?.user) {
          throw new Error('Invalid response: user data not found');
        }
        return res.data.user;
      } catch (error) {
        console.error('[Profile] Error fetching profile:', error);
        // Re-throw with more context
        if (error.response?.status === 404) {
          throw new Error('User not found');
        }
        throw error;
      }
    },
    enabled: !!username && username !== 'undefined' && username !== 'null', // Only fetch if username is valid
    placeholderData: keepPreviousData, // React Query v5: Keep previous data while fetching to prevent flash
    retry: (failureCount, error) => {
      // Don't retry on 404 (user not found) or if username is missing
      if (error.response?.status === 404 || error.message === 'Username is required') {
        return false;
      }
      return failureCount < 2;
    },
  });

  // 2. Fetch User Posts
  const {
    data: posts = [],
    isLoading: postsLoading
  } = useQuery({
    queryKey: ['posts', username],
    queryFn: async () => {
      const res = await usersAPI.getUserPosts(username);
      return res.data.posts;
    },
    enabled: !!user, // Only fetch if user exists
  });

  // 3. Fetch User Reels
  const {
    data: reels = [],
    isLoading: reelsLoading
  } = useQuery({
    queryKey: ['reels', username],
    queryFn: async () => {
      const res = await usersAPI.getUserReels(username);
      return res.data.reels;
    },
    enabled: !!user,
  });

  // Mutation for Profile Picture
  const uploadPictureMutation = useMutation({
    mutationFn: usersAPI.uploadProfilePicture,
    onSuccess: (response) => {
      // Backend returns: { user: {...}, profile_picture: "..." }
      const updatedUser = response.data.user || response.data;

      // Update React Query Cache
      queryClient.setQueryData(['user', username], updatedUser);

      // Update Auth Context if it's the logged-in user - use full updated user object
      if (isOwnProfile && updatedUser) {
        // Use the complete updated user object to ensure all fields are preserved
        updateUser(updatedUser);
      }
      showSnackbar('Profile picture updated! ✨', 'success');
      setUploadingPicture(false);
    },
    onError: (err) => {
      const msg = err.response?.data?.error || 'Failed to upload picture';
      showSnackbar(msg, 'error');
      setUploadingPicture(false);
    }
  });

  // --- EFFECTS ---

  // Set page title
  useEffect(() => {
    if (user) {
      document.title = `${user.username} - D.E.M.N`;
    } else {
      document.title = 'Profile';
    }
  }, [user]);

  // Listen for content processing completion (Refetch personal content)
  useEffect(() => {
    const handleContentComplete = (event) => {
      const { verificationStatus } = event.detail;
      if (verificationStatus === 'not_applicable') {
        console.log('[Profile] Content processed, refreshing profile data...');
        queryClient.invalidateQueries(['posts', username]);
        queryClient.invalidateQueries(['reels', username]);
        queryClient.invalidateQueries(['user', username]); // Update counts
      }
    };

    window.addEventListener('content-processing-complete', handleContentComplete);
    return () => window.removeEventListener('content-processing-complete', handleContentComplete);
  }, [queryClient, username]);

  // Auto-dismiss AI response after 15 seconds of typing completion
  useEffect(() => {
    if (typingComplete && aiNarration && searchResults !== null) {
      const timer = setTimeout(() => {
        // Show dismiss message
        showSnackbar('Enjoy your content 🤗', 'success', { duration: 3000 });
        
        // Start fade-out animation
        setIsDismissing(true);
        
        // Clear AI response after fade-out animation
        setTimeout(() => {
          setAiNarration('');
          setSearchResults(null);
          setResultDetails(null);
          setTypingComplete(false);
          setIsDismissing(false);
        }, 500);
      }, 15000); // 15 seconds after typing completes

      return () => clearTimeout(timer);
    }
  }, [typingComplete, aiNarration, searchResults, showSnackbar]);

  // --- HANDLERS ---

  const handleFollowChange = (newIsFollowing, newCount) => {
    // Optimistically update the user cache
    queryClient.setQueryData(['user', username], (oldUser) => ({
      ...oldUser,
      is_following: newIsFollowing,
      followers_count: newCount
    }));
  };

  const handleProfileUpdated = (updatedUser) => {
    // Update cache and context
    queryClient.setQueryData(['user', username], updatedUser);
    if (currentUser?.id === updatedUser.id) {
      updateUser(updatedUser);
    }
  };

  const handleProfilePictureClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showSnackbar('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Image size must be less than 5MB', 'error');
      return;
    }

    setUploadingPicture(true);

    try {
      const compressedFile = await compressProfilePicture(file);

      const formData = new FormData();
      formData.append('profile_picture', compressedFile);

      // Trigger mutation
      uploadPictureMutation.mutate(formData);
    } catch (err) {
      console.error('Compression error:', err);
      showSnackbar('Failed to process image.', 'error');
      setUploadingPicture(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError('');
    setSearchResults(null);

    try {
      const response = await usersAPI.aiSearchPosts(username, searchQuery);
      setSearchResults(response.data.results);
      setAiNarration(response.data.narration || '');
      setResultDetails(response.data.result_details || null);
      setTypingComplete(false);
    } catch (err) {
      console.error('AI Search failed:', err);
      setSearchError(err.response?.data?.error || 'Failed to search.');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError('');
    setAiNarration('');
    setResultDetails(null);
    setTypingComplete(false);
  };

  // Settings handlers
  const handleSettingsOpen = useCallback(() => setIsSettingsOpen(true), []);
  const handleSettingsClose = useCallback(() => setIsSettingsOpen(false), []);
  const handleLogout = useCallback(() => {
    logout();
    setIsSettingsOpen(false);
  }, [logout]);
  const handleThemeToggle = useCallback(() => {
    toggleTheme();
    setIsSettingsOpen(false);
  }, [toggleTheme]);

  // --- RENDER HELPERS ---

  // Animation keyframes
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

  // Memoize content to prevent unnecessary re-renders while typing
  // IMPORTANT: All hooks must be called before any conditional returns
  const showResults = useMemo(() => {
    return searchResults !== null ? (aiNarration ? typingComplete : true) : false;
  }, [searchResults, aiNarration, typingComplete]);
  
  const content = useMemo(() => {
    return showResults ? searchResults : (activeTab === 'posts' ? posts : reels);
  }, [showResults, searchResults, activeTab, posts, reels]);
  
  const isLoadingContent = useMemo(() => {
    // Only show loading if we're actually loading content, not when typing
    if (searchResults !== null) {
      return false; // Don't show loading for search results
    }
    return activeTab === 'posts' ? postsLoading : reelsLoading;
  }, [searchResults, activeTab, postsLoading, reelsLoading]);

  // Memoize the onUpdate callback to prevent PostCard re-renders
  const handlePostUpdate = useCallback(() => {
    queryClient.invalidateQueries(['posts', username]);
  }, [queryClient, username]);

  // Show error only if it's a real error (not just loading)
  if (userError && !userLoading) {
    const isNotFound = userError.response?.status === 404 || 
                       userError.message === 'User not found' ||
                       (userError.response?.data?.error && userError.response.data.error.includes('not found'));
    
    if (isNotFound || !user) {
      return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, sm: 3 } }}>
          <EmptyState
            title="User not found"
            description="The user you are looking for does not exist or has been removed."
            actionLabel="Go Home"
            actionLink="/"
          />
        </Box>
      );
    }
    
    // For other errors, show error message
    return (
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, sm: 3 } }}>
        <EmptyState
          title="Error loading profile"
          description={userError.response?.data?.error || userError.message || 'Failed to load user profile'}
          actionLabel="Try Again"
          onAction={() => window.location.reload()}
        />
      </Box>
    );
  }
  
  // If still loading, show skeleton
  if (userLoading || !user) {
    return <SkeletonProfile />;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, sm: 3 } }}>
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        isMobile={isMobile}
        uploadingPicture={uploadingPicture}
        fileInputRef={fileInputRef}
        onProfilePictureClick={handleProfilePictureClick}
        onProfilePictureChange={handleProfilePictureChange}
        onFollowChange={handleFollowChange}
        onSettingsOpen={handleSettingsOpen}
      />

      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          marginTop: 1.5,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
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

       {/* AI Search Section */}
       <Box
         sx={{
           width: { xs: '100%', md: '65%' },
           maxWidth: { md: 'none' },
           margin: { xs: '0', md: '0 auto' },
           marginTop: 2,
           marginBottom: 1.5,
         }}
       >
         <Card
           sx={{
             bgcolor: 'background.paper',
             borderRadius: 1.5,
             padding: 1.5,
             boxShadow: (theme) => 
               theme.palette.mode === 'dark' 
                 ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                 : '0 2px 8px rgba(0, 0, 0, 0.08)',
             border: 1,
             borderColor: 'divider',
             transition: 'all 0.3s ease',
             '&:hover': {
               boxShadow: (theme) => 
                 theme.palette.mode === 'dark' 
                   ? '0 4px 16px rgba(0, 0, 0, 0.4)' 
                   : '0 4px 16px rgba(0, 0, 0, 0.12)',
             },
           }}
         >
           <Box
             component="form"
             onSubmit={handleAISearch}
             sx={{
               display: 'flex',
               alignItems: 'center',
             }}
           >
           <Box sx={{ position: 'relative', flex: 1, width: '100%' }}>
             <TextField
               fullWidth
               placeholder="Search posts with AI..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               disabled={searching}
               size="small"
               InputProps={{
                 startAdornment: (
                   <InputAdornment position="start">
                     <SearchIcon 
                       sx={{ 
                         color: 'text.secondary', 
                         fontSize: 18,
                         transition: 'color 0.2s ease',
                       }} 
                     />
                   </InputAdornment>
                 ),
                 endAdornment: (
                   <InputAdornment position="end" sx={{ marginRight: 0.5 }}>
                     <Tooltip 
                       title={searching ? 'Searching with AI...' : 'Search with AI'} 
                       arrow
                       placement="top"
                     >
                       <span>
                         <IconButton
                           type="submit"
                           disabled={searching || !searchQuery.trim()}
                           sx={{
                             bgcolor: 'primary.main',
                             color: 'primary.contrastText',
                             width: 32,
                             height: 32,
                             minWidth: 32,
                             borderRadius: '50%',
                             boxShadow: (theme) => 
                               `0 2px 6px ${theme.palette.primary.main}40`,
                             '&:hover': {
                               bgcolor: 'primary.dark',
                               transform: 'scale(1.05)',
                               boxShadow: (theme) => 
                                 `0 3px 10px ${theme.palette.primary.main}50`,
                             },
                             '&:active': {
                               transform: 'scale(0.95)',
                             },
                             '&:disabled': {
                               bgcolor: 'action.disabledBackground',
                               color: 'action.disabled',
                               boxShadow: 'none',
                               opacity: 0.6,
                             },
                             transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                           }}
                         >
                           {searching ? (
                             <CircularProgress 
                               size={14} 
                               sx={{ 
                                 color: 'inherit',
                               }} 
                             />
                           ) : (
                             <AutoAwesomeIcon 
                               sx={{ 
                                 fontSize: 16,
                               }} 
                             />
                           )}
                         </IconButton>
                       </span>
                     </Tooltip>
                   </InputAdornment>
                 ),
               }}
               sx={{
                 '& .MuiOutlinedInput-root': {
                   fontSize: '0.875rem',
                   borderRadius: 1.5,
                   paddingRight: 0,
                   '& fieldset': {
                     borderWidth: 1.5,
                     borderColor: 'divider',
                   },
                   '&:hover fieldset': {
                     borderColor: 'primary.main',
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: 'primary.main',
                     borderWidth: 1.5,
                     boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}20`,
                   },
                   '&.Mui-disabled': {
                     bgcolor: 'action.disabledBackground',
                   },
                 },
               }}
             />
           </Box>
         </Box>

        {searchError && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {searchError}
          </Alert>
        )}

        {searchResults !== null && aiNarration && (
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              alignItems: 'flex-start',
              padding: 1.5,
              marginTop: 1.25,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: '9px',
              boxShadow: 1,
              opacity: isDismissing ? 0 : 1,
              transform: isDismissing ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'all 0.5s ease-out',
              pointerEvents: isDismissing ? 'none' : 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.125,
                alignItems: 'flex-start',
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  flexShrink: 0,
                  marginTop: 0.5,
                  width: 18,
                  height: 18,
                  color: 'primary.main',
                }}
              />
              <TypeWriter text={aiNarration} onComplete={() => setTypingComplete(true)} />
             </Box>
           </Card>
         )}
       </Card>
       </Box>

      {/* Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(220px, 1fr))' },
          gap: { xs: 2, sm: 3 },
          width: '100%',
          marginTop: 3.75,
        }}
      >
        {isLoadingContent ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              gridColumn: '1 / -1',
            }}
          >
            <CircularProgress size={48} thickness={4} />
          </Box>
        ) : content.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <EmptyState
              title={searchResults ? "No Results Found" : `No ${activeTab} Yet`}
              description={searchResults ? "Try a different query." : "Share your first post!"}
            />
          </Box>
        ) : (
          content.map((item) => {
            // Memoize type calculation to prevent unnecessary re-renders
            const itemType = item.video_url ? 'reel' : 'post';
            return (
              <PostCard
                key={item.id}
                item={item}
                type={itemType}
                onUpdate={handlePostUpdate}
              />
            );
          })
        )}
      </Box>

      {/* Settings Drawer - Mobile Only */}
      <ProfileSettings
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      />
    </Box>
  );
};

export default Profile;