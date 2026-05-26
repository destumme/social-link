"use client";

import * as React from "react";

type Theme =
  | "github"
  | "tokyo"
  | "catppuccin"
  | "one"
  | "serika"
  | "honey"
  | "mint"
  | "lavender";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

const themeSubscribers = new Set<() => void>();

function notifySubscribers() {
  themeSubscribers.forEach((fn) => fn());
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (
    stored &&
    [
      "github",
      "tokyo",
      "catppuccin",
      "one",
      "serika",
      "honey",
      "mint",
      "lavender",
    ].includes(stored)
  ) {
    return stored;
  }
  return "tokyo";
}

function getServerSnapshot(): Theme {
  return "tokyo";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    (onStoreChange) => {
      themeSubscribers.add(onStoreChange);
      return () => {
        themeSubscribers.delete(onStoreChange);
      };
    },
    getThemeSnapshot,
    getServerSnapshot,
  );

  const setTheme = React.useCallback((newTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    notifySubscribers();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
