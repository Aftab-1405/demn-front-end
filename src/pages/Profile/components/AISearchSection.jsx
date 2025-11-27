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
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  HelpOutline as UnknownIcon,
} from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Verification status configuration
const VERIFICATION_STATUS = {
  verified: {
    label: 'Verified',
    icon: VerifiedIcon,
    color: 'success',
  },
  fake: {
    label: 'Fake',
    icon: ErrorIcon,
    color: 'error',
  },
  misleading: {
    label: 'Misleading',
    icon: WarningIcon,
    color: 'warning',
  },
  unverified: {
    label: 'Unverified',
    icon: UnknownIcon,
    color: 'default',
  },
};

const AISearchSection = ({
  searchQuery,
  searching,
  searchError,
  searchResults,
  searchMetadata,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  // Get verification badge configuration
  const getVerificationConfig = (status) => {
    return VERIFICATION_STATUS[status] || VERIFICATION_STATUS.unverified;
  };

  // Format similarity score as percentage
  const formatSimilarity = (score) => {
    if (!score) return 'N/A';
    return `${Math.round(score * 100)}%`;
  };

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
                    <Stack direction="row" spacing={0.5}>
                      {searchQuery && (
                        <Tooltip title="Clear search" arrow placement="top">
                          <IconButton
                            onClick={onClearSearch}
                            size="small"
                            sx={{
                              width: 28,
                              height: 28,
                              color: 'text.secondary',
                              '&:hover': {
                                bgcolor: 'error.main',
                                color: 'error.contrastText',
                              },
                            }}
                          >
                            <ClearIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
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
                    </Stack>
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

        {/* Search Results Summary */}
        {searchResults && searchResults.length > 0 && (
          <Box
            sx={{
              marginTop: 1.5,
              padding: 1.5,
              bgcolor: 'background.default',
              borderRadius: '9px',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 1.5 }}>
              <AutoAwesomeIcon
                sx={{
                  fontSize: 18,
                  color: 'primary.main',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </Typography>
            </Stack>

            {/* Search Metadata (optional) */}
            {searchMetadata && (
              <Stack direction="row" spacing={1} sx={{ marginBottom: 1.5, flexWrap: 'wrap' }}>
                {searchMetadata.search_method && (
                  <Chip
                    label={`Method: ${searchMetadata.search_method}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
                {searchMetadata.semantic_query_used && (
                  <Chip
                    label="Semantic Search"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            )}

            {/* Result Cards */}
            <Stack spacing={1.25}>
              {searchResults.map((result, index) => {
                const verificationConfig = getVerificationConfig(result.verification_status);
                const VerificationIcon = verificationConfig.icon;

                return (
                  <Card
                    key={result.id || index}
                    sx={{
                      padding: 1.5,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) =>
                          `0 2px 8px ${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    {/* Result Header: Verification Status & Similarity Score */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ marginBottom: 1 }}
                    >
                      <Chip
                        icon={<VerificationIcon />}
                        label={verificationConfig.label}
                        color={verificationConfig.color}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                      {result.similarity_score && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        >
                          Match: {formatSimilarity(result.similarity_score)}
                        </Typography>
                      )}
                    </Stack>

                    {/* Caption */}
                    {result.caption && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {result.caption}
                      </Typography>
                    )}

                    {/* Fact-Check Snippet */}
                    {result.fact_check_snippet && (
                      <Box
                        sx={{
                          padding: 1,
                          bgcolor: 'action.hover',
                          borderRadius: '6px',
                          borderLeft: 3,
                          borderColor: 'primary.main',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                            display: 'block',
                          }}
                        >
                          {result.fact_check_snippet}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                );
              })}
            </Stack>
          </Box>
        )}

        {/* No Results */}
        {searchResults && searchResults.length === 0 && (
          <Box
            sx={{
              marginTop: 1.5,
              padding: 2,
              textAlign: 'center',
              bgcolor: 'background.default',
              borderRadius: '9px',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              No results found for "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

AISearchSection.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
  searchError: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      caption: PropTypes.string,
      verification_status: PropTypes.string,
      fact_check_snippet: PropTypes.string,
      similarity_score: PropTypes.number,
    })
  ),
  searchMetadata: PropTypes.shape({
    search_method: PropTypes.string,
    structured_filters: PropTypes.object,
    semantic_query_used: PropTypes.bool,
    optimization_stats: PropTypes.object,
  }),
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default AISearchSection;
