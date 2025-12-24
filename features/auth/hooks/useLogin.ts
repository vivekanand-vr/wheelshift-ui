"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { LoginFormData } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Login hook - handles login form submission
 * Pattern: Component → useLogin hook → useAuth hook → Redux store → authApi
 */
export const useLogin = (onSuccess?: () => void) => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result.type.includes("rejected")) {
        throw new Error(result.payload as string);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
};
