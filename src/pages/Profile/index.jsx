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
import ProfileHeader from './components/ProfileHeader';
import ProfileSettings from './components/ProfileSettings';
import ProfileTabs from './components/ProfileTabs';
import AISearchSection from './components/AISearchSection';
import ContentGrid from './components/ContentGrid';
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

      <ProfileTabs
        activeTab={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
      />

      {isOwnProfile && (
        <AISearchSection
          searchQuery={searchQuery}
          searching={searching}
          searchError={searchError}
          searchResults={searchResults}
          aiNarration={aiNarration}
          isDismissing={isDismissing}
          typingComplete={typingComplete}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={handleAISearch}
          onTypingComplete={() => setTypingComplete(true)}
        />
      )}

      <ContentGrid
        isLoading={isLoadingContent}
        content={content}
        searchResults={searchResults}
        activeTab={activeTab}
        onPostUpdate={handlePostUpdate}
      />

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