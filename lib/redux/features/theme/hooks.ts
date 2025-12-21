import { useAppDispatch, useAppSelector } from "../../store";
import { setTheme, toggleTheme, initTheme } from "./themeSlice";
import type { ThemeMode } from "@/lib/constants/colors";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const setThemeMode = (theme: ThemeMode) => {
    dispatch(setTheme(theme));
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const initialize = () => {
    dispatch(initTheme());
  };

  return {
    mode,
    setTheme: setThemeMode,
    toggleTheme: toggle,
    initTheme: initialize,
  };
};
