"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/redux/features/auth/hooks";
import type { LoginFormData } from "../types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
