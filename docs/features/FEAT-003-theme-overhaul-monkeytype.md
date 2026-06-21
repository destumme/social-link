# FEAT-003: Theme Overhaul — MonkeyType-Inspired Color Schemes

---
page: app-wide
area: theming
priority: medium
status: proposed
created: 2026-06-21
---

## Summary

Update existing themes to better match their MonkeyType inspirations, add theme-specific chart color palettes to all themes, and add 8 new MonkeyType-inspired themes. Covers `globals.css` theme definitions, `@custom-variant dark` updates, and chart color derivation.

## Motivation

All 8 existing themes share identical grayscale chart colors. The `serika` theme colors don't precisely match MonkeyType's. Adding 8 popular dark themes (dracula, nord, gruvbox, etc.) significantly expands customization options.

## Scope

**In scope:**
- Update `serika` theme to match exact MonkeyType colors
- Replace shared grayscale chart colors with per-theme 5-color palettes
- Add 8 new themes: dracula, nord, horizon, gruvbox, rose_pine, vscode, monokai, phantom
- Update `@custom-variant dark` selector

**Out of scope:**
- Theme provider or selector UI changes
- Light mode variants for dark-only themes

## Design

Each new theme follows the existing CSS custom property structure:
- bg, main, sub, subAlt, text, error, errorExtra
- `--chart-1` through `--chart-5` derived from theme palette
- `--notebook-vertical-line` and `--notebook-horizontal-line`

Chart palette derivation:
- chart-1: primary color
- chart-2: secondary accent
- chart-3: tertiary/warm
- chart-4: cool accent
- chart-5: muted/neutral

## Notes

- Only file to change: `src/app/globals.css`
- New dark themes must be added to `@custom-variant dark`
- Theme selector auto-picks up new themes via `data-theme` attribute
- Full reference colors and chart palettes in original plan

## Agent Instructions

**What to look for:**
CSS custom properties in `globals.css` grouped by `[data-theme="..."]` blocks.

**Files to check:**
- `src/app/globals.css` — existing 8 themes and chart colors near the theme blocks

**What not to change:**
- `src/components/theme-provider.tsx`
- `src/components/layout/theme-selector.tsx`

**Verification:**
1. Run `yarn lint` and `yarn build` — no CSS errors
2. `yarn dev` — cycle through all themes in selector, confirm new themes appear
3. Check chart colors are distinct per theme (not all grayscale)

## Tasks

- [ ] Update `serika` theme values to match MonkeyType
- [ ] Replace chart color palettes on 8 existing themes
- [ ] Add 8 new theme blocks (dracula, nord, horizon, gruvbox, rose_pine, vscode, monokai, phantom)
- [ ] Update `@custom-variant dark` selector with new dark themes
- [ ] Run `yarn lint` and `yarn build`

---

*Migrated from plan [01e-theme-overhaul-monkeytype](../plans/01e-theme-overhaul-monkeytype.md).*
