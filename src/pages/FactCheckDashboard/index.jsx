import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '../../context/NotificationContext';
import { Box, Button } from '@mui/material';
import { factCheckAPI, postsAPI, reelsAPI } from '../../services/api';
import Spinner from '../../components/Spinner';
import { SkeletonFactCheckDashboard } from '../../components/Skeleton';

// Local components
import ReportHeader from './components/ReportHeader';
import ContentPreview from './components/ContentPreview';
import ExecutiveSummary from './components/ExecutiveSummary';
import VerificationReport from './components/VerificationReport';
import EditSuggestions from './components/EditSuggestions';
import ActionSelector from './components/ActionSelector';
import TextModal from './components/TextModal';

// Utils
import { updateFeedCache } from './utils/helpers';

const FactCheckDashboard = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSnackbar } = useNotifications();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [factCheck, setFactCheck] = useState(null);
    const [content, setContent] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [error, setError] = useState('');
    const [progressStage, setProgressStage] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    const showInModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const fetchContent = useCallback(() => {
        let pollInterval = null;
        const loadData = async () => {
            try {
                setLoading(true);

                const contentResponse =
                    type === 'post'
                        ? await postsAPI.getPost(id)
                        : await reelsAPI.getReel(id);

                const contentData = contentResponse.data[type];
                setContent(contentData);

                const factCheckResponse =
                    type === 'post'
                        ? await factCheckAPI.getPostFactCheckStatus(id)
                        : await factCheckAPI.getReelFactCheckStatus(id);

                const fcData = factCheckResponse.data.fact_check;

                if (fcData) {
                    setFactCheck(fcData);
                    setLoading(false);
                    setProcessing(false);
                } else {
                    setLoading(false);
                    setProcessing(true);
                    setProgressStage('AI is analyzing your content. This may take a moment...');

                    pollInterval = setInterval(async () => {
                        try {
                            const statusResp =
                                type === 'post'
                                    ? await factCheckAPI.getPostFactCheckStatus(id)
                                    : await factCheckAPI.getReelFactCheckStatus(id);

                            const newFcData = statusResp.data.fact_check;

                            if (newFcData) {
                                clearInterval(pollInterval);
                                setFactCheck(newFcData);
                                setProcessing(false);
                            }
                        } catch (pollErr) {
                            console.warn('Dashboard poll error:', pollErr);
                        }
                    }, 3000);
                }
            } catch (err) {
                const errorMsg = 'Failed to load content';
                setError(errorMsg);
                showSnackbar(errorMsg, 'error');
                setLoading(false);
                if (pollInterval) clearInterval(pollInterval);
            }
        };

        loadData();

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [type, id]);

    useEffect(() => {
        document.title = 'Fact Check Report | Creator Dashboard';
        const cleanup = fetchContent();
        return cleanup;
    }, [fetchContent]);

    const handleApprove = async () => {
        if (!selectedAction) {
            showSnackbar('Please select an option', 'error');
            return;
        }
        try {
            setIsSubmitting(true);

            const response = await (type === 'post'
                ? factCheckAPI.approvePost(id, selectedAction)
                : factCheckAPI.approveReel(id, selectedAction));

            if (selectedAction === 'cancel') {
                showSnackbar('Content deleted successfully', 'success');
                navigate('/feed', { replace: true });
            } else {
                const approvedItem = response.data[type];
                if (approvedItem) {
                    const itemWithMeta = { ...approvedItem, type: type };
                    updateFeedCache(queryClient, itemWithMeta);
                }

                if (selectedAction === 'apply_ai_fix') {
                    showSnackbar('AI corrections applied! Content published! 🎉', 'success');
                } else {
                    showSnackbar('Content published successfully! 🎉', 'success');
                }

                navigate('/feed', { replace: true });
            }
        } catch (err) {
            const errorMsg = 'Failed to process action';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                <SkeletonFactCheckDashboard />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ width: '100%' }}>
                <Box
                    sx={{
                        maxWidth: 1200,
                        margin: { xs: '12px auto', sm: '18px auto', md: '22px auto' },
                        padding: 2,
                        borderRadius: 1,
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        border: 1,
                        borderColor: 'error.main',
                    }}
                >
                    {error}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box
                sx={{
                    maxWidth: 1200,
                    margin: { xs: '0 auto', sm: '18px auto', md: '22px auto' },
                    padding: { xs: 2, sm: 3, md: 4 },
                }}
            >
                {/* Report Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ReportHeader
                        type={type}
                        id={id}
                        processing={processing}
                        progressStage={progressStage}
                        createdAt={content?.created_at}
                    />
                </motion.div>

                {!processing && factCheck && (
                    <>
                        {/* Executive Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <ExecutiveSummary factCheck={factCheck} />
                        </motion.div>

                        {/* Main Content Grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
                                gap: { xs: 2, md: 3 },
                                marginTop: 3,
                            }}
                        >
                            {/* Left: Content Preview (Sticky) */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <ContentPreview
                                    type={type}
                                    content={content}
                                    factCheck={factCheck}
                                    showInModal={showInModal}
                                />
                            </motion.div>

                            {/* Right: Analysis & Actions */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Verification Report */}
                                {factCheck.verification_results && factCheck.verification_results.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <VerificationReport
                                            verificationResults={factCheck.verification_results}
                                            showInModal={showInModal}
                                        />
                                    </motion.div>
                                )}

                                {/* AI Edit Suggestions */}
                                {factCheck.edit_suggestions && factCheck.edit_suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <EditSuggestions editSuggestions={factCheck.edit_suggestions} />
                                    </motion.div>
                                )}

                                {/* Action Selector */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <ActionSelector
                                        selectedAction={selectedAction}
                                        setSelectedAction={setSelectedAction}
                                        hasEditSuggestions={factCheck.edit_suggestions?.length > 0}
                                        onApprove={handleApprove}
                                        isSubmitting={isSubmitting}
                                    />
                                </motion.div>
                            </Box>
                        </Box>
                    </>
                )}

                {/* Text Modal */}
                <TextModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={modalTitle}
                    content={modalContent}
                />
            </Box>
        </Box>
    );
};

export default FactCheckDashboard;