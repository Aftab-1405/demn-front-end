import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
  Button,
  Stack,
} from '@mui/material';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - D.E.M.N';
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: { xs: 3, sm: 6 },
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          bgcolor: 'background.paper',
          borderRadius: 3,
          padding: { xs: 3, sm: 4, md: 6 },
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
              fontWeight: 700,
              marginBottom: 1,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'text.disabled',
              marginBottom: 4,
            }}
          >
            Last Updated: {new Date().toLocaleDateString('en-IN')}
          </Typography>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🔒 Your Privacy Matters
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                lineHeight: 1.75,
                color: 'text.secondary',
                marginBottom: 2,
              }}
            >
            At D.E.M.N, we are committed to protecting your privacy and ensuring transparency about how D.E.M.N use AI to keep our platform safe and engaging. This policy explains what data we collect, how we use it, and your rights.
            </Typography>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📊 Information We Collect
            </Typography>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              Account Information
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {['Username, email address, and password (encrypted)', 'Profile picture and bio (optional)', 'Account creation date'].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              Content You Create
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {['Posts, reels, captions, and comments', 'Images and videos you upload', 'Likes, follows, and interactions'].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              Automatically Collected Data
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {['Device information and browser type', 'IP address and general location (for security)', 'Usage patterns and analytics (anonymized)'].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}14 100%)`,
              padding: 3,
              borderRadius: 2,
              border: 2,
              borderColor: 'primary.light',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🤖 How D.E.M.N Use AI
            </Typography>
            <Box
              sx={{
                bgcolor: 'primary.light',
                padding: 1.5,
                borderRadius: 1,
                borderLeft: 4,
                borderColor: 'primary.main',
                fontWeight: 500,
                color: 'primary.dark',
                marginBottom: 2,
              }}
            >
              <Typography sx={{ fontWeight: 500, color: 'primary.dark' }}>
            D.E.M.N uses AI to make platform safer and more engaging. Here&apos;s exactly how:
              </Typography>
            </Box>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              1. Content Fact-Checking (Posts & Reels)
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {[
                { label: 'What:', text: 'D.E.M.N analyze text and images in your posts/reels for factual accuracy' },
                { label: 'Purpose:', text: 'Combat misinformation and provide verified content' },
                { label: 'Privacy:', text: 'Only caption text and images are processed; your identity is NOT sent to AI' },
                { label: 'Storage:', text: 'D.E.M.N store only the verification result (verified/disputed), not raw AI responses' },
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.label}
                  </Typography>{' '}
                  {item.text}
                </Box>
              ))}
            </Box>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              2. Content Moderation (All User Content)
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {[
                { label: 'What:', text: 'D.E.M.N checks posts, reels, and comments for policy violations' },
                { label: 'Purpose:', text: 'Prevent hate speech, harassment, explicit content, and spam' },
                { label: 'Privacy:', text: 'Content text/images are processed temporarily; no personal data shared' },
                { label: 'Storage:', text: 'Violation reports stored for safety; content not used to train AI models' },
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.label}
                  </Typography>{' '}
                  {item.text}
                </Box>
              ))}
            </Box>

            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              3. Comment Suggestions
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {[
                { label: 'What:', text: 'D.E.M.N generates contextual comment suggestions based on post captions' },
                { label: 'Purpose:', text: 'Help users engage with natural, friendly comments' },
                { label: 'Privacy:', text: 'Only the post caption is processed; completely optional feature' },
                { label: 'Storage:', text: 'Suggestions are generated in real-time and not stored' },
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.label}
                  </Typography>{' '}
                  {item.text}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                bgcolor: 'background.default',
                padding: 3,
                borderRadius: 2,
                border: 2,
                borderColor: 'success.main',
                marginTop: 3,
              }}
            >
              <Typography
                variant="h6"
                component="h4"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'success.main',
                  marginBottom: 2,
                }}
              >
                🛡️ Data Protection Guarantees
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0 }}>
                {[
                  'Your personal identity (name, email, username) is NEVER sent to AI',
                  'All data is transmitted over encrypted HTTPS connections',
                  'Your content is NOT used to train AI models',
                  'AI processing is temporary; data is not stored at servers',
                  'You retain full ownership of your content',
                  'You can delete your content at any time',
                ].map((item, index) => (
                  <Box
                    key={index}
                    component="li"
                    sx={{
                      paddingLeft: 4,
                      marginBottom: 1.5,
                      position: 'relative',
                      color: 'text.primary',
                      '&::before': {
                        content: '"✅"',
                        position: 'absolute',
                        left: 0,
                      },
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🔐 How D.E.M.N Protect Your Data
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {[
                { label: 'Encryption:', text: 'All passwords are encrypted using industry-standard bcrypt' },
                { label: 'Secure Transmission:', text: 'HTTPS encryption for all data transfers' },
                { label: 'Access Control:', text: 'Only you can access and modify your content' },
                { label: 'Regular Audits:', text: 'D.E.M.N monitor for security vulnerabilities' },
                { label: 'No Selling:', text: 'D.E.M.N NEVER sell your personal data to third parties' },
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.label}
                  </Typography>{' '}
                  {item.text}
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📝 Your Rights
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{
                marginTop: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(160px, 1fr))' },
              }}
            >
              {[
                { title: 'Access Your Data', description: "View all content you've created through your profile" },
                { title: 'Delete Your Data', description: 'Delete individual posts, comments, or your entire account' },
                { title: 'Export Your Data', description: 'Request a copy of your data (contact support)' },
                { title: 'Opt-Out of AI', description: 'Contact support to disable AI features (may limit functionality)' },
              ].map((right, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      bgcolor: 'background.default',
                      padding: 2,
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      height: '100%',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}1A`,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontSize: '1rem',
                        marginTop: 0,
                        marginBottom: 1,
                        color: 'primary.main',
                      }}
                    >
                      {right.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        marginBottom: 0,
                        color: 'text.secondary',
                      }}
                    >
                      {right.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🇮🇳 Compliance & Legal
            </Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary', marginBottom: 1.5 }}>
              We comply with:
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', paddingLeft: 0, margin: '12px 0' }}>
              {[
                'Information Technology Act, 2000 (D.E.M.N)',
                'IT Rules 2021 (Intermediary Guidelines)',
                'Personal Data Protection Bill (when enacted)',
                'GDPR (for EU users)',
              ].map((item, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    paddingLeft: 4,
                    marginBottom: 1,
                    position: 'relative',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'text.secondary',
                    '&::before': {
                      content: '"→"',
                      position: 'absolute',
                      left: 1,
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.split(' ')[0]}
                  </Typography>{' '}
                  {item.split(' ').slice(1).join(' ')}
                </Box>
              ))}
            </Box>
            <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary', marginTop: 1.5 }}>
            Our servers are located in India. By using our platform, you consent to data processing as described in this policy.
            </Typography>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              👶 Age Requirement
            </Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary' }}>
              You must be at least <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>13 years old</Typography> to use D.E.M.N. We do not knowingly collect data from children under 13. If you believe a child has created an account, please contact us immediately.
            </Typography>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🔄 Changes to This Policy
            </Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary' }}>
            We may update this privacy policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use after changes constitutes acceptance.
            </Typography>
          </Box>

          <Box
            sx={{
              marginBottom: 4,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📧 Contact Us
            </Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary', marginBottom: 1.5 }}>
            Questions about privacy or AI usage? We&apos;re here to help:
            </Typography>
            <Box
              sx={{
                bgcolor: 'background.default',
                padding: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography sx={{ marginBottom: 1, fontSize: '1rem', color: 'text.secondary' }}>
                <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>Email:</Typography> privacy@demn-app.com
              </Typography>
              <Typography sx={{ marginBottom: 1, fontSize: '1rem', color: 'text.secondary' }}>
                <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>Data Protection Officer:</Typography> dpo@demn-app.com
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>Support:</Typography>{' '}
                <Link component={RouterLink} to="/support" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                  Contact Support
                </Link>
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: 4,
              paddingTop: 3,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
            >
              Back to Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrivacyPolicy;
