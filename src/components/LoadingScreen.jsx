import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

// Define the pulse animation using MUI/Emotion keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default', // Uses theme token instead of var(--bg-body)
                gap: 6, // Uses theme spacing (8px * 6 = 48px)
            }}
        >
            {/* Breathing Logo Animation */}
            <Box
                component="img"
                src="/icons/icon-source.svg"
                alt="D.E.M.N Logo"
                sx={{
                    width: 80,
                    height: 80,
                    animation: `${pulse} 2s infinite ease-in-out`,
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        color: 'text.primary', // Uses theme token
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        margin: 0,
                    }}
                >
                    Initializing D.E.M.N
                </Typography>
            </Box>
        </Box>
    );
};

export default LoadingScreen;