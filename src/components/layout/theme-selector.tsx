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
  serika: "Serika",
  honey: "Honey",
  mint: "Mint",
  lavender: "Lavender",
};

type Theme =
  | "github"
  | "tokyo"
  | "catppuccin"
  | "one"
  | "serika"
  | "honey"
  | "mint"
  | "lavender";

const themePalettes: Record<
  Theme,
  { primary: string; secondary: string; tertiary: string }
> = {
  github: {
    primary: "oklch(0.654 0.162 249.6)",
    secondary: "oklch(0.178 0.010 247.8)",
    tertiary: "oklch(0.220 0.012 245.4)",
  },
  tokyo: {
    primary: "oklch(0.719 0.1322 264.2)",
    secondary: "oklch(0.2819 0.0355 274.75)",
    tertiary: "oklch(0.4094 0.0546 274.27)",
  },
  catppuccin: {
    primary: "oklch(0.7871 0.1187 304.77)",
    secondary: "oklch(0.324 0.0319 281.98)",
    tertiary: "oklch(0.4037 0.032 280.15)",
  },
  one: {
    primary: "oklch(0.6017 0.193 263.25)",
    secondary: "oklch(0.9551 0 0)",
    tertiary: "oklch(0.9219 0 0)",
  },
  serika: {
    primary: "oklch(0.710 0.180 25)",
    secondary: "oklch(0.260 0.010 250)",
    tertiary: "oklch(0.310 0.012 250)",
  },
  honey: {
    primary: "oklch(0.720 0.170 75)",
    secondary: "oklch(0.930 0.025 85)",
    tertiary: "oklch(0.900 0.030 80)",
  },
  mint: {
    primary: "oklch(0.780 0.180 170)",
    secondary: "oklch(0.275 0.015 175)",
    tertiary: "oklch(0.325 0.018 175)",
  },
  lavender: {
    primary: "oklch(0.620 0.200 295)",
    secondary: "oklch(0.940 0.015 300)",
    tertiary: "oklch(0.910 0.020 300)",
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
      <SelectTrigger size="sm" className="h-8 w-[165px] gap-2 px-3">
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
        <SelectItem value="serika">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="serika" />
            <span>Serika</span>
          </span>
        </SelectItem>
        <SelectItem value="honey">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="honey" />
            <span>Honey</span>
          </span>
        </SelectItem>
        <SelectItem value="mint">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="mint" />
            <span>Mint</span>
          </span>
        </SelectItem>
        <SelectItem value="lavender">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="lavender" />
            <span>Lavender</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
