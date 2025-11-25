import PropTypes from 'prop-types';
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TypeWriter from '../../../components/TypeWriter';

const AISearchSection = ({
  searchQuery,
  searching,
  searchError,
  searchResults,
  aiNarration,
  isDismissing,
  typingComplete,
  onSearchChange,
  onSearchSubmit,
  onTypingComplete,
}) => {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: '65%' },
        maxWidth: { md: 'none' },
        margin: { xs: '0', md: '0 auto' },
        marginTop: 2,
        marginBottom: 1.5,
      }}
    >
      <Card
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 1.5,
          padding: 1.5,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: 1,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box
          component="form"
          onSubmit={onSearchSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, width: '100%' }}>
            <TextField
              fullWidth
              placeholder="Search posts with AI..."
              value={searchQuery}
              onChange={onSearchChange}
              disabled={searching}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: 'text.secondary',
                        fontSize: 18,
                        transition: 'color 0.2s ease',
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" sx={{ marginRight: 0.5 }}>
                    <Tooltip
                      title={searching ? 'Searching with AI...' : 'Search with AI'}
                      arrow
                      placement="top"
                    >
                      <span>
                        <IconButton
                          type="submit"
                          disabled={searching || !searchQuery.trim()}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            borderRadius: '50%',
                            boxShadow: (theme) =>
                              `0 2px 6px ${theme.palette.primary.main}40`,
                            '&:hover': {
                              bgcolor: 'primary.dark',
                              transform: 'scale(1.05)',
                              boxShadow: (theme) =>
                                `0 3px 10px ${theme.palette.primary.main}50`,
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                            '&:disabled': {
                              bgcolor: 'action.disabledBackground',
                              color: 'action.disabled',
                              boxShadow: 'none',
                              opacity: 0.6,
                            },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {searching ? (
                            <CircularProgress
                              size={14}
                              sx={{
                                color: 'inherit',
                              }}
                            />
                          ) : (
                            <AutoAwesomeIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                  borderRadius: 1.5,
                  paddingRight: 0,
                  '& fieldset': {
                    borderWidth: 1.5,
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 1.5,
                    boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}20`,
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {searchError && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {searchError}
          </Alert>
        )}

        {searchResults !== null && aiNarration && (
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              alignItems: 'flex-start',
              padding: 1.5,
              marginTop: 1.25,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
              borderRadius: '9px',
              boxShadow: 1,
              opacity: isDismissing ? 0 : 1,
              transform: isDismissing ? 'translateY(-10px)' : 'translateY(0)',
              transition: 'all 0.5s ease-out',
              pointerEvents: isDismissing ? 'none' : 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1.125,
                alignItems: 'flex-start',
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  flexShrink: 0,
                  marginTop: 0.5,
                  width: 18,
                  height: 18,
                  color: 'primary.main',
                }}
              />
              <TypeWriter text={aiNarration} onComplete={onTypingComplete} />
            </Box>
          </Card>
        )}
      </Card>
    </Box>
  );
};

AISearchSection.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
  searchError: PropTypes.string.isRequired,
  searchResults: PropTypes.any,
  aiNarration: PropTypes.string.isRequired,
  isDismissing: PropTypes.bool.isRequired,
  typingComplete: PropTypes.bool.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onTypingComplete: PropTypes.func.isRequired,
};

export default AISearchSection;
