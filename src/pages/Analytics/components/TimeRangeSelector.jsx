import { Box, ButtonGroup, Button } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const TimeRangeSelector = ({ timeRange, setTimeRange }) => {
    const ranges = [
        { value: 7, label: 'Last 7 Days' },
        { value: 30, label: 'Last 30 Days' },
        { value: 90, label: 'Last 90 Days' },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 4,
            }}
        >
            <ButtonGroup
                variant="outlined"
                size="large"
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '& .MuiButton-root': {
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                        },
                    },
                }}
            >
                {ranges.map((range) => (
                    <Button
                        key={range.value}
                        variant={timeRange === range.value ? 'contained' : 'outlined'}
                        onClick={() => setTimeRange(range.value)}
                        startIcon={timeRange === range.value ? <CalendarIcon /> : null}
                        sx={{
                            minWidth: { xs: 'auto', sm: 140, md: 160 },
                            padding: { xs: '12px 16px', md: '14px 24px' },
                            fontSize: { xs: '0.875rem', md: '0.9375rem' },
                            fontWeight: 700,
                            borderRadius: { xs: 0, sm: 2 },
                            textTransform: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:first-of-type': {
                                borderTopLeftRadius: 8,
                                borderBottomLeftRadius: 8,
                            },
                            '&:last-of-type': {
                                borderTopRightRadius: 8,
                                borderBottomRightRadius: 8,
                            },
                            ...(timeRange === range.value && {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-2px)',
                            }),
                        }}
                    >
                        {range.label}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default TimeRangeSelector;