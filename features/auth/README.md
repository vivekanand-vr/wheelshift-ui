# Authentication JWT Token Management

## Overview

This implementation uses JWT (JSON Web Token) based authentication where the backend returns an `accessToken` upon successful login. This token is stored in localStorage and included in the Authorization header for all subsequent API requests.

## Changes Made

### 1. **Enhanced Type Definitions** ([types/index.ts](../types/index.ts))

Updated `LoginResponse` interface to include `accessToken`:

```typescript
export interface LoginResponse {
  employeeId: number;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
}
```

### 2. **JWT Token Management** ([lib/api/axios.ts](../../lib/api/axios.ts))

**Key Features:**

- Stores JWT token in localStorage upon successful login
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Handles token expiration (401 errors with TOKEN_EXPIRED code)
- Clears token and redirects to login on expiration
- Handles permission errors (403) with appropriate messages

**Token Storage Functions:**

```typescript
// Get token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Store token in localStorage
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

// Remove token from localStorage
export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};
```

**Request Interceptor:**

```typescript
api.interceptors.request.use((config) => {
  // Add JWT token to Authorization header
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Token Expiry Handling:**

```typescript
if (errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN") {
  toast.error("Your session has expired. Please login again.");
  removeAccessToken();
  localStorage.removeItem("persist:root");
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
```

### 3. **Auth Services with Token Storage** ([api/services.ts](../api/services.ts))

**Login Service:**

```typescript
login: async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  // Store JWT access token
  const { setAccessToken } = await import("@/lib/api/axios");
  setAccessToken(response.data.accessToken);

  return transformUser(response.data);
};
```

**Logout Service:**

```typescript
logout: async (): Promise<void> => {
  await api.post("/auth/logout");

  // Remove JWT access token
  const { removeAccessToken } = await import("@/lib/api/axios");
  removeAccessToken();
};
```

### 4. **Enhanced useAuth Hook** ([hooks/useAuth.ts](../hooks/useAuth.ts))

**Updated Logout Function:**

```typescript
const logoutMutation = useLogoutMutation({
  onSuccess: async () => {
    dispatch(logoutAsync());

    // Clear access token and local storage
    if (typeof window !== "undefined") {
      const { removeAccessToken } = await import("@/lib/api/axios");
      removeAccessToken();
      localStorage.removeItem("persist:root");
    }

    toast.success("Logged out successfully");
    router.push("/login");
  },
});
```

**Usage:**

```typescript
const { login, logout, isAuthenticated, user } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });

// Logout
await logout();
```

## How It Works

### JWT Authentication Flow

1. **Login**: User logs in → Backend returns `accessToken` in response
2. **Storage**: Token is stored in localStorage
3. **Requests**: All API requests automatically include `Authorization: Bearer <token>` header
4. **Token Validation**: Backend validates token on each request
5. **Expiry Detection**: Backend returns 401 with `TOKEN_EXPIRED` or `INVALID_TOKEN` error code
6. **User Notification**: Toast message: "Your session has expired. Please login again."
7. **Cleanup**: Clear token, persisted state, and redirect to login
8. **Re-authentication**: User logs in again to receive new token

### Error Code Handling

| Error Code                 | Status | Action            | Toast Message                                        |
| -------------------------- | ------ | ----------------- | ---------------------------------------------------- |
| `TOKEN_EXPIRED`            | 401    | Logout + Redirect | "Your session has expired. Please login again."      |
| `INVALID_TOKEN`            | 401    | Logout + Redirect | "Your session has expired. Please login again."      |
| `INSUFFICIENT_PERMISSIONS` | 403    | Show Error        | "You do not have permission to perform this action." |
| `ACCESS_DENIED`            | 403    | Show Error        | "Access denied. Please check your permissions."      |
| Other 401                  | 401    | Redirect          | "Authentication failed. Please login again."         |

## Usage Examples

### In Components

```typescript
import { useAuth } from "@/features/auth";

const MyComponent = () => {
  const { login, logout, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "user@example.com",
      password: "password"
    });

    if (result.success) {
      console.log("Logged in successfully");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Protected API Calls

All API calls automatically include the JWT token:

```typescript
import { api } from "@/lib/api/axios";

// Token is automatically added to Authorization header
const fetchData = async () => {
  const response = await api.get("/some-protected-endpoint");
  return response.data;
};
```

## Testing

### Manual Testing Steps

1. **Login**: Log in with valid credentials
2. **Verify Token**: Check localStorage for `accessToken`
3. **API Call**: Make an API call and verify Authorization header includes token
4. **Token Expiry**: Wait for token to expire or manually invalidate on backend
5. **Verify**:
   - Toast message appears: "Your session has expired. Please login again."
   - User is redirected to login page
   - Token is cleared from localStorage

### Testing with DevTools

```javascript
// Check if token exists
localStorage.getItem("accessToken");

// Manually remove token to test expiry
localStorage.removeItem("accessToken");

// Try making an API request - should fail with 401
```

## Benefits

1. **Stateless Authentication**: No server-side session storage needed
2. **Scalable**: Easy to scale across multiple servers
3. **User-Friendly**: Clear toast notifications on token expiry
4. **Secure**: Token-based authentication with automatic expiry handling
5. **Clean State**: Clears token and persisted state on logout
6. **Standard Approach**: Uses industry-standard JWT authentication

## Troubleshooting

### Issue: Token not being sent with requests

**Solution**: Check that:

- Token is stored in localStorage: `localStorage.getItem("accessToken")`
- Axios interceptor is properly configured
- Request is using the configured `api` instance

### Issue: Token expired but no logout

**Solution**: Check that:

- Backend returns correct error code (`TOKEN_EXPIRED` or `INVALID_TOKEN`)
- Response status is 401
- Response interceptor is handling the error

### Issue: User logged out unexpectedly

**Solution**: Check that:

- Token hasn't expired (check backend token expiration time)
- Backend is returning valid JWT tokens
- Token is not being cleared prematurely

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
2. **Token Expiration**: Backend should set appropriate token expiration times
3. **HTTPS**: Always use HTTPS in production to prevent token interception
4. **Token Refresh**: Consider implementing refresh token mechanism for long-lived sessions
5. **XSS Protection**: Sanitize all user inputs to prevent XSS attacks that could steal tokens

## API Endpoints

All endpoints remain the same, only the authentication mechanism changed:

- `POST /auth/login` - Login (returns accessToken)
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- All protected endpoints require `Authorization: Bearer <token>` header

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
