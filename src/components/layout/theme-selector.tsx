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
  copper: "Copper",
  coral: "Coral",
  dracula: "Dracula",
  gruvbox: "Gruvbox",
  horizon: "Horizon",
  monokai: "Monokai",
  nord: "Nord",
  ocean: "Ocean",
  phantom: "Phantom",
  rose_pine: "Rosé Pine",
  sage: "Sage",
  vscode: "VS Code",
};

type Theme =
  | "github"
  | "tokyo"
  | "catppuccin"
  | "one"
  | "serika"
  | "honey"
  | "mint"
  | "lavender"
  | "copper"
  | "coral"
  | "dracula"
  | "gruvbox"
  | "horizon"
  | "monokai"
  | "nord"
  | "ocean"
  | "phantom"
  | "rose_pine"
  | "sage"
  | "vscode";

const themePalettes: Record<
  Theme,
  { primary: string; secondary: string; tertiary: string }
> = {
  github: {
    primary: "oklch(0.654 0.162 249.6)",
    secondary: "oklch(0.178 0.010 247.8)",
    tertiary: "oklch(0.320 0.040 220)",
  },
  tokyo: {
    primary: "oklch(0.719 0.1322 264.2)",
    secondary: "oklch(0.2819 0.0355 274.75)",
    tertiary: "oklch(0.380 0.060 230)",
  },
  catppuccin: {
    primary: "oklch(0.7871 0.1187 304.77)",
    secondary: "oklch(0.324 0.0319 281.98)",
    tertiary: "oklch(0.380 0.045 270)",
  },
  one: {
    primary: "oklch(0.6017 0.193 263.25)",
    secondary: "oklch(0.9551 0 0)",
    tertiary: "oklch(0.910 0.030 230)",
  },
  serika: {
    primary: "oklch(0.710 0.180 25)",
    secondary: "oklch(0.260 0.010 250)",
    tertiary: "oklch(0.310 0.030 50)",
  },
  honey: {
    primary: "oklch(0.720 0.170 75)",
    secondary: "oklch(0.930 0.025 85)",
    tertiary: "oklch(0.900 0.020 50)",
  },
  mint: {
    primary: "oklch(0.780 0.180 170)",
    secondary: "oklch(0.275 0.015 175)",
    tertiary: "oklch(0.310 0.080 185)",
  },
  lavender: {
    primary: "oklch(0.620 0.200 295)",
    secondary: "oklch(0.940 0.015 300)",
    tertiary: "oklch(0.900 0.025 280)",
  },
  copper: {
    primary: "oklch(0.700 0.150 45)",
    secondary: "oklch(0.260 0.012 45)",
    tertiary: "oklch(0.300 0.050 35)",
  },
  coral: {
    primary: "oklch(0.580 0.150 15)",
    secondary: "oklch(0.920 0.020 20)",
    tertiary: "oklch(0.880 0.045 10)",
  },
  dracula: {
    primary: "oklch(0.700 0.200 310)",
    secondary: "oklch(0.290 0.020 280)",
    tertiary: "oklch(0.380 0.060 260)",
  },
  gruvbox: {
    primary: "oklch(0.800 0.180 90)",
    secondary: "oklch(0.280 0.010 80)",
    tertiary: "oklch(0.380 0.030 70)",
  },
  horizon: {
    primary: "oklch(0.620 0.220 20)",
    secondary: "oklch(0.240 0.015 280)",
    tertiary: "oklch(0.350 0.050 270)",
  },
  monokai: {
    primary: "oklch(0.820 0.200 120)",
    secondary: "oklch(0.275 0.010 80)",
    tertiary: "oklch(0.380 0.030 80)",
  },
  nord: {
    primary: "oklch(0.750 0.100 200)",
    secondary: "oklch(0.310 0.020 240)",
    tertiary: "oklch(0.380 0.040 230)",
  },
  ocean: {
    primary: "oklch(0.720 0.170 220)",
    secondary: "oklch(0.250 0.020 235)",
    tertiary: "oklch(0.290 0.060 215)",
  },
  phantom: {
    primary: "oklch(0.700 0.160 220)",
    secondary: "oklch(0.250 0.005 80)",
    tertiary: "oklch(0.320 0.010 80)",
  },
  rose_pine: {
    primary: "oklch(0.740 0.140 310)",
    secondary: "oklch(0.220 0.025 300)",
    tertiary: "oklch(0.350 0.060 290)",
  },
  sage: {
    primary: "oklch(0.550 0.090 155)",
    secondary: "oklch(0.920 0.020 140)",
    tertiary: "oklch(0.890 0.040 130)",
  },
  vscode: {
    primary: "oklch(0.550 0.180 240)",
    secondary: "oklch(0.240 0.005 80)",
    tertiary: "oklch(0.320 0.010 80)",
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
        <SelectItem value="copper">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="copper" />
            <span>Copper</span>
          </span>
        </SelectItem>
        <SelectItem value="coral">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="coral" />
            <span>Coral</span>
          </span>
        </SelectItem>
        <SelectItem value="dracula">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="dracula" />
            <span>Dracula</span>
          </span>
        </SelectItem>
        <SelectItem value="gruvbox">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="gruvbox" />
            <span>Gruvbox</span>
          </span>
        </SelectItem>
        <SelectItem value="horizon">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="horizon" />
            <span>Horizon</span>
          </span>
        </SelectItem>
        <SelectItem value="monokai">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="monokai" />
            <span>Monokai</span>
          </span>
        </SelectItem>
        <SelectItem value="nord">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="nord" />
            <span>Nord</span>
          </span>
        </SelectItem>
        <SelectItem value="ocean">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="ocean" />
            <span>Ocean</span>
          </span>
        </SelectItem>
        <SelectItem value="phantom">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="phantom" />
            <span>Phantom</span>
          </span>
        </SelectItem>
        <SelectItem value="rose_pine">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="rose_pine" />
            <span>Rosé Pine</span>
          </span>
        </SelectItem>
        <SelectItem value="sage">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="sage" />
            <span>Sage</span>
          </span>
        </SelectItem>
        <SelectItem value="vscode">
          <span className="flex items-center gap-2">
            <ColorSwatches theme="vscode" />
            <span>VS Code</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
