# D.E.M.N - Vite React MUI Frontend

A modern, AI-powered social media platform built with **Vite**, **React 19**, and **Material-UI (MUI) v7**.

> **Migration Status:** This project has been fully migrated to MUI v7 with 100% CSS-in-JS. All legacy CSS files have been removed and replaced with MUI components and theme-based styling.

## 🚀 Tech Stack

- **Build Tool**: [Vite 6](https://vitejs.dev/) - Lightning-fast build tool
- **Framework**: [React 19](https://react.dev/) - Latest React with modern features (.jsx files)
- **UI Library**: [Material-UI (MUI) v7](https://mui.com/) - Complete component library
  - `@mui/material` v7.3.5 - Core components
  - `@mui/icons-material` v7.3.5 - Icon components
  - `@mui/x-charts` v8.18.0 - Advanced charting
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS engine
- **Routing**: [React Router v6](https://reactrouter.com/) - Client-side routing
- **State Management**: [TanStack Query v5](https://tanstack.com/query) - Server state management
- **Styling**: **100% CSS-in-JS** with MUI `sx` prop, `styled()` API, and theme tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **Forms**: [React Hook Form](https://react-hook-form.com/) - Performant form validation
- **Notifications**: MUI Snackbar & Alert - Custom notification system with queuing
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) - Progressive Web App support

## 📦 Project Structure

```
demn-front-end/
├── public/                 # Static assets (icons, manifest, service-worker)
├── src/
│   ├── components/         # Reusable UI components (all MUI-based)
│   │   └── PostCard/       # Post card component with modals
│   ├── context/            # React Context providers (Auth, Theme, Notifications)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (routes)
│   ├── services/           # API services and utilities
│   ├── theme/              # MUI theme configuration (muiTheme.js)
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component with routing
│   └── index.jsx           # React entry point
├── scripts/                # Build scripts (icon generation)
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration with PWA
└── package.json            # Dependencies and scripts
```

## 🎨 MUI Theme Setup

The project uses a **custom MUI theme** (`src/theme/muiTheme.js`) with:
- **Light & Dark Mode** support with smooth transitions
- **Modern AI-inspired color palette**: Cyan (#00E7FF) → Blue (#009dff) → Saffron (#FF7A00)
- **Responsive typography** with `clamp()` for fluid scaling across all devices
- **Custom component overrides** for consistent styling (Buttons, Cards, TextFields, etc.)
- **Theme tokens** for automatic dark mode compatibility
- **Zero hardcoded colors** - All colors use theme palette references

**Key Features:**
- Primary: Cyan (#00E7FF) - Tech/AI vibe
- Secondary: Saffron/Orange (#FF7A00) - Energy/Social
- Info: Deep Blue (#009dff) - Neural/Tech
- All components styled using MUI's `sx` prop and `styled()` API
- No CSS files - 100% CSS-in-JS implementation

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## ⚙️ Configuration

### Vite Configuration (`vite.config.js`)

- **Port**: 3000 (development server)
- **Proxy**: `/api` and `/static` routes proxy to `http://localhost:5000`
- **PWA**: Configured with auto-update and service worker
- **Code Splitting**: Manual chunks for React, MUI, and React Query vendors

### MUI Theme

The theme is configured in `src/theme/muiTheme.js` and provides:
- Light and dark mode variants with automatic switching
- Custom AI-inspired color palette (Cyan, Blue, Saffron)
- Responsive typography using `clamp()` for fluid scaling
- Component style overrides (Button, Card, TextField, etc.)
- Smooth transitions and animations
- Custom spacing and border radius scales

**Usage in components:**
```jsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
// Access theme values: theme.palette.primary.main, theme.spacing(2), etc.
```

## 🎯 Key Features

- ✅ **100% MUI Components** - All UI components use MUI v7 (`Box`, `Typography`, `Card`, `Button`, etc.)
- ✅ **Zero CSS Files** - 100% CSS-in-JS using MUI's `sx` prop and `styled()` API
- ✅ **Theme-First Styling** - All colors, spacing, and styles use MUI theme tokens
- ✅ **Dark Mode Ready** - Full dark mode support with automatic theme token switching
- ✅ **Responsive Design** - Mobile-first approach with MUI breakpoints (`xs`, `sm`, `md`, `lg`, `xl`)
- ✅ **PWA Support** - Installable Progressive Web App with offline capabilities
- ✅ **React 19** - Latest React features with modern JSX (.jsx files)
- ✅ **Code Splitting** - Optimized bundle sizes with manual chunks (React, MUI, TanStack Query)

## 🔧 Development Guidelines

### Using MUI Components

Always use MUI components instead of raw HTML:
- `<Box>` instead of `<div>`
- `<Typography>` instead of `<h1>`, `<p>`, `<span>`
- `<Button>` instead of `<button>`
- `<TextField>` instead of `<input>`
- `<Card>` instead of custom card divs

### Styling Guidelines

**Important:** This project uses **100% CSS-in-JS**. Never create `.css` files. All styling is done through MUI.

1. **Use `sx` prop** for component-level styling:
   ```jsx
   <Box sx={{
     p: 2,
     bgcolor: 'background.paper',
     borderRadius: 2,
     boxShadow: 1
   }}>
   ```

2. **Use `styled()` API** for reusable styled components:
   ```jsx
   import { styled } from '@mui/material/styles';

   const StyledCard = styled(Card)(({ theme }) => ({
     padding: theme.spacing(2),
     backgroundColor: theme.palette.background.paper,
     borderRadius: theme.shape.borderRadius,
     transition: theme.transitions.create(['transform', 'box-shadow']),
     '&:hover': {
       transform: 'translateY(-2px)',
       boxShadow: theme.shadows[4],
     },
   }));
   ```

3. **ALWAYS use theme tokens** instead of hardcoded values:
   ```jsx
   // ✅ Good - Uses theme tokens
   sx={{
     color: 'text.primary',
     bgcolor: 'background.paper',
     borderRadius: 2,  // theme.shape.borderRadius * 2
     p: 2,             // theme.spacing(2)
   }}

   // ❌ Bad - Hardcoded values break dark mode
   sx={{
     color: '#ffffff',
     bgcolor: '#000000',
     borderRadius: '8px',
     padding: '16px',
   }}
   ```

4. **Use system props** for common CSS properties:
   ```jsx
   <Box p={2} m={1} display="flex" gap={2} alignItems="center">
   ```

5. **Responsive styling** with MUI breakpoints:
   ```jsx
   <Box sx={{
     width: { xs: '100%', md: '50%' },
     p: { xs: 2, md: 3 },
     display: { xs: 'block', lg: 'flex' }
   }}>
   ```

## 📱 PWA Features

- **Service Worker**: Automatic registration for offline support
- **Manifest**: Configured with app icons and metadata
- **Install Prompt**: Custom install banner for PWA installation
- **Offline Support**: Cached assets for offline access

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Built with ❤️ using Vite + React + MUI**



