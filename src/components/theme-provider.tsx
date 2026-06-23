"use client";

import * as React from "react";

const VALID_THEMES = [
  "github",
  "tokyo",
  "catppuccin",
  "one",
  "serika",
  "honey",
  "mint",
  "lavender",
  "copper",
  "coral",
  "dracula",
  "gruvbox",
  "horizon",
  "monokai",
  "nord",
  "ocean",
  "phantom",
  "rose_pine",
  "sage",
  "vscode",
] as const;

type Theme = (typeof VALID_THEMES)[number];

const COOKIE_OPTIONS = "path=/;max-age=31536000;SameSite=Lax";

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

function setThemeCookie(theme: Theme) {
  document.cookie = `theme=${theme};${COOKIE_OPTIONS}`;
}

function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored && VALID_THEMES.includes(stored as Theme)) {
    return stored as Theme;
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
    setThemeCookie(newTheme);
    notifySubscribers();
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored && VALID_THEMES.includes(stored as Theme)) {
      setThemeCookie(stored as Theme);
    }
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
