//
// MUI Theme Configuration - AI-Powered Social Media
// Modern color palette for AI + Social Media (Purple, Pink, Blue)
// Inspired by modern AI platforms: Claude, ChatGPT, Gemini
// Uses MUI's color system for industry-standard design

import { createTheme, alpha } from '@mui/material/styles';
import {
  purple,
  pink,
  blue,
  green,
  red,
  amber,
  grey
} from '@mui/material/colors';

// AI-Powered Social Media Color Palette
// Modern gradient: Deep Purple (AI/Intelligence) → Vibrant Pink (Social/Energy) → Electric Blue (Tech/Trust)
const colors = {
  // Primary: Deep Purple (AI/Intelligence/Innovation)
  // Aligns with modern AI branding (Claude, OpenAI, Anthropic)
  primary: {
    main: '#8B5CF6',      // Deep purple - AI/intelligence
    light: '#A78BFA',     // Lighter purple - accessible
    dark: '#7C3AED',      // Darker purple - rich
    contrastText: '#FFFFFF', // White text for readability
  },

  // Secondary: Vibrant Pink (Social/Energy/Engagement)
  // Modern social media aesthetic - engaging and friendly
  secondary: {
    main: '#EC4899',      // Vibrant pink - social/energy
    light: '#F472B6',     // Lighter pink - playful
    dark: '#DB2777',      // Darker pink - bold
    contrastText: '#FFFFFF', // White text on pink
  },

  // Info: Electric Blue (Tech/Trust/Reliability)
  // Professional yet modern - tech credibility
  info: {
    main: '#3B82F6',      // Electric blue - tech/trust
    light: '#60A5FA',     // Lighter blue - approachable
    dark: '#2563EB',      // Darker blue - professional
    contrastText: '#FFFFFF',
  },

  // Success: Emerald (Verified/Positive/Growth)
  success: {
    main: '#10B981',      // Emerald green - modern success
    light: '#34D399',     // Lighter emerald
    dark: '#059669',      // Darker emerald
    contrastText: '#FFFFFF',
  },

  // Warning: Amber (Pending/Caution/Review)
  warning: {
    main: '#F59E0B',      // Amber - attention
    light: '#FBBF24',     // Lighter amber
    dark: '#D97706',      // Darker amber
    contrastText: '#000000',
  },

  // Error: Rose (Critical/Error/Alert)
  error: {
    main: '#F43F5E',      // Rose red - modern error
    light: '#FB7185',     // Lighter rose
    dark: '#E11D48',      // Darker rose
    contrastText: '#FFFFFF',
  },
};

// Create light theme
const lightTheme = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    info: colors.info,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: {
      default: grey[50],       // #FAFAFA - Neutral light grey background
      paper: '#FFFFFF',        // Pure white for cards/paper
    },
    text: {
      primary: grey[900],      // #212121 - Dark text for contrast
      secondary: grey[600],    // #757575 - Medium grey for secondary text
      disabled: grey[400],     // #BDBDBD - Light grey for disabled
    },
    divider: grey[300],        // #E0E0E0 - Neutral divider
    action: {
      active: colors.primary.main,
      hover: grey[100],         // #F5F5F5 - Light hover state
      selected: grey[200],     // #EEEEEE - Selected state
      disabled: grey[400],      // #BDBDBD
      disabledBackground: grey[200], // #EEEEEE
    },
  },
};

// Create dark theme
const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#A78BFA',      // Lighter purple for dark mode - better visibility
      light: '#C4B5FD',     // Even lighter purple
      dark: '#8B5CF6',      // Standard purple
      contrastText: '#000000', // Black text on light purple
    },
    secondary: {
      main: '#F472B6',      // Lighter pink for dark mode
      light: '#F9A8D4',     // Even lighter pink
      dark: '#EC4899',      // Standard pink
      contrastText: '#000000', // Black text on light pink
    },
    info: {
      main: '#60A5FA',      // Lighter blue for dark mode
      light: '#93C5FD',     // Even lighter blue
      dark: '#3B82F6',      // Standard blue
      contrastText: '#000000',
    },
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: {
      default: grey[900],    // #212121 - Neutral dark grey
      paper: grey[800],      // #424242 - Slightly lighter for cards
    },
    text: {
      primary: grey[50],     // #FAFAFA - MUI standard
      secondary: grey[400],   // #BDBDBD
      disabled: grey[600],   // #757575
    },
    divider: grey[700],       // #616161 - Neutral divider
    action: {
      active: '#A78BFA',     // Light purple for active state
      hover: grey[800],      // Dark hover state
      selected: grey[700],
      disabled: grey[700],
      disabledBackground: grey[800],
    },
  },
};

// Shared theme configuration
const getThemeConfig = (mode) => ({
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Responsive typography
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: 'clamp(1.625rem, 4.5vw, 2.5rem)',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3.5vw, 1.625rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // More modern look
      fontWeight: 600,
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    },
    caption: {
      fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
      lineHeight: 1.4,
    },
  },

  shape: {
    borderRadius: 8, // Matches --radius-lg
  },

  spacing: 8, // Base spacing unit (matches 0.5rem)

  components: {
    // 1. DISABLE DEFAULT RIPPLE GLOBALLY
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },

    // 2. SCALE + GLOW FOR BUTTONS
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 'clamp(0.4rem, 1.6vw, 0.6rem)',
          padding: 'clamp(0.6rem, 1.6vw, 0.8rem) clamp(1.25rem, 3vw, 1.6rem)',
          fontWeight: 600,
          transition: 'all 0.15s ease-in-out', // Faster transition for snappy feel
          boxShadow: 'none',

          // SCALE EFFECT (Click)
          '&:active': {
            transform: 'scale(0.95)',
          },

          // GLOW EFFECT (Hover)
          '&:hover': {
            transform: 'scale(1.02)', // Slight growth on hover
            boxShadow: ownerState.variant === 'contained' && ownerState.color !== 'inherit'
              ? `0 0 15px ${alpha(theme.palette[ownerState.color].main, 0.5)}` // Colored Glow
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }),
        contained: {
          // Additional glow intensity for contained buttons
          '&:hover': {
             // Let root handle the dynamic color, specific overrides here if needed
          },
        },
        outlined: ({ ownerState, theme }) => ({
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: alpha(theme.palette[ownerState.color].main, 0.08),
            boxShadow: `0 0 8px ${alpha(theme.palette[ownerState.color].main, 0.3)}`, // Subtle glow for outlined
          },
        }),
        sizeSmall: {
          padding: 'clamp(0.4rem, 1.2vw, 0.6rem) clamp(0.8rem, 2vw, 1rem)',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
        },
        sizeLarge: {
          padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.6rem, 3.6vw, 2rem)',
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
        },
      },
    },

    // 3. SCALE + GLOW FOR ICON BUTTONS
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: '50%',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          
          '&:hover': {
            transform: 'scale(1.1)', // Grow larger
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            // Add a subtle glow based on color if it's not default
             boxShadow: ownerState.color !== 'default' && ownerState.color !== 'inherit'
              ? `0 0 10px ${alpha(theme.palette[ownerState.color].main, 0.4)}`
              : 'none',
          },
          '&:active': {
            transform: 'scale(0.90)', // Shrink significantly for click feel
          },
        }),
      },
    },

    // Badge customization
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '0.625rem',
          minWidth: '18px',
          height: '18px',
          padding: '0 5px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        colorPrimary: {
          // Modern purple-to-pink gradient for AI-powered features
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
        },
      },
    },

    // Card customization (Enhanced with Scale on Click if Actionable)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'clamp(0.6rem, 2vw, 0.8rem)',
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 8px 24px rgba(0, 0, 0, 0.12)'
              : '0 8px 24px rgba(0, 0, 0, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    // Action Area (for Cards) - Add Scale effect
    MuiCardActionArea: {
      styleOverrides: {
        root: {
           transition: 'transform 0.1s ease-in-out',
           '&:active': {
             transform: 'scale(0.98)',
           },
           '&:hover .MuiCardActionArea-focusHighlight': {
             opacity: 0, // Disable default overlay since we use scale/shadow
           },
        },
      },
    },

    // TextField customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'clamp(0.4rem, 1.6vw, 0.6rem)',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? colors.primary.main : colors.primary.light,
                boxShadow: `0 0 8px ${alpha(colors.primary.main, 0.2)}`, // Subtle input glow
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                boxShadow: `0 0 12px ${alpha(colors.primary.main, 0.3)}`, // Stronger focus glow
              },
            },
          },
        },
      },
    },

    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'clamp(0.8rem, 2.5vw, 1.2rem)',
          fontWeight: 500,
        },
        clickable: {
          '&:active': {
             boxShadow: 'none',
             transform: 'scale(0.95)', // Scale for clickable chips
          },
        }
      },
    },

    // Dialog customization
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 'clamp(0.8rem, 2.5vw, 1.2rem)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        },
      },
    },

    // Tooltip customization
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
          borderRadius: 'clamp(0.3rem, 1.2vw, 0.5rem)',
          padding: 'clamp(0.4rem, 1.2vw, 0.6rem) clamp(0.8rem, 2vw, 1rem)',
        },
      },
    },

    // Paper customization
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Disable default MUI elevation gradient
        },
        rounded: {
          borderRadius: 'clamp(0.6rem, 2vw, 0.8rem)',
        },
      },
    },

    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

// Export theme creator function
export const createAppTheme = (mode = 'light') => {
  const themeBase = mode === 'dark' ? darkTheme : lightTheme;
  const themeConfig = getThemeConfig(mode);

  return createTheme({
    ...themeBase,
    ...themeConfig,
    // Global styles for layout spacing
    components: {
      ...themeConfig.components,
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          // Add left margin when sidebar is present on desktop
          'body.has-left-nav': {
            '@media (min-width: 1200px)': {
              marginLeft: '96px', // 80px sidebar + 16px gap
            },
          },
          // Custom Scrollbar Styling
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
              : 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
            borderRadius: '10px',
            transition: 'all 0.3s ease',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)'
              : 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          },
          // Firefox scrollbar
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: mode === 'dark'
              ? '#8B5CF6 transparent'
              : '#A78BFA transparent',
          },
        },
      },
    },
  });
};

// Export individual themes for reference
export const lightMuiTheme = createTheme({ ...lightTheme, ...getThemeConfig('light') });
export const darkMuiTheme = createTheme({ ...darkTheme, ...getThemeConfig('dark') });