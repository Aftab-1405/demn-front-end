import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Link,
  CircularProgress,
} from '@mui/material';
import { socialAPI, postsAPI, reelsAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { useInfiniteContent } from '../hooks/useInfiniteContent';
import useLocalStorage from '../hooks/useLocalStorage';
import PostCard from '../components/PostCard';
import { SkeletonFeed } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import AIConsentModal from '../components/AIConsentModal';
import ProcessingTracker from '../components/ProcessingTracker';

const Feed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useNotifications();
  const [aiConsentGiven, setAiConsentGiven] = useLocalStorage('ai_consent_given', false);
  const [aiConsentDate, setAiConsentDate] = useLocalStorage('ai_consent_date', null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Use infinite content hook
  const {
    contentItems: feedItems,
    isLoadingInitial,
    isFetchingNextPage,
    hasNextPage,
    error,
    status,
    refetch,
    observerTarget,
    queryClient,
  } = useInfiniteContent(
    'feed',
    (page) => socialAPI.getFeed(page),
    { pageSize: 12 }
  );

  // Set page title
  useEffect(() => {
    document.title = 'Feed';
  }, []);

  // Check if user has consented to AI usage
  useEffect(() => {
    if (!aiConsentGiven) {
      setShowConsentModal(true);
    }
  }, [aiConsentGiven]);

  const handleConsentAccept = () => {
    setAiConsentGiven(true);
    setAiConsentDate(new Date().toISOString());
    setShowConsentModal(false);
    showSnackbar('Thank you! You can now enjoy all AI-powered features.', 'success');
  };

  const handlePostUpdate = useCallback(() => {
    // Use refetchQueries instead of invalidateQueries to prevent content flickering
    // The placeholderData in useInfiniteContent will keep old data visible during refetch
    queryClient.refetchQueries({ queryKey: ['feed'], type: 'active' });
  }, [queryClient]);

  const syncPersonalContent = useCallback(async (contentId, contentType) => {
    if (!contentId || !contentType) {
      return;
    }

    // OPTIMISTIC UPDATE: Check if we have stored post/reel data from creation
    const storageKey = `pending_${contentType}_${contentId}`;
    const storedData = sessionStorage.getItem(storageKey);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const normalizedItem = { ...parsedData, type: contentType, verification_status: 'not_applicable' };

        // INSTANT UI UPDATE - Add to feed cache immediately
        queryClient.setQueryData(['feed'], (current) => {
          if (!current || !Array.isArray(current.pages) || current.pages.length === 0) {
            return current;
          }

          const alreadyExists = current.pages.some(
            (page) => Array.isArray(page.feed) && page.feed.some((item) => item.id === normalizedItem.id && item.type === normalizedItem.type)
          );

          if (alreadyExists) {
            return current;
          }

          const firstPage = current.pages[0] || {};
          const firstFeed = Array.isArray(firstPage.feed) ? firstPage.feed : [];
          const pageLimit = Math.max(firstFeed.length || 0, 12);

          const updatedFirstFeed = [normalizedItem, ...firstFeed].filter((item, index, arr) => {
            return arr.findIndex((entry) => entry.id === item.id && entry.type === item.type) === index;
          }).slice(0, pageLimit);

          const updatedPages = [
            { ...firstPage, feed: updatedFirstFeed },
            ...current.pages.slice(1)
          ];

          return {
            ...current,
            pages: updatedPages
          };
        });

        // Clean up stored data
        sessionStorage.removeItem(storageKey);

        // Fetch full data in background to ensure accuracy
        setTimeout(async () => {
          try {
            const response = contentType === 'post'
              ? await postsAPI.getPost(contentId)
              : await reelsAPI.getReel(contentId);

            const payload = response?.data?.post || response?.data?.reel;
            if (payload) {
              const normalizedItem = { ...payload, type: contentType };
              queryClient.setQueryData(['feed'], (current) => {
                if (!current?.pages?.length) return current;

                const updatedPages = current.pages.map((page) => {
                  if (!Array.isArray(page.feed)) return page;
                  const updatedFeed = page.feed.map((item) =>
                    item.id === normalizedItem.id && item.type === normalizedItem.type ? normalizedItem : item
                  );
                  return { ...page, feed: updatedFeed };
                });

                return { ...current, pages: updatedPages };
              });
            }
          } catch (err) {
            console.error('[Feed] Background sync failed:', err);
          }
        }, 100);

        return;
      } catch (parseErr) {
        console.error('[Feed] Failed to parse stored data:', parseErr);
        sessionStorage.removeItem(storageKey);
      }
    }

    // Fallback: Fetch from API if no stored data
    try {
      const response = contentType === 'post'
        ? await postsAPI.getPost(contentId)
        : await reelsAPI.getReel(contentId);

      const payload = response?.data?.post || response?.data?.reel;
      if (!payload) {
        throw new Error('Missing content payload');
      }

      const normalizedItem = { ...payload, type: contentType };

      queryClient.setQueryData(['feed'], (current) => {
        if (!current || !Array.isArray(current.pages) || current.pages.length === 0) {
          return current;
        }

        const alreadyExists = current.pages.some(
          (page) => Array.isArray(page.feed) && page.feed.some((item) => item.id === normalizedItem.id && item.type === normalizedItem.type)
        );

        if (alreadyExists) {
          return current;
        }

        const firstPage = current.pages[0] || {};
        const firstFeed = Array.isArray(firstPage.feed) ? firstPage.feed : [];
        const pageLimit = Math.max(firstFeed.length || 0, 12);

        const updatedFirstFeed = [normalizedItem, ...firstFeed].filter((item, index, arr) => {
          return arr.findIndex((entry) => entry.id === item.id && entry.type === item.type) === index;
        }).slice(0, pageLimit);

        const updatedPages = [
          { ...firstPage, feed: updatedFirstFeed },
          ...current.pages.slice(1)
        ];

        return {
          ...current,
          pages: updatedPages
        };
      });
    } catch (error) {
      console.error('[Feed] Failed to sync personal content', error);
      // Use refetchQueries instead of invalidateQueries to prevent flickering
      queryClient.refetchQueries({ queryKey: ['feed'], type: 'active' });
    }
  }, [queryClient]);

  // Refetch feed when navigating back to this page with refresh state
  useEffect(() => {
    if (location.state?.refresh) {
      refetch();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refresh, refetch, navigate, location.pathname]);

  // Listen for content processing completion
  useEffect(() => {
    const handleContentComplete = (event) => {
      const { verificationStatus, contentId, contentType } = event.detail || {};
      
      if (verificationStatus === 'not_applicable') {
        console.log('[Feed] Personal content complete, syncing feed immediately');
        syncPersonalContent(contentId, contentType);
      } else {
        const storageKey = `pending_${contentType}_${contentId}`;
        sessionStorage.removeItem(storageKey);
        console.log('[Feed] Factual content detected - requires user action in fact-check dashboard');
      }
    };

    window.addEventListener('content-processing-complete', handleContentComplete);
    return () => {
      window.removeEventListener('content-processing-complete', handleContentComplete);
    };
  }, [syncPersonalContent]);

  if (isLoadingInitial) {
    return <SkeletonFeed />;
  }

  if (status === 'error') {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
          title="Oops! Something went wrong"
          description={error?.response?.data?.error || 'Failed to load feed'}
          actionLabel="Try Again"
          onAction={() => refetch()}
        />
      </Box>
    );
  }

  if (feedItems.length === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          }
          title="Your Feed is Empty"
          description="Start exploring and following other users to see their content here."
          actionLabel="Explore Users"
          actionLink="/explore"
        />
      </Box>
    );
  }

  const sidebarProfiles = (() => {
    const seen = new Set();
    const profiles = [];
    feedItems.forEach((item) => {
      const username = item.author?.username;
      if (!username || seen.has(username)) return;
      seen.add(username);
      profiles.push({
        username,
        name: item.author?.full_name || username,
        avatar: item.author?.profile_picture,
      });
    });
    return profiles.slice(0, 5);
  })();

  return (
    <>
      <AIConsentModal isOpen={showConsentModal} onAccept={handleConsentAccept} />
      <Box
        sx={{
          width: '100%',
          p: { xs: 2, md: 3, lg: 3 },
        }}
      >
        {/* Processing Tracker - Mobile (floating) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1400,
            display: { xs: 'block', lg: 'none' },
          }}
        >
          <ProcessingTracker />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            display: { xs: 'flex', lg: 'grid' },
            flexDirection: { xs: 'column', lg: 'row' },
            gridTemplateColumns: { lg: 'minmax(0, 1fr) 320px' },
            gap: { xs: 3, lg: 4 },
            alignItems: 'start',
          }}
        >
          {/* Main Feed Section */}
          <Box
            component="section"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: 480, lg: 500 },
              mx: { xs: 'auto', lg: 0 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr)' },
                gap: 2,
              }}
            >
              {feedItems.map((item) => (
                <PostCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  type={item.type}
                  onUpdate={handlePostUpdate}
                />
              ))}
            </Box>

            {hasNextPage && (
              <Box
                ref={observerTarget}
                sx={{
                  py: 4,
                  textAlign: 'center',
                }}
              >
                {isFetchingNextPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={48} thickness={4} />
                  </Box>
                )}
              </Box>
            )}

            {!hasNextPage && feedItems.length > 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 3,
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You&apos;ve reached the end!
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box
            component="aside"
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'sticky',
              top: 90,
              pt: 3,
            }}
          >
            {/* Processing Tracker - Desktop (sidebar) */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                pb: 2,
              }}
            >
              <ProcessingTracker />
            </Box>

            <Card
              sx={{
                bgcolor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                boxShadow: 1,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontSize: '1rem', m: 0 }}>
                  Suggested for you
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    minWidth: 'auto',
                    p: 0.5,
                  }}
                >
                  See all
                </Button>
              </Box>

              <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {sidebarProfiles.map((profile) => (
                  <Box
                    key={profile.username}
                    component="li"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Avatar
                      src={profile.avatar}
                      alt={profile.username}
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'background.default',
                        fontWeight: 600,
                      }}
                    >
                      {!profile.avatar && profile.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        component="strong"
                        sx={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        @{profile.username}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                        }}
                      >
                        {profile.name}
                      </Typography>
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/profile/${profile.username}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      View
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Card>

            <Box
              sx={{
                mt: 2,
                fontSize: '0.75rem',
                color: 'text.disabled',
              }}
            >
              <Typography variant="caption" color="text.disabled">
                © {new Date().getFullYear()} D.E.M.N
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href="/"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  Help
                </Link>
                <Link
                  href="/"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    '&:hover': {
                      color: 'text.secondary',
                    },
                  }}
                >
                  Privacy
                </Link>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Feed;
