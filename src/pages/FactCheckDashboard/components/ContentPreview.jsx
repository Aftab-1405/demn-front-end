import { Box, Typography, Card } from '@mui/material';
import { BACKEND_URL } from '../../../services/api';
import { TruncatedText } from '../utils/helpers.jsx';

const ContentPreview = ({ type, content, factCheck, showInModal }) => {
    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                padding: { xs: 2, md: 2.5 },
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                position: { md: 'sticky' },
                top: { md: '20px' },
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    fontWeight: 700,
                    marginBottom: 2,
                    paddingBottom: 1.5,
                    borderBottom: 2,
                    borderColor: 'primary.main',
                }}
            >
                📄 Your Content
            </Typography>

            {type === 'post' && content?.image_url && (
                <Box
                    component="img"
                    src={`${BACKEND_URL}${content.image_url}`}
                    alt="Post"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        border: 1,
                        borderColor: 'divider',
                        height: 'auto',
                        marginBottom: content?.caption || factCheck.extracted_text ? 2 : 0,
                    }}
                />
            )}

            {type === 'reel' && content?.video_url && (
                <Box
                    component="video"
                    src={`${BACKEND_URL}${content.video_url}`}
                    controls
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        border: 1,
                        borderColor: 'divider',
                        height: 'auto',
                        marginBottom: content?.caption || factCheck.extracted_text ? 2 : 0,
                    }}
                />
            )}

            {content?.caption && (
                <Box
                    sx={{
                        marginTop: 2,
                        paddingTop: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            marginBottom: 1,
                            fontWeight: 700,
                        }}
                    >
                        Caption:
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            color: 'text.primary',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {content.caption}
                    </Typography>
                </Box>
            )}

            {factCheck.extracted_text && (
                <Box
                    sx={{
                        marginTop: 2,
                        paddingTop: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            marginBottom: 1,
                            fontWeight: 700,
                        }}
                    >
                        Extracted Text from Media:
                    </Typography>
                    <Box
                        sx={{
                            fontFamily: 'Courier New, Courier, monospace',
                            fontSize: '0.8125rem',
                            bgcolor: 'action.selected',
                            padding: 1.5,
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <TruncatedText
                            text={factCheck.extracted_text}
                            maxLength={200}
                            title="Extracted Text"
                            showInModal={showInModal}
                        />
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default ContentPreview;