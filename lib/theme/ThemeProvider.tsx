"use client";

import { useEffect } from "react";
import { useTheme } from "./hooks";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { initTheme } = useTheme();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
}
