import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { socialAPI } from '../services/api';
import { useInfiniteContent } from '../hooks/useInfiniteContent';
import PostCard from '../components/PostCard';
import { SkeletonExplore } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Explore = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized onUpdate callback to prevent unnecessary re-renders
  const handlePostUpdate = useCallback(() => {
    queryClient.refetchQueries({ queryKey: ['explore'], type: 'active' });
  }, [queryClient]);

  // Use infinite content hook - Always enabled, we filter client-side
  const {
    contentItems: exploreItems,
    isLoadingInitial,
    isFetchingNextPage,
    hasNextPage,
    error,
    status,
    refetch,
    observerTarget,
  } = useInfiniteContent(
    'explore',
    (page) => socialAPI.getExplore(page),
    {
      pageSize: 12,
      enabled: true, // Always enabled - filtering happens client-side
      staleTime: 60000, // Consider data fresh for 60 seconds
      cacheTime: 300000, // Keep in cache for 5 minutes
    }
  );

  // Set page title
  useEffect(() => {
    document.title = 'Explore';
  }, []);

  // Listen for content processing completion and refetch cache
  useEffect(() => {
    const handleContentComplete = (event) => {
      const { verificationStatus } = event.detail;
      if (verificationStatus === 'not_applicable') {
        console.log('[Explore] Personal content complete, refetching explore', event.detail);
        // Use refetchQueries to trigger a background refetch while keeping old data visible
        // The placeholderData in useInfiniteContent prevents flickering during refetch
        queryClient.refetchQueries({ queryKey: ['explore'], type: 'active' });
      } else {
        console.log('[Explore] Factual content complete, user must view report', event.detail);
      }
    };

    window.addEventListener('content-processing-complete', handleContentComplete);
    return () => {
      window.removeEventListener('content-processing-complete', handleContentComplete);
    };
  }, [queryClient]);

  // Filter content based on search query
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return exploreItems;
    }

    const query = searchQuery.toLowerCase();
    return exploreItems.filter((item) => {
      const username = item.author?.username?.toLowerCase() || '';
      const fullName = item.author?.full_name?.toLowerCase() || '';
      const caption = item.caption?.toLowerCase() || '';

      return (
        username.includes(query) ||
        fullName.includes(query) ||
        caption.includes(query)
      );
    });
  }, [searchQuery, exploreItems]);

  // Prevent infinite scroll when searching
  const shouldShowInfiniteScroll = !searchQuery && hasNextPage;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoadingInitial) {
    return <SkeletonExplore />;
  }

  if (status === 'error') {
    return (
      <Box sx={{ width: '100%' }}>
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
          title="Couldn't Load Content"
          description={error?.response?.data?.error || 'Failed to load content'}
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      </Box>
    );
  }

  if (exploreItems.length === 0 && !searchQuery) {
    return (
      <Box sx={{ width: '100%' }}>
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
          title="No Content to Explore"
          description="Check back later for trending verified content from the community"
          actionLabel="Refresh"
          onAction={() => refetch()}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 3 }}>
      {/* Search Bar */}
      <Box
        sx={{
          my: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', md: '60%' },
            mx: 'auto',
          }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by username or content..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: 'text.disabled',
                      fontSize: '1.125rem',
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={clearSearch}
                    size="small"
                    sx={{
                      color: 'text.disabled',
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'error.contrastText',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-out',
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '9999px',
                bgcolor: 'background.default',
                borderWidth: 2,
                transition: 'all 0.2s ease-out',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  bgcolor: 'background.paper',
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper',
                  boxShadow: (theme) =>
                    `0 0 0 4px ${theme.palette.primary.main}1A, 0 2px 8px rgba(255, 112, 67, 0.15)`,
                },
                '& fieldset': {
                  borderWidth: 2,
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'divider',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                padding: { xs: '10px 14px', sm: '12px 16px' },
                '&::placeholder': {
                  color: 'text.disabled',
                  opacity: 1,
                },
              },
            }}
          />
          {searchQuery && (
            <Typography
              variant="body2"
              sx={{
                marginTop: 1.25,
                fontSize: '0.875rem',
                color: 'text.secondary',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              Found {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Search Results / Content Grid */}
      {searchQuery && filteredContent.length === 0 ? (
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
          title="No Results Found"
          description={`No content found for "${searchQuery}". Try searching with different keywords.`}
          actionLabel="Clear Search"
          onAction={clearSearch}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'repeat(auto-fill, minmax(240px, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            maxWidth: { lg: 1200 },
            margin: { lg: '0 auto' },
          }}
        >
          {filteredContent.map((item) => (
            <PostCard
              key={`${item.type}-${item.id}`}
              item={item}
              type={item.type}
              onUpdate={handlePostUpdate}
            />
          ))}
        </Box>
      )}

      {/* Infinite scroll trigger - Only show when not searching */}
      {shouldShowInfiniteScroll && (
        <Box
          ref={observerTarget}
          sx={{
            minHeight: '100px',
            padding: '2rem 0',
            textAlign: 'center',
          }}
        />
      )}
    </Box>
  );
};

export default Explore;
