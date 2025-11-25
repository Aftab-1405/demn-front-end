# Error Handling Guide

This guide explains how to use the centralized error handling utility (`errorHandling.js`) across the application.

## Table of Contents
1. [Overview](#overview)
2. [Basic Usage](#basic-usage)
3. [API Integration](#api-integration)
4. [React Component Usage](#react-component-usage)
5. [Validation Errors](#validation-errors)
6. [Migration Examples](#migration-examples)

---

## Overview

The `errorHandling.js` utility provides standardized error handling across the application:

✅ Extracts meaningful error messages from various error formats
✅ Categorizes errors (network, server, client, timeout)
✅ Determines if errors are retriable
✅ Handles authentication errors
✅ Formats validation errors for forms
✅ Provides user-friendly error messages

---

## Basic Usage

### Import the utility

```javascript
import {
  handleApiError,
  getErrorMessage,
  formatErrorForAction
} from '../utils/errorHandling';
```

### Extract error message

```javascript
try {
  await someApiCall();
} catch (error) {
  const message = getErrorMessage(error);
  showSnackbar(message, 'error');
}
```

---

## API Integration

### Simple API call with error handling

```javascript
import { handleApiError } from '../utils/errorHandling';
import { useNotifications } from '../context/NotificationContext';

const MyComponent = () => {
  const { showSnackbar } = useNotifications();

  const handleAction = async () => {
    try {
      await apiCall();
      showSnackbar('Success!', 'success');
    } catch (error) {
      const errorInfo = handleApiError(error, {
        context: 'My Component Action',
        fallbackMessage: 'Failed to perform action',
      });
      showSnackbar(errorInfo.message, 'error');
    }
  };
};
```

### With authentication handling

```javascript
import { handleApiError } from '../utils/errorHandling';
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { logout } = useAuth();
  const { showSnackbar } = useNotifications();

  const handleAction = async () => {
    try {
      await apiCall();
    } catch (error) {
      const errorInfo = handleApiError(error, {
        context: 'Protected Action',
        onUnauthorized: () => {
          logout();
          showSnackbar('Session expired. Please log in again.', 'warning');
        },
      });

      if (errorInfo.showNotification) {
        showSnackbar(errorInfo.message, 'error');
      }
    }
  };
};
```

### User-friendly action messages

```javascript
import { formatErrorForAction } from '../utils/errorHandling';

try {
  await postsAPI.create(formData);
  showSnackbar('Post created successfully!', 'success');
} catch (error) {
  const message = formatErrorForAction('create post', error);
  // Returns: "Unable to create post. Please check your internet connection."
  // Or: "Server error while trying to create post. Please try again later."
  showSnackbar(message, 'error');
}
```

---

## React Component Usage

### Complete component example

```javascript
import { useState } from 'react';
import { Button, Alert } from '@mui/material';
import { handleApiError, isRetriableError } from '../utils/errorHandling';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSnackbar } = useNotifications();
  const { logout } = useAuth();

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(data);
      showSnackbar('Success!', 'success');
      return response;
    } catch (err) {
      const errorInfo = handleApiError(err, {
        context: 'Form Submission',
        onUnauthorized: logout,
      });

      setError(errorInfo.message);

      // Show notification for non-validation errors
      if (errorInfo.showNotification) {
        showSnackbar(errorInfo.message, 'error');
      }

      // Optionally retry for retriable errors
      if (isRetriableError(err)) {
        console.log('Error is retriable, you could implement retry logic');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Button onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </>
  );
};
```

---

## Validation Errors

### Extract field-specific errors for forms

```javascript
import { extractValidationErrors } from '../utils/errorHandling';

const MyForm = () => {
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      await apiCall(data);
    } catch (error) {
      // Extract field errors: { username: "This field is required", email: "Invalid email" }
      const errors = extractValidationErrors(error);
      setFieldErrors(errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="username"
        error={!!fieldErrors.username}
        helperText={fieldErrors.username}
      />
      <TextField
        name="email"
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
      />
    </form>
  );
};
```

---

## Migration Examples

### Before (Scattered error handling)

```javascript
// ❌ Old way - Inconsistent error handling
try {
  await apiCall();
} catch (err) {
  const msg = err.response?.data?.error || err.message || 'Failed';
  showSnackbar(msg, 'error');
}

// Different approach in another file
try {
  await apiCall();
} catch (err) {
  if (err.response?.status === 401) {
    logout();
  }
  showSnackbar(err.response?.data?.message || 'Error occurred', 'error');
}
```

### After (Standardized)

```javascript
// ✅ New way - Consistent, centralized error handling
import { handleApiError } from '../utils/errorHandling';

try {
  await apiCall();
} catch (error) {
  const errorInfo = handleApiError(error, {
    context: 'API Call',
    onUnauthorized: logout,
  });
  showSnackbar(errorInfo.message, 'error');
}
```

---

## API Response Formats Supported

The utility handles all these error response formats:

```javascript
// Format 1: { error: "message" }
{ error: "Invalid credentials" }

// Format 2: { message: "message" }
{ message: "User not found" }

// Format 3: { detail: "message" }
{ detail: "Permission denied" }

// Format 4: { errors: ["error1", "error2"] }
{ errors: ["Field is required", "Must be at least 3 characters"] }

// Format 5: { errors: { field: ["error"] } }
{
  errors: {
    username: ["This username is already taken"],
    email: ["Please enter a valid email"]
  }
}
```

---

## Error Categories

The utility categorizes errors automatically:

- **CLIENT_ERROR** (4xx): User input errors, validation issues
- **SERVER_ERROR** (5xx): Backend errors, database issues
- **NETWORK_ERROR**: No internet connection, DNS issues
- **TIMEOUT_ERROR**: Request took too long
- **UNKNOWN_ERROR**: Unexpected errors

---

## Best Practices

1. **Always use `handleApiError` for API calls**
   ```javascript
   const errorInfo = handleApiError(error, { context: 'Your Action' });
   ```

2. **Use `formatErrorForAction` for user-facing messages**
   ```javascript
   const message = formatErrorForAction('create post', error);
   ```

3. **Handle validation errors separately**
   ```javascript
   const fieldErrors = extractValidationErrors(error);
   ```

4. **Provide context for better logging**
   ```javascript
   handleApiError(error, { context: 'Profile Update - handleSubmit' });
   ```

5. **Always handle unauthorized errors**
   ```javascript
   handleApiError(error, { onUnauthorized: logout });
   ```

---

## Testing

### Test error extraction

```javascript
import { getErrorMessage, getErrorCategory } from '../utils/errorHandling';

// Test various error formats
const axiosError = { response: { data: { error: 'Test' }, status: 400 } };
const message = getErrorMessage(axiosError); // "Test"
const category = getErrorCategory(axiosError); // "CLIENT_ERROR"
```

---

## Future Enhancements

- [ ] Integrate with error monitoring service (Sentry, LogRocket)
- [ ] Add retry logic for retriable errors
- [ ] Implement exponential backoff for rate limiting
- [ ] Add error analytics tracking
- [ ] Create error boundary integration
