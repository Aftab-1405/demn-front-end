import { Box, Typography, Card, Grid, Button, Stack } from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Delete as DeleteIcon,
    AutoAwesome as AIIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import Spinner from '../../../components/Spinner';

const ActionSelector = ({
    selectedAction,
    setSelectedAction,
    hasEditSuggestions,
    onApprove,
    isSubmitting,
}) => {
    const actionCards = [
        {
            id: 'publish_as_is',
            icon: CheckIcon,
            title: 'Publish As Is',
            description: 'Content will be published with current verification status visible to users',
            color: 'primary',
            available: true,
        },
        {
            id: 'apply_ai_fix',
            icon: AIIcon,
            title: 'Apply AI Corrections',
            description: 'Automatically apply AI suggestions and publish as "Verified"',
            color: 'success',
            available: false,
            comingSoon: true,
        },
        {
            id: 'cancel',
            icon: DeleteIcon,
            title: 'Delete Content',
            description: 'Permanently delete this content and start over',
            color: 'error',
            available: true,
        },
    ];

    return (
        <Card
            sx={{
                bgcolor: 'background.paper',
                padding: { xs: 2, md: 3 },
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 2.5 }}>
                <Box
                    sx={{
                        bgcolor: 'warning.light',
                        borderRadius: 2,
                        padding: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <WarningIcon sx={{ fontSize: 24, color: 'warning.main' }} />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 700,
                    }}
                >
                    Choose Your Action
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                Review the findings above and decide how you want to proceed:
            </Typography>

            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                {actionCards.map((action) => {
                    const IconComponent = action.icon;
                    const isSelected = selectedAction === action.id;
                    const isDisabled = !action.available;

                    return (
                        <Grid item xs={12} sm={hasEditSuggestions ? 6 : 12} md={hasEditSuggestions ? 4 : 6} key={action.id}>
                            <Card
                                onClick={() => action.available && setSelectedAction(action.id)}
                                sx={{
                                    padding: 2,
                                    borderRadius: 2,
                                    border: 2,
                                    borderColor: isSelected ? `${action.color}.main` : 'divider',
                                    cursor: action.available ? 'pointer' : 'not-allowed',
                                    opacity: isDisabled ? 0.6 : 1,
                                    bgcolor: isSelected ? `${action.color}.lighter` : 'background.default',
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isSelected ? 'translateY(-4px)' : 'none',
                                    boxShadow: isSelected
                                        ? `0 8px 24px ${action.color === 'primary' ? 'rgba(255, 107, 53, 0.25)' : action.color === 'error' ? 'rgba(211, 47, 47, 0.25)' : 'rgba(46, 125, 50, 0.25)'}`
                                        : 'none',
                                    '&:hover': action.available && {
                                        borderColor: `${action.color}.light`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: 1,
                                    },
                                }}
                            >
                                {isSelected && (
                                    <CheckIcon
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            fontSize: 24,
                                            color: `${action.color}.main`,
                                        }}
                                    />
                                )}

                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ marginBottom: 1 }}>
                                    <Box
                                        sx={{
                                            bgcolor: isSelected ? `${action.color}.main` : `${action.color}.lighter`,
                                            color: isSelected ? 'white' : `${action.color}.main`,
                                            borderRadius: 1.5,
                                            padding: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconComponent sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.9375rem',
                                                color: 'text.primary',
                                            }}
                                        >
                                            {action.title}
                                        </Typography>
                                        {action.comingSoon && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'success.main',
                                                    fontWeight: 600,
                                                    fontSize: '0.6875rem',
                                                }}
                                            >
                                                COMING SOON
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontSize: '0.8125rem',
                                        color: 'text.secondary',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {action.description}
                                </Typography>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Button
                onClick={onApprove}
                variant="contained"
                size="large"
                fullWidth
                disabled={!selectedAction || isSubmitting}
                startIcon={isSubmitting ? <Spinner size="sm" color="white" /> : null}
                sx={{
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 2,
                    '&:hover': {
                        boxShadow: 4,
                    },
                    '&:disabled': {
                        opacity: 0.6,
                    },
                }}
            >
                {isSubmitting
                    ? 'Processing...'
                    : selectedAction === 'cancel'
                        ? '🗑️ Confirm Delete'
                        : '🚀 Confirm & Publish'}
            </Button>

            {!selectedAction && (
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: 2,
                        color: 'warning.main',
                        fontWeight: 600,
                    }}
                >
                    ⚠️ Please select an action above to continue
                </Typography>
            )}
        </Card>
    );
};

export default ActionSelector;