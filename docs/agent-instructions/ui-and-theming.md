# UI & Theming

- **UI stack**: Base UI (`@base-ui/react`) headless primitives + Tailwind v4 + shadcn component registry + CVA (`class-variance-authority`) for component variants.
- **Component patterns**: `cn()` utility (`src/lib/utils.ts`) combines clsx + tailwind-merge. Components use `data-slot` attributes for targeting. `render` prop enables Next.js Link composition in dropdown items.
- **UI primitives** in `src/components/ui/` — explore for current components (button, dialog, select, dropdown, input, etc.).
- **Layout components** in `src/components/layout/` — explore for header, footer, main shell, theme selector.
- **Icons**: `@hugeicons/react` with category mappings in `src/lib/icons.ts`.

## Dynamic Theming

- **Architecture**: CSS custom properties scoped to `[data-theme="..."]` on `<html>`. Each theme defines semantic tokens: `--background`, `--foreground`, `--primary`, `--card`, `--sidebar-*`, `--chart-*`, `--notebook-*`, etc.
- **Color format**: OKLCH exclusively.
- **Tailwind mapping**: `@theme inline` block in `src/app/globals.css` maps CSS vars to utility classes (`bg-background`, `text-primary`, `rounded-lg`).
- **ThemeProvider** (`src/components/theme-provider.tsx`): React context using `useSyncExternalStore`, persists theme to localStorage, sets default theme.
- **ThemeScript** (`src/components/theme-script.tsx`): inline `<script>` injected in `<body>` for FOUC prevention — runs before hydration.
- **Theme selector** (`src/components/layout/theme-selector.tsx`): dropdown UI with color swatch previews.
- **Dark mode**: `@custom-variant dark` in `globals.css` classifies which themes trigger `dark:` Tailwind variants.
- **Notebook effect**: decorative vertical/horizontal lines via `--notebook-vertical-line` / `--notebook-horizontal-line` CSS vars, colors vary per theme.
- Explore `src/app/globals.css` for all available themes and their color tokens.
