import { useState } from 'react';
import { Typography, Button, Box, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
  CheckCircle as VerifiedIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Block as BlockIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Truncated Text Component
export const TruncatedText = ({ text, maxLength = 150, title }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <Typography>N/A</Typography>;
  if (text.length <= maxLength)
    return <Typography sx={{ lineHeight: 1.6 }}>{text}</Typography>;

  const firstPart = text.substring(0, maxLength);
  const secondPart = text.substring(maxLength);

  return (
    <Accordion
      elevation={0}
      disableGutters
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        bgcolor: 'transparent',
        '&:before': { display: 'none' },
        background: 'transparent'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          padding: 0,
          minHeight: 'unset',
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'primary.main',
            alignSelf: 'flex-start',
            marginTop: '4px' // Align icon with first line of text
          }
        }}
      >
        <Typography sx={{ lineHeight: 1.6 }}>
          {firstPart}
          {!expanded && (
            <Typography component="span" color="text.secondary">...</Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Typography sx={{ lineHeight: 1.6 }}>{secondPart}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

// Render Verification Badge
export const renderVerificationBadge = (status, size = 'medium') => {
  const badges = {
    verified: { text: '✅ Verified', color: 'success' },
    disputed: { text: '⚠️ Disputed', color: 'error' },
    unverified: { text: '🔍 Unverified', color: 'warning' },
    no_claims: { text: '✅ No Claims', color: 'success' },
    personal: { text: '👤 Personal', color: 'info' },
    context_mismatch: { text: '🚫 Context Mismatch', color: 'error' },
    flagged: { text: '⚠️ Flagged', color: 'error' },
    not_applicable: { text: '✅ Not Applicable', color: 'success' },
  };
  const badge = badges[status] || badges.unverified;

  return (
    <Chip
      label={badge.text}
      color={badge.color}
      size={size === 'large' ? 'medium' : 'small'}
      sx={{
        fontWeight: 700,
        fontSize: size === 'large' ? '0.875rem' : '0.75rem',
        padding: size === 'large' ? '6px 12px' : '4px 8px',
      }}
    />
  );
};

// Get Status Icon
export const getStatusIcon = (status) => {
  const icons = {
    verified: VerifiedIcon,
    disputed: ErrorIcon,
    unverified: WarningIcon,
    no_claims: InfoIcon,
    personal: PersonIcon,
    context_mismatch: BlockIcon,
    flagged: ErrorIcon,
    not_applicable: InfoIcon,
  };
  return icons[status] || HelpIcon;
};

// Calculate Risk Score
export const calculateRiskScore = (factCheck) => {
  if (!factCheck.verification_results || factCheck.verification_results.length === 0) {
    return { score: 0, label: 'No Risk', color: 'success.main' };
  }

  const totalClaims = factCheck.verification_results.length;
  let riskPoints = 0;

  factCheck.verification_results.forEach((result) => {
    if (result.issue) {
      // Context mismatch - high risk
      riskPoints += result.severity === 'high' ? 40 : 25;
    } else if (result.verification) {
      const status = result.verification.status;
      if (status === 'disputed') {
        riskPoints += 30;
      } else if (status === 'unverified') {
        riskPoints += 15;
      }
    }
  });

  // Cap at 100
  const score = Math.min(100, Math.round(riskPoints));

  let label, color;
  if (score <= 20) {
    label = 'Low Risk';
    color = 'success.main';
  } else if (score <= 50) {
    label = 'Medium Risk';
    color = 'warning.main';
  } else {
    label = 'High Risk';
    color = 'error.main';
  }

  return { score, label, color };
};

// Update Feed Cache (for optimistic updates)
export const updateFeedCache = (queryClient, newItem) => {
  queryClient.setQueryData(['feed'], (oldData) => {
    if (!oldData || !oldData.pages) return undefined;

    const newPages = [...oldData.pages];

    if (newPages.length > 0) {
      const firstPage = newPages[0];
      newPages[0] = {
        ...firstPage,
        feed: [newItem, ...(firstPage.feed || [])],
      };
    }

    return {
      ...oldData,
      pages: newPages,
    };
  });
};