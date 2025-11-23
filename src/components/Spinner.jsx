import { CircularProgress, Box } from '@mui/material';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  // Map size prop to MUI CircularProgress size
  const sizeMap = {
    sm: 14,
    md: 20,
    lg: 32,
    xl: 48,
  };

  // Map color prop to MUI color
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    white: 'inherit', // Will be styled separately
    error: 'error',
    default: 'inherit', // Will be styled separately
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const muiColor = colorMap[color] || 'primary';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color === 'white' ? 'white' : color === 'default' ? 'text.primary' : undefined,
      }}
    >
      <CircularProgress
        size={spinnerSize}
        color={muiColor === 'inherit' ? undefined : muiColor}
        sx={{
          color: color === 'white' ? 'white' : color === 'default' ? 'text.primary' : undefined,
        }}
      />
    </Box>
  );
};

export default Spinner;
