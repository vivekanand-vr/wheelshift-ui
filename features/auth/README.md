# Authentication Session Management Fix

## Overview

This update fixes the session management issues where session cookies weren't being sent properly, causing 403 errors. The solution implements comprehensive session validation, automatic expiry detection, and user-friendly error handling with toast notifications.

## Changes Made

### 1. **Enhanced Type Definitions** ([types/index.ts](../types/index.ts))

Added `SessionValidationResponse` interface to handle session validation responses:

```typescript
export interface SessionValidationResponse {
  valid: boolean;
  expired: boolean;
  message: string;
  employeeId?: number;
  email?: string;
  errorCode?: string;
}
```

### 2. **Session Validation API** ([api/services.ts](../api/services.ts))

Added `validateSession` method to check session validity:

```typescript
validateSession: async (): Promise<SessionValidationResponse> => {
  const response = await api.get<SessionValidationResponse>(
    "/auth/validate-session"
  );
  return response.data;
};
```

### 3. **Enhanced Axios Interceptor** ([lib/api/axios.ts](../../lib/api/axios.ts))

**Key Improvements:**

- Properly handles session-based authentication (uses cookies, not tokens)
- Detects `SESSION_EXPIRED` error code (401) and shows toast notification
- Automatically redirects to login on session expiry
- Handles `INSUFFICIENT_PERMISSIONS` and `ACCESS_DENIED` (403) errors
- Clears persisted state on session expiry

**Session Expiry Handling:**

```typescript
if (errorCode === "SESSION_EXPIRED") {
  toast.error("Your session has expired. Please login again.");
  localStorage.removeItem("persist:root");
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
```

### 4. **Auth Store Session Validation** ([store/authSlice.ts](../store/authSlice.ts))

Added `validateSessionAsync` thunk for Redux state management:

```typescript
export const validateSessionAsync = createAsyncThunk(
  "auth/validateSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.validateSession();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.code || "SESSION_VALIDATION_FAILED"
      );
    }
  }
);
```

### 5. **Enhanced useAuth Hook** ([hooks/useAuth.ts](../hooks/useAuth.ts))

**New Features:**

- `validateSession()` function for manual session checking
- Automatic periodic session validation (every 5 minutes)
- Initial session check after 1 minute
- Proper cleanup on unmount

**Usage:**

```typescript
const { validateSession, isAuthenticated } = useAuth();

// Manual validation
const checkSession = async () => {
  const result = await validateSession();
  if (!result.valid) {
    // Session expired, user will be logged out automatically
  }
};
```

**Automatic Validation:**

```typescript
useEffect(() => {
  if (isAuthenticated) {
    // Check every 5 minutes
    const interval = setInterval(
      () => {
        validateSession();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }
}, [isAuthenticated, validateSession]);
```

### 6. **Session Guard Component** ([components/SessionGuard.tsx](../components/SessionGuard.tsx))

New component that automatically validates session on mount:

```typescript
export const SessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, validateSession } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      validateSession();
    }
  }, [isAuthenticated, validateSession]);

  return <>{children}</>;
};
```

### 7. **Updated Authenticated Layout** ([app/(authenticated)/layout.tsx](<../../app/(authenticated)/layout.tsx>))

Wrapped layout with `SessionGuard` to enable automatic session validation for all authenticated routes:

```typescript
return (
  <SessionGuard>
    <div className="flex h-screen overflow-hidden">
      {/* Layout content */}
    </div>
  </SessionGuard>
);
```

### 8. **React Query Mutation** ([api/mutations.ts](../api/mutations.ts))

Added `useValidateSessionMutation` for components that need to check session manually:

```typescript
export const useValidateSessionMutation = (
  options?: UseMutationOptions<SessionValidationResponse, Error, void>
) => {
  return useMutation({
    mutationFn: () => authApi.validateSession(),
    ...options,
  });
};
```

## How It Works

### Session Flow

1. **Login**: User logs in → Session cookie (`WHEELSHIFT_SESSIONID`) is set by backend
2. **Requests**: All API requests automatically include session cookie (`withCredentials: true`)
3. **Validation**:
   - Initial check 1 minute after authentication
   - Periodic checks every 5 minutes
   - Automatic check on critical operations
4. **Expiry Detection**: Backend returns 401 with `SESSION_EXPIRED` error code
5. **User Notification**: Toast message: "Your session has expired. Please login again."
6. **Cleanup**: Clear persisted state and redirect to login
7. **Re-authentication**: User logs in again to create new session

### Error Code Handling

| Error Code                 | Status | Action            | Toast Message                                        |
| -------------------------- | ------ | ----------------- | ---------------------------------------------------- |
| `SESSION_EXPIRED`          | 401    | Logout + Redirect | "Your session has expired. Please login again."      |
| `INSUFFICIENT_PERMISSIONS` | 403    | Show Error        | "You do not have permission to perform this action." |
| `ACCESS_DENIED`            | 403    | Show Error        | "Access denied. Please check your permissions."      |
| Other 401                  | 401    | Redirect          | "Authentication failed. Please login again."         |

## Usage Examples

### In Components

```typescript
import { useAuth } from "@/features/auth";

const MyComponent = () => {
  const { validateSession, isAuthenticated } = useAuth();

  const handleCriticalAction = async () => {
    // Validate session before critical operation
    const { valid } = await validateSession();

    if (!valid) {
      // Session expired, user already logged out
      return;
    }

    // Proceed with critical action
    await performCriticalOperation();
  };

  return <button onClick={handleCriticalAction}>Do Action</button>;
};
```

### Manual Session Check

```typescript
import { useValidateSessionMutation } from "@/features/auth/api/mutations";

const MyComponent = () => {
  const validateSessionMutation = useValidateSessionMutation({
    onSuccess: (result) => {
      if (result.expired) {
        console.log("Session expired");
      }
    },
  });

  const checkSession = () => {
    validateSessionMutation.mutate();
  };

  return <button onClick={checkSession}>Check Session</button>;
};
```

## Testing

### Manual Testing Steps

1. **Login**: Log in with valid credentials
2. **Wait**: Wait for session to expire (30 minutes) or manually invalidate on backend
3. **Navigate**: Navigate to access control or any protected page
4. **Verify**:
   - Toast message appears: "Your session has expired. Please login again."
   - User is redirected to login page
   - No 403 errors in console

### Backend Session Timeout

According to the backend README, sessions expire after:

- **30 minutes** of inactivity
- Or when manually invalidated

### Testing Session Expiry

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' \
  -c cookies.txt

# Wait for session expiry or manually invalidate

# Try protected endpoint
curl -X GET http://localhost:8080/api/v1/rbac/permissions \
  -b cookies.txt

# Should return:
# {
#   "code": "SESSION_EXPIRED",
#   "status": 401,
#   "message": "Your session has expired. Please login again."
# }
```

## Configuration

### Session Check Interval

To change the session validation interval, modify the interval in [hooks/useAuth.ts](../hooks/useAuth.ts):

```typescript
// Current: Check every 5 minutes
sessionCheckInterval.current = setInterval(
  () => {
    validateSession();
  },
  5 * 60 * 1000
); // Change this value

// Examples:
// 1 minute: 1 * 60 * 1000
// 10 minutes: 10 * 60 * 1000
// 15 minutes: 15 * 60 * 1000
```

### Initial Check Delay

To change the initial session check delay:

```typescript
// Current: Check after 1 minute
const initialCheck = setTimeout(() => {
  validateSession();
}, 60 * 1000); // Change this value
```

## Benefits

1. **Automatic Session Management**: No manual session checking needed
2. **User-Friendly**: Clear toast notifications on session expiry
3. **Secure**: Automatically logs out on session expiry
4. **Reliable**: Periodic validation catches expired sessions early
5. **Prevents Errors**: Catches 403 errors before they reach components
6. **Clean State**: Clears persisted state on logout
7. **Proper Cookie Handling**: Uses `withCredentials: true` for session cookies

## Troubleshooting

### Issue: Session still expiring without notification

**Solution**: Check that:

1. Backend is returning proper error codes (`SESSION_EXPIRED`)
2. `withCredentials: true` is set in axios config
3. CORS is configured to allow credentials on backend
4. Session cookie name matches backend (`WHEELSHIFT_SESSIONID`)

### Issue: Toast not showing

**Solution**: Ensure:

1. `sonner` is properly installed and configured
2. `<Toaster />` component is in the root layout
3. Browser allows JavaScript popups/notifications

### Issue: Redirecting to login but session is valid

**Solution**: Check:

1. Session timeout configuration on backend (should be 30 minutes)
2. Backend session validation endpoint is working
3. Network tab shows session cookie in requests

## Related Files

- [types/index.ts](../types/index.ts) - Type definitions
- [api/services.ts](../api/services.ts) - API service methods
- [api/mutations.ts](../api/mutations.ts) - React Query mutations
- [store/authSlice.ts](../store/authSlice.ts) - Redux state management
- [hooks/useAuth.ts](../hooks/useAuth.ts) - Auth hook with session validation
- [components/SessionGuard.tsx](../components/SessionGuard.tsx) - Session guard component
- [lib/api/axios.ts](../../lib/api/axios.ts) - Axios interceptor with session handling
- [app/(authenticated)/layout.tsx](<../../app/(authenticated)/layout.tsx>) - Authenticated layout

## Backend Integration

This implementation follows the authentication flow documented in the backend README:

- Session-based authentication with cookies
- 30-minute session timeout
- Error codes: `SESSION_EXPIRED`, `INSUFFICIENT_PERMISSIONS`, `ACCESS_DENIED`
- Endpoints: `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/validate-session`

---

_Last updated: January 17, 2026_
