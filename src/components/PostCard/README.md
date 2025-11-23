# PostCard Component - Modular Structure

This folder contains the refactored PostCard component broken down into logical, maintainable modules.

## Structure

```
PostCard/
├── index.jsx                   # Main PostCard component
├── FactCheckModal.jsx          # Fact-check details modal with reader themes
├── PostModal.jsx               # Full-size post/reel view modal
├── PostOptionsModal.jsx        # Options menu (delete, share, report, etc.)
├── DeleteConfirmModal.jsx      # Delete confirmation dialog
└── README.md                   # This file
```

## Components

### `index.jsx` (Main Component)
- **Purpose**: Core PostCard UI with header, media, actions, and captions
- **Responsibilities**:
  - Renders post/reel card layout
  - Handles like/unlike logic with optimistic updates
  - Manages modal state
  - Contains styled components for the card
- **Key Features**:
  - Memoized with custom comparison function to prevent unnecessary re-renders
  - Responsive design
  - Smooth animations with framer-motion
  - Interactive action buttons

### `FactCheckModal.jsx`
- **Purpose**: Displays comprehensive fact-check details
- **Key Features**:
  - **3 Reader Themes**: Light, Dark, and Warm (sepia)
  - Theme switcher in modal header
  - Claims Detection section with quote styling
  - Verification Results with 2-column asymmetric layout
  - Source links with reliability indicators
  - Context mismatch handling
  - Fully responsive with serif typography for readability

### `PostModal.jsx`
- **Purpose**: Full-screen post/reel viewer
- **Features**:
  - Split-view layout (media + info sidebar on desktop)
  - Stacked layout on mobile
  - Autoplay for videos
  - Author info and caption display

### `PostOptionsModal.jsx`
- **Purpose**: Options menu for posts/reels
- **Options**:
  - Delete (owner only)
  - View Details (owner only)
  - Share
  - Report (non-owners)
  - Cancel

### `DeleteConfirmModal.jsx`
- **Purpose**: Delete confirmation dialog
- **Features**:
  - Warning icon with error theme
  - Clear confirmation message
  - Cancel/Delete actions
  - Loading state during deletion

## Usage

Import the main component:

```javascript
import PostCard from '../components/PostCard';

// In your component
<PostCard 
  item={post} 
  type="post" 
  onUpdate={handleUpdate}
  onClick={handleClick}
/>
```

The folder structure allows for easy imports - React automatically resolves to `index.jsx`.

## Props

### PostCard Props
- `item` (object, required): Post/reel data
  - `id`: Unique identifier
  - `author`: Author object with id, username, profile_picture
  - `caption`: Post caption
  - `image_url`: Image URL (for posts)
  - `video_url`: Video URL (for reels)
  - `likes_count`: Number of likes
  - `comments_count`: Number of comments
  - `is_liked`: Whether current user liked it
  - `verification_status`: Verification status
  - `fact_check`: Fact-check data object
  - `is_edited`: Whether AI-corrected
- `type` (string, required): "post" or "reel"
- `onUpdate` (function, optional): Callback after update/delete
- `onClick` (function, optional): Click handler for the card

## Performance Optimizations

1. **React.memo**: Prevents unnecessary re-renders with custom comparison
2. **Optimistic UI**: Instant like/unlike feedback
3. **Lazy Loading**: Images use lazy loading
4. **Memoized Functions**: Event handlers are stable references
5. **Conditional Rendering**: Modals only render when open

## Styling

- Uses MUI styled components for consistency
- Theme-aware (respects light/dark mode)
- Responsive breakpoints
- Smooth transitions and animations
- Accessible (ARIA labels, keyboard support)

## Future Enhancements

- [ ] Add bookmark functionality
- [ ] Implement report modal
- [ ] Add edit post functionality
- [ ] Add share to social media options
- [ ] Implement image carousel for multiple images



