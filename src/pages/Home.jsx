import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  keyframes,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

// Advanced Platform Purpose Animations
const auroraMove = keyframes`
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0.25;
  }
  33% {
    transform: translate(80px, 40px) scale(1.2) rotate(120deg);
    opacity: 0.3;
  }
  66% {
    transform: translate(-40px, -80px) scale(0.9) rotate(240deg);
    opacity: 0.2;
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(360deg);
    opacity: 0.25;
  }
`;

// Network connection animation - shows social connections
const networkPulse = keyframes`
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
`;

// Data flow animation - shows fact-checking process
const dataFlow = keyframes`
  0% {
    transform: translateX(-100%) translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateX(100vw) translateY(-50px);
    opacity: 0;
  }
`;

// Verification scan animation
const verificationScan = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateX(100vw);
    opacity: 0.3;
  }
`;

// Particle connection animation
const particleConnect = keyframes`
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
`;

const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const floatVisual = keyframes`
  from {
    transform: rotateY(-20deg) rotateX(10deg) translateZ(-10px) translateY(-10px);
  }
  to {
    transform: rotateY(-18deg) rotateX(8deg) translateZ(10px) translateY(10px);
  }
`;

const aiGlowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.2);
  }
  50% {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.4), 0 0 60px rgba(236, 72, 153, 0.1);
  }
`;

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = 'D.E.M.N - Share Your Truth, Verified Facts';
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        padding: { xs: '12px 4%', sm: '18px 4%', md: '24px 4%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Advanced Platform Purpose Background Animation */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Base Aurora Gradients - Tech Vibe */}
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(100px)',
            mixBlendMode: 'screen',
            width: { xs: '400px', sm: '320px', md: '400px' },
            height: { xs: '400px', sm: '320px', md: '400px' },
            top: { xs: '-120px', md: '-120px' },
            left: { xs: '-120px', md: '-120px' },
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
            animation: `${auroraMove} 18s infinite alternate ease-in-out`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            opacity: 0.2,
            filter: { xs: 'blur(100px)', sm: 'blur(75px)', md: 'blur(85px)' },
            mixBlendMode: 'screen',
            width: { xs: '350px', sm: '280px', md: '320px' },
            height: { xs: '350px', sm: '280px', md: '320px' },
            bottom: { xs: '-100px', md: '-80px' },
            right: { xs: '-100px', md: '-80px' },
            background: (theme) =>
              `radial-gradient(circle, ${theme.palette.info.main} 0%, transparent 70%)`,
            animation: `${auroraMove} 22s infinite alternate ease-in-out reverse`,
          }}
        />

        {/* Network Grid - Social Connections Visualization */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
            backgroundImage: (theme) => `
              linear-gradient(${theme.palette.primary.main}22 1px, transparent 1px),
              linear-gradient(90deg, ${theme.palette.primary.main}22 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: `${networkPulse} 4s ease-in-out infinite`,
          }}
        />

        {/* Data Flow Streams - Fact-Checking Process */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={`dataflow-${i}`}
            sx={{
              position: 'absolute',
              width: '2px',
              height: '200px',
              background: (theme) =>
                `linear-gradient(180deg, transparent, ${theme.palette.primary.main}66, transparent)`,
              left: `${20 + i * 30}%`,
              top: '-200px',
              animation: `${dataFlow} ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 2}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Verification Scan Lines - Real-time Verification */}
        {[...Array(2)].map((_, i) => (
          <Box
            key={`scan-${i}`}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: (theme) =>
                `linear-gradient(90deg, transparent, ${theme.palette.success.main}44, transparent)`,
              top: `${30 + i * 40}%`,
              left: '-100%',
              animation: `${verificationScan} ${12 + i * 3}s linear infinite`,
              animationDelay: `${i * 4}s`,
              boxShadow: (theme) => `0 0 20px ${theme.palette.success.main}33`,
            }}
          />
        ))}

        {/* Network Nodes - Social Network Visualization */}
        {[...Array(8)].map((_, i) => {
          const positions = [
            { top: '15%', left: '10%' },
            { top: '25%', left: '85%' },
            { top: '45%', left: '15%' },
            { top: '55%', left: '90%' },
            { top: '70%', left: '8%' },
            { top: '80%', left: '88%' },
            { top: '35%', left: '50%' },
            { top: '65%', left: '50%' },
          ];
          const pos = positions[i] || { top: '50%', left: '50%' };
          return (
            <Box
              key={`node-${i}`}
              sx={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                ...pos,
                background: (theme) => theme.palette.primary.main,
                opacity: 0.4,
                animation: `${particleConnect} ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                boxShadow: (theme) => `0 0 10px ${theme.palette.primary.main}66`,
              }}
            />
          );
        })}

        {/* Connection Lines Between Nodes - Social Network */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '15%',
              left: '10%',
              width: '75%',
              height: '2px',
              background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}44, transparent)`,
              transform: 'rotate(15deg)',
              animation: `${networkPulse} 3s ease-in-out infinite`,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '45%',
              left: '15%',
              width: '70%',
              height: '2px',
              background: (theme) => `linear-gradient(90deg, ${theme.palette.info.main}44, transparent)`,
              transform: 'rotate(-10deg)',
              animation: `${networkPulse} 4s ease-in-out infinite`,
              animationDelay: '1s',
            },
          }}
        />

        {/* Verification Badge Particles - Success Indicators */}
        {[...Array(4)].map((_, i) => (
          <Box
            key={`badge-${i}`}
            sx={{
              position: 'absolute',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              top: `${20 + i * 20}%`,
              left: `${15 + i * 25}%`,
              background: (theme) =>
                `radial-gradient(circle, ${theme.palette.success.main}88, transparent)`,
              animation: `${particleConnect} ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.5}s`,
              '&::before': {
                content: '"✓"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                color: (theme) => theme.palette.success.main,
                fontWeight: 'bold',
              },
            }}
          />
        ))}

        {/* Processing Indicator - Real-time Fact-Checking */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: (theme) => `2px solid ${theme.palette.primary.main}33`,
            borderTopColor: (theme) => theme.palette.primary.main,
            animation: 'spin 2s linear infinite',
            opacity: 0.3,
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          alignItems: 'center',
          gap: { xs: '20px', sm: '24px', md: '36px' },
          width: '100%',
          maxWidth: 1400,
          position: 'relative',
          zIndex: 1,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/* Hero Content */}
        <Stack
          spacing={{ xs: 1.25, sm: 1.5, md: 2 }}
          sx={{
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '1.375rem', sm: '1.625rem', md: '2.625rem' },
              fontWeight: 900,
              lineHeight: 1.15,
              color: 'text.primary',
              margin: 0,
              letterSpacing: { xs: '-1px', md: '-1.2px' },
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            Share Your Truth.
            <br />
            <Box
              component="span"
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: `${gradientShift} 4s ease-in-out infinite`,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              We&apos;ll Handle the Facts.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
              lineHeight: 1.6,
              color: 'text.secondary',
              margin: 0,
              maxWidth: { md: '450px' },
            }}
          >
            D.E.M.N is the social network where truth matters. Every factual claim is verified in real-time, so you can share and connect with complete confidence.
          </Typography>

          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              marginTop: { xs: 1.25, md: 1.25 },
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                padding: { xs: '10px 20px', sm: '9px 18px', md: '10px 20px' },
                fontSize: '0.8125rem',
                fontWeight: 600,
                boxShadow: (theme) =>
                  `0 4px 14px ${theme.palette.primary.main}4D, 0 0 20px ${theme.palette.primary.main}1A`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) =>
                    `0 6px 20px ${theme.palette.primary.main}66, 0 0 30px ${theme.palette.primary.main}33`,
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                padding: { xs: '10px 20px', sm: '9px 18px', md: '10px 20px' },
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Login
            </Button>
          </Stack>
        </Stack>

        {/* Hero Visual - Desktop Only */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            perspective: '1500px',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              transform: 'rotateY(-20deg) rotateX(10deg)',
              transformStyle: 'preserve-3d',
              animation: `${floatVisual} 6s infinite alternate ease-in-out`,
            }}
          >
            {/* Post Card 1 */}
            <Card
              sx={{
                borderRadius: '11px',
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(66, 66, 66, 0.8)' // grey[800] with 80% opacity
                    : 'rgba(255, 255, 255, 0.9)',
                border: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `1px solid ${theme.palette.primary.main}33`
                    : `1px solid ${theme.palette.info.main}4D`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px ${theme.palette.primary.main}26`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 16px ${theme.palette.info.main}33`,
                padding: 1.5,
                position: 'relative',
                width: 240,
                zIndex: 2,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 15px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${theme.palette.primary.main}40`
                      : `0 15px 50px rgba(0, 0, 0, 0.15), 0 0 30px ${theme.palette.info.main}4D`,
                },
              }}
            >
              <CardContent sx={{ padding: '0 !important' }}>
                 <Stack 
                   direction="row" 
                   spacing={0.75} 
                   alignItems="center" 
                   sx={{ 
                     paddingBottom: 0.75, 
                     borderBottom: (theme) => 
                       theme.palette.mode === 'dark'
                         ? '1px solid rgba(255, 255, 255, 0.1)'
                         : '1px solid rgba(0, 0, 0, 0.1)'
                   }}
                 >
                   <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main' }} />
                   <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'text.primary' }}>
                     @news_analyst
                   </Typography>
                 </Stack>
                 <Box
                   sx={{
                     width: '100%',
                     height: 80,
                     bgcolor: (theme) =>
                       theme.palette.mode === 'dark'
                         ? `${theme.palette.primary.main}1A`
                         : `${theme.palette.info.main}0D`,
                     borderRadius: '6px',
                     marginTop: 0.75,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                   }}
                 >
                   <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textAlign: 'center', px: 1 }}>
                     📊 Factual Claim Post
                   </Typography>
                 </Box>
                 <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, marginTop: 0.75, color: 'text.primary' }}>
                   &quot;Breaking: India becomes the #1 economy in the world in 2025.&quot;
                 </Typography>
                 <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }}>
                   <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary' }}>
                     ⏱️ Processing...
                   </Typography>
                 </Stack>
              </CardContent>
            </Card>

            {/* D.E.M.N Analysis Card 1 */}
            <Card
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 220,
                zIndex: 3,
                transform: 'translateZ(40px) translateX(-16px)',
                borderRadius: '11px',
                border: '2px solid transparent',
                background: (theme) => {
                  const darkBg = theme.palette.mode === 'dark' 
                    ? 'rgba(66, 66, 66, 0.85)' // grey[800] with 85% opacity
                    : 'rgba(255, 255, 255, 0.95)';
                  return `linear-gradient(${darkBg}, ${darkBg}) padding-box, linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%) border-box`;
                },
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                padding: 1.5,
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${theme.palette.primary.main}33`
                    : `0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px ${theme.palette.info.main}4D`,
                animation: `${aiGlowPulse} 4s ease-in-out infinite`,
              }}
            >
              <CardContent sx={{ padding: '0 !important' }}>
                <Stack 
                  direction="row" 
                  spacing={0.75} 
                  alignItems="center" 
                  sx={{ 
                    paddingBottom: 0.75, 
                    borderBottom: (theme) => 
                      theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <SecurityIcon sx={{ width: 18, height: 18, color: 'info.main' }} />
                  <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'info.main' }}>
                    D.E.M.N Verification
                  </Typography>
                </Stack>
                <Box sx={{ paddingTop: 0.75 }}>
                  <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 0.25 }}>
                    Verification Status:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 0.75, display: 'block', color: 'error.main' }}>
                    Disputed
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 0.25 }}>
                    D.E.M.N Finding:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, color: 'text.secondary', margin: 0 }}>
                    Verified against IMF & World Bank data. Claim disputed with credible sources provided.
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontSize: '8px', color: 'info.main', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 157, 255, 0.15)' : 'rgba(0, 157, 255, 0.1)', px: 0.5, py: 0.25, borderRadius: '4px' }}>
                      ✓ Sources Found
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '8px', color: 'error.main', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.15)' : 'rgba(211, 47, 47, 0.1)', px: 0.5, py: 0.25, borderRadius: '4px' }}>
                      ⚠️ Needs Review
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Post Card 2 (Personal) */}
            <Card
              sx={{
                borderRadius: '11px',
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'rgba(66, 66, 66, 0.8)' // grey[800] with 80% opacity
                    : 'rgba(255, 255, 255, 0.9)',
                border: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `1px solid ${theme.palette.primary.main}33`
                    : `1px solid ${theme.palette.info.main}4D`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px ${theme.palette.primary.main}26`
                    : `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 16px ${theme.palette.info.main}33`,
                padding: 1.5,
                position: 'relative',
                width: 240,
                zIndex: 4,
                marginTop: 2.5,
                transform: 'translateX(40px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateX(40px) translateY(-4px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 15px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${theme.palette.primary.main}40`
                      : `0 15px 50px rgba(0, 0, 0, 0.15), 0 0 30px ${theme.palette.info.main}4D`,
                },
              }}
            >
              <CardContent sx={{ padding: '0 !important' }}>
                 <Stack 
                   direction="row" 
                   spacing={0.75} 
                   alignItems="center" 
                   sx={{ 
                     paddingBottom: 0.75, 
                     borderBottom: (theme) => 
                       theme.palette.mode === 'dark'
                         ? '1px solid rgba(255, 255, 255, 0.1)'
                         : '1px solid rgba(0, 0, 0, 0.1)'
                   }}
                 >
                   <Avatar sx={{ width: 20, height: 20, bgcolor: 'info.dark' }} />
                   <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'text.primary' }}>
                     @user_john
                   </Typography>
                 </Stack>
                 <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, marginTop: 0.75, color: 'text.primary' }}>
                   &quot;Had an amazing time with family today! Feeling blessed.&quot;
                 </Typography>
                 <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }}>
                   <VerifiedIcon sx={{ width: 12, height: 12, color: 'success.main' }} />
                   <Typography variant="caption" sx={{ fontSize: '9px', color: 'success.main' }}>
                     Auto-approved
                   </Typography>
                 </Stack>
              </CardContent>
            </Card>

            {/* D.E.M.N Analysis Card 2 (Personal) */}
            <Card
              sx={{
                position: 'absolute',
                left: '60%',
                top: '60%',
                width: 220,
                zIndex: 5,
                transform: 'translateZ(70px) translateX(-20px)',
                borderRadius: '11px',
                border: '2px solid transparent',
                background: (theme) => {
                  const darkBg = theme.palette.mode === 'dark' 
                    ? 'rgba(66, 66, 66, 0.85)' // grey[800] with 85% opacity
                    : 'rgba(255, 255, 255, 0.95)';
                  return `linear-gradient(${darkBg}, ${darkBg}) padding-box, linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%) border-box`;
                },
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                padding: 1.5,
                boxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(76, 175, 80, 0.2)'
                    : '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(76, 175, 80, 0.3)',
              }}
            >
              <CardContent sx={{ padding: '0 !important' }}>
                <Stack 
                  direction="row" 
                  spacing={0.75} 
                  alignItems="center" 
                  sx={{ 
                    paddingBottom: 0.75, 
                    borderBottom: (theme) => 
                      theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CheckCircleIcon sx={{ width: 18, height: 18, color: 'success.main' }} />
                  <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: 'success.main' }}>
                    D.E.M.N Verification
                  </Typography>
                </Stack>
                <Box sx={{ paddingTop: 0.75 }}>
                  <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 0.25 }}>
                    Content Type:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 0.75, display: 'block', color: 'success.main' }}>
                    Personal Content
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: 0.25 }}>
                    D.E.M.N Action:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.5, color: 'text.secondary', margin: 0 }}>
                    No factual claims detected. Personal expression approved and published instantly.
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ fontSize: '8px', color: 'success.main', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)', px: 0.5, py: 0.25, borderRadius: '4px' }}>
                      ✓ Safe Content
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '8px', color: 'success.main', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)', px: 0.5, py: 0.25, borderRadius: '4px' }}>
                      ⚡ Instant Publish
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;