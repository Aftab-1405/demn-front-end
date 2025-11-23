# PostCard Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         PostCard (index.jsx)                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Main Card UI                               │   │
│  │  • Header (Avatar, Username, Options Button)            │   │
│  │  • Media (Image/Video + Maximize Button)                │   │
│  │  • Actions (Like, Comment, Share, Fact-Check, Save)     │   │
│  │  • Likes Count                                           │   │
│  │  • Caption                                               │   │
│  │  • Comments Count                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  State Management:                                               │
│  • Modal visibility states                                       │
│  • Like/Delete loading states                                    │
│  • Optimistic UI (local likes)                                   │
│                                                                   │
│  Business Logic:                                                 │
│  • handleLike (optimistic updates)                               │
│  • handleDelete                                                  │
│  • handleSharePost                                               │
│  • renderVerificationBadge                                       │
└───────────────────┬───────────┬────────────┬────────────┬───────┘
                    │           │            │            │
        ┌───────────┘     ┌─────┘      ┌─────┘      ┌─────┘
        │                 │            │            │
        ▼                 ▼            ▼            ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostModal    │ │ FactCheckModal│ │PostOptions   │ │DeleteConfirm │
│               │ │               │ │   Modal      │ │    Modal     │
├───────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤
│ • Full-size   │ │ • Theme      │ │ • Delete     │ │ • Warning UI │
│   viewer      │ │   switcher   │ │ • View       │ │ • Confirm    │
│ • Media       │ │ • Claims     │ │ • Share      │ │ • Cancel     │
│   display     │ │ • Verification│ │ • Report     │ │              │
│ • Caption     │ │ • Sources    │ │ • Cancel     │ │              │
│ • Author info │ │ • 3 themes   │ │              │ │              │
└───────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Parent Component                         │
│                    (Feed, Profile, Explore)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Props
                             │ • item (post/reel data)
                             │ • type ('post' or 'reel')
                             │ • onUpdate (callback)
                             │ • onClick (optional)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostCard (index.jsx)                        │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              React State                               │      │
│  │  • showPostModal                                       │      │
│  │  • showFactCheckModal                                  │      │
│  │  • showOptionsModal                                    │      │
│  │  • showDeleteConfirm                                   │      │
│  │  • showCommentsModal                                   │      │
│  │  • isLiking, isDeleting                                │      │
│  │  • localLiked, localLikesCount (optimistic UI)         │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              Context Hooks                             │      │
│  │  • useAuth() → user                                    │      │
│  │  • useNotifications() → showSnackbar                   │      │
│  │  • useNavigate() → navigate                            │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │              API Calls                                 │      │
│  │  • postsAPI.likePost / unlikePost                      │      │
│  │  • reelsAPI.likeReel / unlikeReel                      │      │
│  │  • postsAPI.deletePost / deleteReel                    │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│         ┌─────────────┬─────────────┬─────────────┐             │
│         │             │             │             │             │
│         ▼             ▼             ▼             ▼             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │PostModal │  │FactCheck │  │ Options  │  │  Delete  │       │
│  │          │  │  Modal   │  │  Modal   │  │Confirm   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│       │             │             │             │               │
│       └─────────────┴─────────────┴─────────────┘               │
│                         │                                        │
│                         │ Callbacks                              │
│                         │ • onClose                              │
│                         │ • onConfirm                            │
│                         │ • onShare                              │
│                         ▼                                        │
│              ┌─────────────────────┐                            │
│              │  State Updates      │                            │
│              │  Modal Toggles      │                            │
│              └─────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## State Management Pattern

```
User Action → Event Handler → State Update → UI Re-render
                    │
                    ├→ API Call (async)
                    │     ├→ Success: Confirm State
                    │     └→ Error: Rollback State
                    │
                    └→ Modal Toggle
                          └→ Child Modal Opens
```

### Example: Like Button Flow

```
1. User clicks Like
   ↓
2. handleLike()
   ↓
3. Optimistic Update (instant UI change)
   • setLocalLiked(!localLiked)
   • setLocalLikesCount(prev ± 1)
   ↓
4. API Call (background)
   • postsAPI.likePost()
   ↓
5. Success?
   ├─ Yes: Keep optimistic state ✅
   └─ No: Rollback to original state ❌
```

## Component Communication

```
┌──────────────────────────────────────────────────────────────┐
│                         PostCard                              │
│                                                                │
│  Props Down ↓                                                 │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  FactCheckModal receives:                            │     │
│  │  • isOpen                                            │     │
│  │  • onClose (callback)                                │     │
│  │  • factCheck (data)                                  │     │
│  │  • item (post data)                                  │     │
│  │  • renderVerificationBadge (shared function)         │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                                │
│  Callbacks Up ↑                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Modal triggers:                                     │     │
│  │  • onClose() → setShowFactCheckModal(false)          │     │
│  │  • onConfirm() → handleDelete()                      │     │
│  │  • onShare() → handleSharePost()                     │     │
│  └─────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌────────────────────────────────────────────────────────────┐
│                    React.memo                               │
│                                                              │
│  Custom areEqual comparison function:                       │
│  • Compare item.id                                          │
│  • Compare key properties (likes_count, is_liked, etc.)    │
│  • Compare author data                                      │
│  • Compare function references (onUpdate, onClick)          │
│                                                              │
│  Result: Re-render only when necessary                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 Optimistic Updates                          │
│                                                              │
│  Like/Unlike flow:                                          │
│  1. Instant UI update (local state)                        │
│  2. API call in background                                  │
│  3. Rollback on error                                       │
│                                                              │
│  Result: Feels instantaneous to user                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│               Conditional Rendering                         │
│                                                              │
│  Modals render only when:                                   │
│  • isOpen === true                                          │
│  • Data is available                                        │
│                                                              │
│  Result: Reduced DOM nodes, better performance              │
└────────────────────────────────────────────────────────────┘
```

## File Responsibilities

| File | Lines | Responsibility | Complexity |
|------|-------|----------------|------------|
| `index.jsx` | 467 | Main card UI & logic | Medium |
| `FactCheckModal.jsx` | 476 | Fact-check details viewer | High |
| `PostModal.jsx` | 100 | Full-size media viewer | Low |
| `PostOptionsModal.jsx` | 118 | Action options menu | Low |
| `DeleteConfirmModal.jsx` | 72 | Delete confirmation | Low |

**Total: 1,233 lines** (vs 1,633 before = **400 lines saved** through better organization)

## Dependency Graph

```
index.jsx
├── AppDialog (Modal wrapper)
├── CommentSection
├── FactCheckModal
│   └── AppDialog
├── PostModal
│   └── AppDialog
├── PostOptionsModal
│   └── AppDialog
└── DeleteConfirmModal
    └── AppDialog

Services Used:
├── postsAPI
│   ├── likePost
│   ├── unlikePost
│   └── deletePost
├── reelsAPI
│   ├── likeReel
│   ├── unlikeReel
│   └── deleteReel
└── BACKEND_URL

Contexts Used:
├── AuthContext (user)
└── NotificationContext (showSnackbar)
```

---

This modular architecture provides clear separation of concerns, making the codebase easier to maintain, test, and extend.



