# Auth Feature Structure

## 📁 Current Structure

```
features/auth/
├── api/
│   └── index.ts                 # authApi.login(), logout(), getCurrentUser()
│
├── components/
│   ├── LoginFeature.tsx         # Main login feature component
│   ├── LoginForm.tsx            # Login form UI
│   └── index.ts                 # Component exports
│
├── hooks/
│   ├── useAuth.ts              # Main auth hook (Redux integration)
│   ├── useLogin.ts             # Login form hook (React Query)
│   └── index.ts                # Hook exports
│
├── queries/
│   └── index.ts                # authQueries (React Query configs)
│
├── store/
│   ├── authSlice.ts            # Redux slice for auth state
│   └── index.ts                # Store exports
│
├── types/
│   └── index.ts                # All TypeScript types
│
└── index.ts                    # Main feature exports
```

## 🔄 Data Flow

### Login Flow

```
1. LoginForm (Component)
   ↓ user submits form

2. useLogin (Hook)
   ↓ calls login function

3. useAuth (Hook)
   ↓ dispatches Redux action

4. authSlice.loginAsync (Redux Thunk)
   ↓ calls API

5. authApi.login (API Layer)
   ↓ makes HTTP request

6. Backend API
```

### Component Usage Example

```typescript
// ✓ Simple import from feature root
import { useAuth, useLogin } from "@/features/auth";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { mutate: login } = useLogin();

  // Use in component
}
```

## 📦 What Each Layer Does

### API Layer (`api/index.ts`)

- Pure HTTP requests
- No state management
- No data transformation (basic only)
- Returns raw API responses

```typescript
export const authApi = {
  login: async (credentials) => {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  },
};
```

### Queries Layer (`queries/index.ts`)

- React Query configurations
- Data transformations
- Caching strategies
- Error handling patterns

```typescript
export const authQueries = {
  login: {
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);
      return transformUser(response); // Transform here
    },
  },
};
```

### Hooks Layer (`hooks/`)

- Business logic
- State management integration
- User interaction handlers
- Side effects (toasts, navigation)

```typescript
// useAuth.ts - Redux integration
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginAsync(credentials));

  return { ...auth, login };
};

// useLogin.ts - Form-specific logic
export const useLogin = (onSuccess) => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Logged in!");
      router.push("/dashboard");
    },
  });
};
```

### Store Layer (`store/`)

- Redux slice (if needed)
- Global state management
- Persistence configuration
- Async thunks

```typescript
export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    /* ... */
  },
  extraReducers: {
    /* loginAsync, etc. */
  },
});
```

### Components Layer (`components/`)

- UI rendering
- User interactions
- Uses hooks (no direct API calls)
- Presentational logic only

```typescript
export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  return (
    <form onSubmit={(data) => login(data)}>
      {/* UI only */}
    </form>
  );
};
```

## 🎯 Key Benefits

### 1. **Feature Cohesion**

All auth-related code is in one place:

- ✅ Easy to find
- ✅ Easy to test
- ✅ Easy to refactor

### 2. **Clear Separation**

Each layer has one job:

- API = HTTP requests
- Queries = Data handling
- Hooks = Business logic
- Store = Global state
- Components = UI

### 3. **Testability**

Each layer can be tested independently:

```typescript
// Test API
expect(authApi.login(credentials)).resolves.toBe(mockResponse);

// Test Hook
const { result } = renderHook(() => useLogin());
act(() => result.current.mutate(data));

// Test Component
render(<LoginForm />);
fireEvent.submit(form);
```

### 4. **Reusability**

Hooks and APIs can be reused:

```typescript
// Different components, same hooks
function LoginPage() {
  const { mutate: login } = useLogin(() => router.push("/dashboard"));
}

function QuickLogin() {
  const { mutate: login } = useLogin(() => closeModal());
}
```

## 🔧 How Redux Fits In

Redux is used ONLY for:

- ✅ Global state (user, isAuthenticated)
- ✅ Persistence (localStorage)
- ✅ Cross-feature state sharing

Redux is NOT used for:

- ❌ API calls (use API layer)
- ❌ Form state (use React Hook Form)
- ❌ Server state (use React Query)

## 📚 Import Patterns

### ✓ Correct Imports

```typescript
// Import from feature root
import { useAuth, authApi, User } from "@/features/auth";

// Import Redux slice in store configuration
import authReducer from "@/features/auth/store/authSlice";
```

### ✗ Incorrect Imports

```typescript
// Don't import from internal folders
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/index";

// Don't keep feature slices in lib/redux
import authReducer from "@/lib/redux/features/auth/authSlice";
```

## 🚀 Adding New Auth Features

To add a new auth-related feature:

1. **Add API function** in `api/index.ts`

```typescript
export const authApi = {
  // ... existing
  resetPassword: async (email: string) => {
    return await axios.post("/auth/reset-password", { email });
  },
};
```

2. **Add query config** in `queries/index.ts`

```typescript
export const authQueries = {
  // ... existing
  resetPassword: {
    mutationFn: (email: string) => authApi.resetPassword(email),
  },
};
```

3. **Create hook** in `hooks/useResetPassword.ts`

```typescript
export const useResetPassword = () => {
  return useMutation({
    ...authQueries.resetPassword,
    onSuccess: () => toast.success("Check your email!"),
  });
};
```

4. **Create component** in `components/ResetPasswordForm.tsx`

```typescript
export const ResetPasswordForm = () => {
  const { mutate, isPending } = useResetPassword();
  // ... UI
};
```

5. **Export** in respective `index.ts` files

Done! ✅
