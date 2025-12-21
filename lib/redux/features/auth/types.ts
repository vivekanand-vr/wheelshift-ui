import { UserRole } from "@/lib/constants/navigation";

export interface User {
  employeeId: number;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  role?: UserRole; // Mapped from roles array
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  employeeId: number;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}
