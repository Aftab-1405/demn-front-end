# D.E.M.N - Vite React MUI Frontend

A modern, AI-powered social media platform built with **Vite**, **React 19**, and **Material-UI (MUI) v7**.

## 🚀 Tech Stack

- **Build Tool**: [Vite 6](https://vitejs.dev/) - Lightning-fast build tool
- **Framework**: [React 19](https://react.dev/) - Latest React with modern features
- **UI Library**: [Material-UI (MUI) v7](https://mui.com/) - Complete component library
- **Routing**: [React Router v6](https://reactrouter.com/) - Client-side routing
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query) - Server state management
- **Styling**: MUI `sx` prop, `styled()` API, and theme tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **PWA**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) - Progressive Web App support

## 📦 Project Structure

```
frontend/
├── public/                 # Static assets (icons, manifest, etc.)
├── src/
│   ├── components/         # Reusable UI components (all MUI-based)
│   ├── context/            # React Context providers (Auth, Theme, Notifications)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (routes)
│   ├── services/           # API services and utilities
│   ├── theme/              # MUI theme configuration
│   ├── styles/             # Global styles (App.css)
│   └── utils/              # Utility functions
├── index.html              # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🎨 MUI Theme Setup

The project uses a custom MUI theme with:
- **Light & Dark Mode** support
- **Indian Tricolor** inspired color palette (Saffron, Green, Navy Blue)
- **Responsive typography** with clamp() for fluid scaling
- **Custom component overrides** for consistent styling
- **Theme tokens** for dark mode compatibility

Theme configuration: `src/theme/muiTheme.js`

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
- Light and dark mode variants
- Custom color palette
- Responsive typography
- Component style overrides
- Smooth transitions

## 🎯 Key Features

- ✅ **100% MUI Components** - All components use MUI v7 with `sx` props and `styled()` API
- ✅ **No External CSS** - All styling uses MUI theme tokens and system props
- ✅ **Dark Mode Ready** - Full dark mode support with theme tokens
- ✅ **Responsive Design** - Mobile-first approach with MUI breakpoints
- ✅ **PWA Support** - Installable Progressive Web App
- ✅ **TypeScript Ready** - Type definitions included for better DX
- ✅ **Code Splitting** - Optimized bundle sizes with manual chunks

## 🔧 Development Guidelines

### Using MUI Components

Always use MUI components instead of raw HTML:
- `<Box>` instead of `<div>`
- `<Typography>` instead of `<h1>`, `<p>`, `<span>`
- `<Button>` instead of `<button>`
- `<TextField>` instead of `<input>`
- `<Card>` instead of custom card divs

### Styling Guidelines

1. **Use `sx` prop** for component-level styling:
   ```jsx
   <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
   ```

2. **Use `styled()` API** for reusable styled components:
   ```jsx
   const StyledCard = styled(Card)(({ theme }) => ({
     // styles
   }));
   ```

3. **Use theme tokens** instead of hardcoded colors:
   ```jsx
   // ✅ Good
   color: 'text.primary'
   bgcolor: 'background.paper'
   
   // ❌ Bad
   color: '#ffffff'
   bgcolor: '#000000'
   ```

4. **Use system props** for common CSS properties:
   ```jsx
   <Box p={2} m={1} display="flex" gap={2}>
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



