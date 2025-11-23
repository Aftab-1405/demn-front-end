import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Link } from '@mui/material';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction
}) => {
  // Container orchestrates the timing of children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  // Smooth fade-up for text elements
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Specific variant for icon to maintain the design's opacity and add a gentle pop
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 0.5, // Matches the CSS design intent
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const MotionBox = motion(Box);

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        minHeight: 300,
      }}
    >
      {icon && (
        <MotionBox
          variants={iconVariants}
          sx={{
            fontSize: { xs: '2rem', md: '4rem' },
            mb: 6,
            '& svg': {
              width: { xs: 48, md: 80 },
              height: { xs: 48, md: 80 },
              color: 'text.disabled',
            },
          }}
        >
          {icon}
        </MotionBox>
      )}

      {title && (
        <MotionBox
          component={Typography}
          variant="h4"
          variants={itemVariants}
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {title}
        </MotionBox>
      )}

      {description && (
        <MotionBox
          component={Typography}
          variant="body1"
          variants={itemVariants}
          sx={{
            fontSize: '1rem',
            color: 'text.secondary',
            maxWidth: 500,
            mx: 'auto',
            mb: 6,
            lineHeight: 1.6,
          }}
        >
          {description}
        </MotionBox>
      )}

      {actionLabel && (
        <MotionBox variants={itemVariants} sx={{ display: 'block' }}>
          {actionLink ? (
            <Button
              component={RouterLink}
              to={actionLink}
              variant="contained"
              color="primary"
            >
              {actionLabel}
            </Button>
          ) : onAction ? (
            <Button
              onClick={onAction}
              variant="contained"
              color="primary"
            >
              {actionLabel}
            </Button>
          ) : null}
        </MotionBox>
      )}
    </MotionBox>
  );
};

export default EmptyState;