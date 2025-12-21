export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginFeatureProps {
  onSuccess?: () => void;
}
