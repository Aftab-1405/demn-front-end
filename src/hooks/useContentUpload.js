import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadsAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { compressImage } from '../utils/imageCompression';

/**
 * Custom hook for content upload (posts and reels)
 * Consolidates all pre-processing and upload logic
 * 
 * @param {string} contentType - 'post' or 'reel'
 * @param {object} api - API methods { create, getProcessingStatus }
 * @param {object} config - Configuration { maxBytes, allowedExt, contentField, contentType }
 */
export const useContentUpload = (contentType, api, config) => {
  const {
    maxBytes,
    allowedExt,
    contentField, // 'image' or 'video'
    contentType: uploadContentType, // 'image' or 'video' for pre-process
    title,
    analyzeMessage,
    readyMessage
  } = config;

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-processing state
  const [isPreProcessing, setIsPreProcessing] = useState(false);
  const [preProcessComplete, setPreProcessComplete] = useState(false);
  const [preProcessingToken, setPreProcessingToken] = useState(null);
  const [preProcessStatus, setPreProcessStatus] = useState('');
  const [preProcessFailed, setPreProcessFailed] = useState(false);

  const [moderationError, setModerationError] = useState(null);
  const [showModerationError, setShowModerationError] = useState(false);

  const navigate = useNavigate();
  const { addNotification, showSnackbar } = useNotifications();
  const preProcessPollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = title;
    return () => {
      stopPolling();
    };
  }, [title]);

  const stopPolling = useCallback(() => {
    if (preProcessPollRef.current) {
      clearInterval(preProcessPollRef.current);
      preProcessPollRef.current = null;
    }
  }, []);

  // Poll pre-processing task status
  const pollPreProcessStatus = useCallback((taskId) => {
    stopPolling();

    console.log('[PRE-PROCESS POLL] Starting status polling for task:', taskId);

    const startTime = Date.now();
    const MAX_POLL_TIME = 3 * 60 * 1000; // 3 minutes timeout
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 5;

    preProcessPollRef.current = setInterval(async () => {
      try {
        // Check timeout (only for videos)
        if (uploadContentType === 'video') {
          const elapsed = Date.now() - startTime;
          if (elapsed > MAX_POLL_TIME) {
            console.warn('[PRE-PROCESS POLL] ⏱️ Timeout after 3 minutes, stopping polling');
            stopPolling();
            setPreProcessStatus(`Pre-processing timeout (will process during upload)`);
            setIsPreProcessing(false);
            setPreProcessComplete(false);
            setPreProcessingToken(null);
            return;
          }
        }

        const response = await uploadsAPI.getPreProcessStatus(taskId);
        const { state, status, result } = response.data;

        // Reset error counter on successful response
        consecutiveErrors = 0;

        console.log('[PRE-PROCESS POLL] Status:', state, status);

        if (state === 'PENDING') {
          setPreProcessStatus('Waiting to start...');
        } else if (state === 'PROGRESS') {
          setPreProcessStatus(status || analyzeMessage);
        } else if (state === 'SUCCESS') {
          // Check for moderation error or task failure
          if (result) {
            if (result.moderation_error) {
              // MODERATION FAILED
              stopPolling();
              setIsPreProcessing(false);
              setPreProcessFailed(true);
              setModerationError(result.moderation_error);
              setShowModerationError(true);
              showSnackbar('Content violates community guidelines', 'error');
              return;
            }
            
            // For videos, check success flag
            if (uploadContentType === 'video' && result.success === false) {
              stopPolling();
              setPreProcessStatus('Pre-processing unavailable (will process during upload)');
              setIsPreProcessing(false);
              setPreProcessComplete(false);
              setPreProcessingToken(null);
              return;
            }
          }

          // SUCCESS
          stopPolling();
          setPreProcessStatus(readyMessage);
          setPreProcessComplete(true);
          setIsPreProcessing(false);
          showSnackbar(readyMessage, 'success');
        } else if (state === 'FAILURE' || state === 'RETRY') {
          stopPolling();
          setPreProcessStatus('Pre-processing unavailable (will process during upload)');
          setIsPreProcessing(false);
          setPreProcessComplete(false);
          setPreProcessingToken(null);
          console.warn('[PRE-PROCESS POLL] ⚠️ Failed, will process during upload');
        }
      } catch (pollErr) {
        consecutiveErrors++;
        console.warn(`[PRE-PROCESS POLL] Error (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}):`, pollErr);

        // Stop polling on fatal errors or too many consecutive errors
        if (pollErr.response?.status === 404 || consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          stopPolling();
          setIsPreProcessing(false);
          setPreProcessStatus('Pre-processing unavailable (will process during upload)');
          setPreProcessComplete(false);
          setPreProcessingToken(null);
        }
      }
    }, 2000);
  }, [stopPolling, uploadContentType, analyzeMessage, readyMessage, showSnackbar]);

  const handleFileChange = useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const ext = (selectedFile.name.split('.').pop() || '').toLowerCase();
    if (!allowedExt.includes(ext)) {
      showSnackbar(`Unsupported ${contentField} type. Allowed: ${allowedExt.join(', ')}.`, 'error');
      return;
    }
    if (selectedFile.size > maxBytes) {
      const maxMB = Math.round(maxBytes / (1024 * 1024));
      showSnackbar(`${contentField === 'image' ? 'Image' : 'Video'} is too large. Maximum allowed size is ${maxMB} MB.`, 'error');
      return;
    }

    setError('');

    // Image compression (only for posts) - happens silently in background
    let processedFile = selectedFile;
    if (contentType === 'post') {
      try {
        processedFile = await compressImage(selectedFile);
      } catch (compressionErr) {
        console.error("Image compression failed:", compressionErr);
        // Silently fall back to original file if compression fails
        processedFile = selectedFile;
      }
    }

    setFile(processedFile);
    setPreview(URL.createObjectURL(processedFile));

    // Start pre-processing
    setIsPreProcessing(true);
    setPreProcessComplete(false);
    setPreProcessFailed(false);
    setPreProcessStatus(`Starting ${contentField} analysis...`);

    try {
      const formData = new FormData();
      formData.append('file', processedFile);
      formData.append('content_type', uploadContentType);

      const response = await uploadsAPI.startPreProcess(formData);

      if (response.data.success) {
        const taskId = response.data.task_id;
        const token = response.data.processing_token;

        setPreProcessingToken(token);
        pollPreProcessStatus(taskId);
      } else {
        setIsPreProcessing(false);
        setPreProcessStatus('Pre-processing unavailable (will process during upload)');
      }
    } catch (err) {
      console.error('[PRE-PROCESS] Failed:', err);
      const errorMsg = err.response?.data?.error || 'Pre-processing failed';
      if (contentType === 'post') {
        showSnackbar(`Analysis skipped: ${errorMsg}`, 'warning');
      }
      setIsPreProcessing(false);
      setPreProcessStatus('Pre-processing unavailable (will process during upload)');
      setPreProcessFailed(false); // Allow user to try submit anyway
    }
  }, [contentType, contentField, uploadContentType, allowedExt, maxBytes, pollPreProcessStatus, showSnackbar]);

  const handleRemoveMedia = useCallback(() => {
    setFile(null);
    setPreview(null);
    setIsPreProcessing(false);
    setPreProcessComplete(false);
    setPreProcessFailed(false);
    setPreProcessingToken(null);
    setPreProcessStatus('');
    stopPolling();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [stopPolling]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!file) {
      showSnackbar(`Please select a ${contentField}`, 'error');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append(contentField, file);
    formData.append('caption', caption);

    if (preProcessingToken) {
      formData.append('processing_token', preProcessingToken);
    }

    try {
      // Call API create method (supports onProgress callback if needed)
      const response = await api.create(formData);
      const contentData = response.data[contentType];
      const contentId = contentData.id;

      // Store content data for instant feed update
      sessionStorage.setItem(`pending_${contentType}_${contentId}`, JSON.stringify(contentData));

      addNotification({
        [`${contentType}Id`]: contentId,
        type: 'processing',
        message: `Submitting ${contentType}...`,
        progress: 5,
        persistent: true
      });

      showSnackbar(
        `${contentType === 'post' ? 'Post' : 'Reel'} submitted! Processing in background...`,
        'success',
        { duration: 4000 }
      );
      navigate('/feed', { replace: true });

    } catch (err) {
      setLoading(false);
      if (err.response && [400, 500, 503].includes(err.response.status)) {
        setModerationError(err.response.data);
        setShowModerationError(true);
      } else {
        const errorMsg = err.response?.data?.error || `Failed to create ${contentType}`;
        setError(errorMsg);
        showSnackbar(errorMsg, 'error');
      }
    }
  }, [file, caption, preProcessingToken, contentType, contentField, api, addNotification, navigate, showSnackbar]);

  return {
    // State
    file,
    caption,
    setCaption,
    preview,
    loading,
    error,
    isPreProcessing,
    preProcessComplete,
    preProcessStatus,
    preProcessFailed,
    moderationError,
    showModerationError,
    setShowModerationError,
    setModerationError,
    
    // Refs
    fileInputRef,
    
    // Handlers
    handleFileChange,
    handleRemoveMedia,
    handleSubmit,
  };
};

