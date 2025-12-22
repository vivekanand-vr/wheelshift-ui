"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import CarImage from "@/assets/images/LOGIN_SCREEN.jpg";
import { LoginForm } from "./LoginForm";
import type { LoginFeatureProps } from "../types";

export function LoginFeature({ onSuccess }: LoginFeatureProps) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side - Image with Banner (70%) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden overflow-hidden lg:flex lg:w-[70%]"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={CarImage}
            alt="Login Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Banner Text */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 mt-auto mb-16 max-w-3xl self-start p-12"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 text-3xl leading-tight font-light tracking-wide text-white drop-shadow-2xl md:text-4xl lg:text-6xl"
          >
            Where luxury meets
            <br />
            performance.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg leading-relaxed font-light tracking-wide text-white/95 drop-shadow-lg md:text-xl"
          >
            Streamline your dealership operations with precision and speed.
            <br />
            <span className="mt-2 block text-base text-white/80">
              Manage inventory, sales, and service appointments effortlessly.
            </span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form (30%) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-background flex w-full items-center justify-center p-8 lg:w-[30%] lg:p-12"
      >
        <div className="w-full max-w-md">
          <LoginForm onSuccess={onSuccess} />
        </div>
      </motion.div>
    </div>
  );
}
