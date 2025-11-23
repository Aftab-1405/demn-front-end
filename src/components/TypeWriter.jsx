import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, keyframes } from '@mui/material';

// Blinking cursor animation
const blink = keyframes`
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
`;

const TypeWriter = ({ text, onComplete, speed = 30, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDelayed, setIsDelayed] = useState(delay > 0);
  const onCompleteCalledRef = useRef(false);

  // Handle delay
  useEffect(() => {
    if (delay > 0 && isDelayed) {
      const delayTimer = setTimeout(() => {
        setIsDelayed(false);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [delay, isDelayed]);

  // Typewriter effect
  useEffect(() => {
    if (!text || isDelayed) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isDelayed]);

  // Call onComplete when typing is finished
  useEffect(() => {
    if (onComplete && displayText === text && text.length > 0 && !onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true;
      onComplete();
    }
  }, [displayText, text, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsDelayed(delay > 0);
    onCompleteCalledRef.current = false;
  }, [text, delay]);

  return (
    <Box component="span" sx={{ display: 'inline' }}>
      {displayText}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          bgcolor: 'text.primary',
          ml: 0.5,
          verticalAlign: 'baseline',
          animation: `${blink} 1s infinite`,
        }}
      />
    </Box>
  );
};

export default TypeWriter;

TypeWriter.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  speed: PropTypes.number, // Typing speed in milliseconds (lower = faster)
  delay: PropTypes.number, // Delay before starting to type in milliseconds
};