import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const TextModal = ({ isOpen, onClose, title, content }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    m: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100%' : '90vh',
                },
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                },
            }}
        >
            <DialogTitle
                sx={{
                    pt: 3,
                    pr: 6,
                    pb: 2,
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                }}
            >
                {title}
            </DialogTitle>

            <IconButton
                aria-label="Close dialog"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    '&:hover': {
                        bgcolor: 'action.selected',
                    },
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent
                sx={{
                    pt: 3,
                    px: 3,
                    pb: 3,
                    bgcolor: 'background.paper',
                }}
            >
                <Box
                    sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        fontSize: '0.9375rem',
                        color: 'text.primary',
                    }}
                >
                    {content}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TextModal;