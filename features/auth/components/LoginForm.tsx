"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useLogin } from "../hooks";
import type { LoginFormData } from "../types";
import { Loader2, Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate: login, isPending } = useLogin(onSuccess, form.setError);

  const onSubmit = (data: LoginFormData) => {
    // Clear any previous errors
    form.clearErrors("root");
    login(data);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-3">
        <Typography variant="h1" className="text-foreground text-4xl font-bold">
          Welcome Back
        </Typography>
        <Typography variant="muted" className="text-base">
          Sign in to continue to your account
        </Typography>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={isPending}
                        className="h-12 border-2 pl-10 text-base transition-colors focus:border-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold">
                      Password
                    </FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm font-medium text-blue-600 hover:text-blue-700"
                      disabled={isPending}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isPending}
                        className="h-12 border-2 pl-10 text-base transition-colors focus:border-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Error Message */}
          {form.formState.errors.root && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30"
            >
              <Typography
                variant="small"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {form.formState.errors.root.message}
              </Typography>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="h-12 w-full bg-blue-600 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
              disabled={isPending}
            >
              {isPending ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </motion.div>
              ) : (
                "Sign In"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Sign Up Link */}
      <motion.div variants={itemVariants} className="border-t pt-4 text-center">
        <Typography variant="small" className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Button
            variant="link"
            className="h-auto p-0 font-semibold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </Button>
        </Typography>
      </motion.div>
    </motion.div>
  );
}
