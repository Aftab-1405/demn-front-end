import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';
import PostCard from '../../../components/PostCard';
import EmptyState from '../../../components/EmptyState';

const ContentGrid = ({
  isLoading,
  content,
  searchResults,
  activeTab,
  onPostUpdate,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(220px, 1fr))' },
        gap: { xs: 2, sm: 3 },
        width: '100%',
        marginTop: 3.75,
      }}
    >
      {isLoading ? (
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
              onUpdate={onPostUpdate}
            />
          );
        })
      )}
    </Box>
  );
};

ContentGrid.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  content: PropTypes.array.isRequired,
  searchResults: PropTypes.any,
  activeTab: PropTypes.string.isRequired,
  onPostUpdate: PropTypes.func.isRequired,
};

export default ContentGrid;
