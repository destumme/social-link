"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";

const themeLabels: Record<Theme, string> = {
  github: "GitHub",
  tokyo: "Tokyo",
  catppuccin: "Catppuccin",
  one: "One",
};

type Theme = "github" | "tokyo" | "catppuccin" | "one";

const themePalettes: Record<
  Theme,
  { primary: string; secondary: string; tertiary: string }
> = {
  github: {
    primary: "oklch(0.205 0 0)",
    secondary: "oklch(0.967 0.003 264)",
    tertiary: "oklch(0.88 0.005 264)",
  },
  tokyo: {
    primary: "oklch(0.85 0.02 260)",
    secondary: "oklch(0.28 0.025 265)",
    tertiary: "oklch(0.40 0.03 265)",
  },
  catppuccin: {
    primary: "oklch(0.88 0.02 270)",
    secondary: "oklch(0.30 0.03 280)",
    tertiary: "oklch(0.42 0.035 280)",
  },
  one: {
    primary: "oklch(0.2 0.01 50)",
    secondary: "oklch(0.965 0.015 70)",
    tertiary: "oklch(0.88 0.01 70)",
  },
};

function ColorSwatches({ theme }: { theme: Theme }) {
  const palette = themePalettes[theme];
  return (
    <span className="flex gap-0.5">
      <span
        className="size-2 rounded-full border border-border/50"
        style={{ backgroundColor: palette.primary }}
      />
      <span
        className="size-2 rounded-full border border-border/50"
        style={{ backgroundColor: palette.secondary }}
      />
      <span
        className="size-2 rounded-full border border-border/50"
        style={{ backgroundColor: palette.tertiary }}
      />
    </span>
  );
}

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
      <SelectTrigger size="sm" className="h-8 gap-2 px-3">
        <SelectValue>
          {(value) => (
            <span className="flex items-center gap-2">
              <ColorSwatches theme={value as Theme} />
              <span>{themeLabels[value as Theme]}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="github">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="github" />
            <span>GitHub</span>
          </span>
        </SelectItem>
        <SelectItem value="tokyo">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="tokyo" />
            <span>Tokyo</span>
          </span>
        </SelectItem>
        <SelectItem value="catppuccin">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="catppuccin" />
            <span>Catppuccin</span>
          </span>
        </SelectItem>
        <SelectItem value="one">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="one" />
            <span>One</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
