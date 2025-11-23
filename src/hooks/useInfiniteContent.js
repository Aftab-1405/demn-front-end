import { useEffect, useRef, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';

/**
 * Custom hook for infinite scroll content (Feed and Explore)
 * Consolidates all infinite scroll logic
 * 
 * @param {string} queryKey - React Query key (e.g., 'feed' or 'explore')
 * @param {function} fetchFn - Function to fetch content (pageParam) => Promise
 * @param {object} options - Additional options
 */
export const useInfiniteContent = (queryKey, fetchFn, options = {}) => {
  const {
    enabled = true,
    staleTime = 30000,
    cacheTime = 300000,
    pageSize = 12,
    rootMargin = '400px 0px',
    threshold = 0.1,
  } = options;

  const queryClient = useQueryClient();
  const observerTarget = useRef(null);

  // React Query for Infinite Scroll
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchFn(pageParam);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const contentKey = queryKey === 'feed' ? 'feed' : 'explore';
      const fetchedContent = lastPage[contentKey] || [];
      return fetchedContent.length === pageSize ? allPages.length + 1 : undefined;
    },
    staleTime,
    gcTime: cacheTime, // React Query v5: renamed from cacheTime
    placeholderData: keepPreviousData, // React Query v5: keeps old data visible during refetch to prevent flickering
    enabled,
  });

  // Derive content items from React Query data with stable references
  const contentItems = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) {
      return [];
    }
    const contentKey = queryKey === 'feed' ? 'feed' : 'explore';
    return data.pages.flatMap((page) => page?.[contentKey] || []);
  }, [data, queryKey]);

  // Infinite scroll observer
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { 
        threshold,
        rootMargin
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, enabled, threshold, rootMargin]);

  // Prefetch next page when user is scrolling near bottom
  // NOTE: This is disabled by default to prevent aggressive fetching
  // Components can enable it via options if needed
  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage || !data?.pages?.length) return;
    
    // Only prefetch if explicitly enabled in options
    if (!options.enableScrollPrefetch) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - scrollPosition;

      // Prefetch when user is within 600px of bottom
      if (distanceFromBottom < 600 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data, enabled, options.enableScrollPrefetch]);

  // Loading state
  const isLoadingInitial = status === 'loading' || (isFetching && contentItems.length === 0);

  return {
    // Data
    contentItems,
    data,
    
    // Loading states
    isLoadingInitial,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    
    // Error
    error,
    status,
    
    // Actions
    fetchNextPage,
    refetch,
    
    // Refs
    observerTarget,
    
    // Query client (for cache updates)
    queryClient,
  };
};

