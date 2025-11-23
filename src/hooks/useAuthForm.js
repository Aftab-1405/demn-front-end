import { useState, useCallback } from 'react';
import { useNotifications } from '../context/NotificationContext';

/**
 * Custom hook for authentication forms (Login and Register)
 * Handles form state, validation, and submission
 *
 * @param {string} mode - 'login' or 'register'
 * @param {function} onSubmitFn - Function to call on form submit (login/register)
 * @param {function} onSuccess - Callback on successful submission
 */
export const useAuthForm = (mode, onSubmitFn, onSuccess) => {
  const isLogin = mode === 'login';
  const { showSnackbar } = useNotifications();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ...(isLogin ? {} : { email: '', full_name: '' }),
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) setError('');
  }, [fieldErrors, error]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!formData.full_name.trim()) {
        errors.full_name = 'Full name is required';
      } else if (formData.full_name.length < 2) {
        errors.full_name = 'Full name must be at least 2 characters';
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  }, [formData, isLogin]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0], 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await onSubmitFn(formData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        setError(result.error);
        showSnackbar(result.error || `${mode === 'login' ? 'Login' : 'Registration'} failed`, 'error');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      showSnackbar(err.message || 'An error occurred', 'error');
      setLoading(false);
    }
  }, [formData, validateForm, onSubmitFn, onSuccess, mode, showSnackbar]);

  return {
    formData,
    error,
    loading,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
};



