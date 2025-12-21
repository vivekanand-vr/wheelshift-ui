/**
 * Application Color Palette
 * Designed for both light and dark themes
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },

  // Secondary Colors
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // Success Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  // Warning Colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  // Error Colors
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // Neutral Colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
} as const;

/**
 * Semantic colors for light theme
 */
export const lightTheme = {
  background: {
    primary: "#ffffff",
    secondary: colors.neutral[50],
    tertiary: colors.neutral[100],
    hover: colors.neutral[100],
  },
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    inverse: "#ffffff",
  },
  border: {
    primary: colors.neutral[200],
    secondary: colors.neutral[300],
    focus: colors.primary[500],
  },
  sidebar: {
    background: "#ffffff",
    hover: colors.neutral[100],
    active: colors.primary[50],
    text: colors.neutral[700],
    textActive: colors.primary[600],
  },
  header: {
    background: "#ffffff",
    border: colors.neutral[200],
  },
} as const;

/**
 * Semantic colors for dark theme
 */
export const darkTheme = {
  background: {
    primary: "#0a0a0a",
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
    hover: colors.neutral[800],
  },
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    inverse: colors.neutral[900],
  },
  border: {
    primary: colors.neutral[800],
    secondary: colors.neutral[700],
    focus: colors.primary[500],
  },
  sidebar: {
    background: colors.neutral[950],
    hover: colors.neutral[800],
    active: colors.neutral[800],
    text: colors.neutral[300],
    textActive: colors.primary[400],
  },
  header: {
    background: colors.neutral[950],
    border: colors.neutral[800],
  },
} as const;

export type ThemeMode = "light" | "dark";
