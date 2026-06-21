# FEAT-001: Wider Modals

---
page: app-wide
area: UI / UX
priority: medium
status: proposed
created: 2026-06-21
---

## Summary

Increase the default maximum width of `DialogContent` from `sm:max-w-md` (448px) to a wider size, and ensure the Edit Trait dialog (which currently inherits the default) has adequate width.

## Motivation

The default modal width of 448px (`max-w-md`) feels cramped, especially on desktop. The Edit Group dialog already overrides this with `max-w-6xl` (1152px), but the Edit Trait dialog and any future dialogs that don't override the default are stuck at 448px.

## Scope

**In scope:**
- Increase the default `DialogContent` max-width on `sm` breakpoint
- Verify the Edit Trait dialog (`<DialogContent>` with no override) gets the wider default

**Out of scope:**
- The Edit Group dialog — already has its own `max-w-6xl` override
- The login/account cards — not dialogs
- Changing the mobile/`<sm` behavior

## Design

- Change `sm:max-w-md` in `src/components/ui/dialog.tsx:57` to `sm:max-w-lg`
- The `max-w-[calc(100%-2rem)]` guard on smaller screens stays unchanged to preserve mobile edge safety
- All existing dialogs (both with and without overrides) remain visually consistent

## Notes

- Current default: `sm:max-w-md` = 448px
- New default: `sm:max-w-lg` = 512px
- EditTraitDialog at `src/app/traits/_components/edit-trait-dialog.tsx:93` uses `<DialogContent>` with no width override — will inherit the new default

## Agent Instructions

**What to look for:**
The single CSS class change on the `DialogContent` component in the dialog primitive.

**Files to check:**
- `src/components/ui/dialog.tsx` — change `sm:max-w-md` to a wider Tailwind class

**What not to change:**
- Mobile responsive behavior (`max-w-[calc(100%-2rem)]`)
- The Edit Group dialog's explicit `max-w-6xl` override
- Any other file

**Verification:**
1. Open the app and trigger a modal (e.g., edit a trait from `/traits`)
2. Confirm the modal is wider than before on `>= 640px` viewports
3. Confirm the modal still has proper margin on narrow/mobile viewports
4. Run `yarn lint` to verify no regressions

## Tasks

- [ ] Change `sm:max-w-md` to `sm:max-w-lg` in `src/components/ui/dialog.tsx`
- [ ] Visual verification on desktop and mobile viewports
- [ ] Run `yarn lint`
