/**
 * Centralized Error Handling Utility
 *
 * Standardizes error handling across the application:
 * - Extracts meaningful error messages from various error formats
 * - Handles different HTTP status codes appropriately
 * - Provides consistent error messaging
 * - Supports error logging and monitoring
 * - Type-safe error extraction
 */

/**
 * HTTP Status Code Categories
 */
export const ErrorCategory = {
  CLIENT_ERROR: 'CLIENT_ERROR', // 4xx errors
  SERVER_ERROR: 'SERVER_ERROR', // 5xx errors
  NETWORK_ERROR: 'NETWORK_ERROR', // Network/connection errors
  TIMEOUT_ERROR: 'TIMEOUT_ERROR', // Request timeout
  UNKNOWN_ERROR: 'UNKNOWN_ERROR', // Unexpected errors
};

/**
 * Common HTTP Status Codes
 */
export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * User-friendly error messages for common status codes
 */
const STATUS_MESSAGES = {
  [HttpStatus.BAD_REQUEST]: 'Invalid request. Please check your input and try again.',
  [HttpStatus.UNAUTHORIZED]: 'Please log in to continue.',
  [HttpStatus.FORBIDDEN]: "You don't have permission to perform this action.",
  [HttpStatus.NOT_FOUND]: 'The requested resource was not found.',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'This action is not allowed.',
  [HttpStatus.CONFLICT]: 'This action conflicts with existing data.',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'The data provided is invalid.',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Server error. Please try again later.',
  [HttpStatus.BAD_GATEWAY]: 'Service temporarily unavailable. Please try again.',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again.',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Request timeout. Please try again.',
};

/**
 * Extract error message from various error formats
 *
 * Handles errors from:
 * - Axios errors (error.response.data)
 * - Fetch API errors
 * - Custom API errors
 * - JavaScript errors
 * - Network errors
 *
 * @param {Error|Object} error - The error object
 * @returns {string} - Extracted error message
 */
export const getErrorMessage = (error) => {
  // Handle null/undefined
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Direct string error
  if (typeof error === 'string') {
    return error;
  }

  // Axios error response format
  if (error.response) {
    const { data, status } = error.response;

    // Try to extract error from response data (various formats)
    if (data) {
      // Format: { error: "message" }
      if (data.error && typeof data.error === 'string') {
        return data.error;
      }

      // Format: { message: "message" }
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }

      // Format: { detail: "message" }
      if (data.detail && typeof data.detail === 'string') {
        return data.detail;
      }

      // Format: { errors: ["error1", "error2"] }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0];
      }

      // Format: { errors: { field: ["error1"] } }
      if (data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }

    // Fallback to status message if no specific error found
    if (STATUS_MESSAGES[status]) {
      return STATUS_MESSAGES[status];
    }

    return `Request failed with status ${status}`;
  }

  // Network error (no response received)
  if (error.request) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timeout. Please check your connection and try again.';
    }
    return 'Network error. Please check your connection and try again.';
  }

  // Error message property
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
};

/**
 * Get error category based on error details
 *
 * @param {Error|Object} error - The error object
 * @returns {string} - Error category
 */
export const getErrorCategory = (error) => {
  if (!error) {
    return ErrorCategory.UNKNOWN_ERROR;
  }

  // Network/timeout errors
  if (error.request && !error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return ErrorCategory.TIMEOUT_ERROR;
    }
    return ErrorCategory.NETWORK_ERROR;
  }

  // HTTP errors
  if (error.response?.status) {
    const status = error.response.status;
    if (status >= 400 && status < 500) {
      return ErrorCategory.CLIENT_ERROR;
    }
    if (status >= 500 && status < 600) {
      return ErrorCategory.SERVER_ERROR;
    }
  }

  return ErrorCategory.UNKNOWN_ERROR;
};

/**
 * Check if error should trigger logout (authentication errors)
 *
 * @param {Error|Object} error - The error object
 * @returns {boolean} - True if should logout
 */
export const shouldLogout = (error) => {
  if (!error?.response) {
    return false;
  }

  const status = error.response.status;
  return status === HttpStatus.UNAUTHORIZED;
};

/**
 * Check if error is a validation error
 *
 * @param {Error|Object} error - The error object
 * @returns {boolean} - True if validation error
 */
export const isValidationError = (error) => {
  if (!error?.response) {
    return false;
  }

  const status = error.response.status;
  return status === HttpStatus.BAD_REQUEST || status === HttpStatus.UNPROCESSABLE_ENTITY;
};

/**
 * Check if error is retriable (temporary failures)
 *
 * @param {Error|Object} error - The error object
 * @returns {boolean} - True if should retry
 */
export const isRetriableError = (error) => {
  // Network errors are retriable
  if (error.request && !error.response) {
    return true;
  }

  // Server errors are retriable
  if (error.response?.status) {
    const status = error.response.status;
    return status >= 500 || status === HttpStatus.TOO_MANY_REQUESTS;
  }

  return false;
};

/**
 * Comprehensive error handler for API calls
 * Returns a standardized error object
 *
 * @param {Error|Object} error - The error object
 * @param {Object} options - Handler options
 * @param {string} options.context - Context where error occurred (for logging)
 * @param {Function} options.onUnauthorized - Callback for unauthorized errors
 * @param {boolean} options.showNotification - Whether to show user notification
 * @param {string} options.fallbackMessage - Custom fallback message
 * @returns {Object} - Standardized error object
 */
export const handleApiError = (error, options = {}) => {
  const {
    context = 'API Request',
    onUnauthorized = null,
    showNotification = true,
    fallbackMessage = null,
  } = options;

  // Extract error details
  const message = fallbackMessage || getErrorMessage(error);
  const category = getErrorCategory(error);
  const status = error.response?.status || null;
  const isRetriable = isRetriableError(error);

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}] Error:`, {
      message,
      category,
      status,
      isRetriable,
      originalError: error,
    });
  }

  // Handle unauthorized errors
  if (shouldLogout(error) && onUnauthorized) {
    onUnauthorized();
  }

  // Return standardized error object
  return {
    message,
    category,
    status,
    isRetriable,
    showNotification,
    originalError: error,
  };
};

/**
 * Format validation errors for form display
 *
 * @param {Error|Object} error - The error object
 * @returns {Object} - Field errors object { field: "error message" }
 */
export const extractValidationErrors = (error) => {
  if (!error?.response?.data) {
    return {};
  }

  const { data } = error.response;
  const fieldErrors = {};

  // Format: { errors: { field: ["error1", "error2"] } }
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    Object.entries(data.errors).forEach(([field, errors]) => {
      if (Array.isArray(errors) && errors.length > 0) {
        fieldErrors[field] = errors[0];
      } else if (typeof errors === 'string') {
        fieldErrors[field] = errors;
      }
    });
  }

  return fieldErrors;
};

/**
 * Create a user-friendly error message for common scenarios
 *
 * @param {string} action - The action being performed (e.g., "create post", "update profile")
 * @param {Error|Object} error - The error object
 * @returns {string} - User-friendly message
 */
export const formatErrorForAction = (action, error) => {
  const baseMessage = getErrorMessage(error);
  const category = getErrorCategory(error);

  switch (category) {
    case ErrorCategory.NETWORK_ERROR:
      return `Unable to ${action}. Please check your internet connection.`;

    case ErrorCategory.TIMEOUT_ERROR:
      return `Request timed out while trying to ${action}. Please try again.`;

    case ErrorCategory.SERVER_ERROR:
      return `Server error while trying to ${action}. Please try again later.`;

    case ErrorCategory.CLIENT_ERROR:
      if (shouldLogout(error)) {
        return 'Your session has expired. Please log in again.';
      }
      return baseMessage || `Unable to ${action}. Please check your input.`;

    default:
      return baseMessage || `Failed to ${action}. Please try again.`;
  }
};

export default {
  getErrorMessage,
  getErrorCategory,
  shouldLogout,
  isValidationError,
  isRetriableError,
  handleApiError,
  extractValidationErrors,
  formatErrorForAction,
  ErrorCategory,
  HttpStatus,
};
