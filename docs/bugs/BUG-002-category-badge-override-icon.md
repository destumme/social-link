# BUG-002: Category badge doesn't show override icon

---
page: /traits
area: traits
severity: low
status: open
created: 2026-06-21
---

## Observed Behavior

The category badge in the traits table row always displays the default icon for the trait's category, even when the trait has an override icon set.

Example: a trait with `category: "social"` and `icon: "globe"` shows the default "social" category icon instead of the globe override icon.

## Expected Behavior

When a trait has an override icon (`trait.icon`), the category badge should display the override icon instead of the default category icon. If no override icon is set, it should fall back to the default category icon.

## Notes

In `src/app/traits/_components/trait-row.tsx:40-43`, the badge renders:

```tsx
<Badge variant="secondary" className="gap-1.5">
  {getCategoryIcon(trait.category ?? "")}
  {trait.category}
</Badge>
```

`getCategoryIcon()` (from `src/components/icons.tsx`) only looks up the default icon for the category via `iconMap`. It never considers `trait.icon` (the override).

The `getOverrideIconElement()` function exists in `src/lib/icons.ts:321` but is only used in the edit/create trait dialogs, not in the trait row display.

The trait row already receives `trait.icon` on line 28.

## Agent Instructions

**What to look for:**

- Use `getOverrideIconElement(trait.icon)` to get the override icon; fall back to `getCategoryIcon()` if no override.
- Ensure only the icon shown changes — the badge text (`{trait.category}`) stays as the category name.

**Files to check:**

- `src/app/traits/_components/trait-row.tsx` (the badge rendering)

**What not to change:**

- Do not change the edit dialog, create form, or any other component.
- Do not change the icon lookup functions in `src/lib/icons.ts` or `src/components/icons.tsx`.

**Verification:**

- View a trait with no override icon — badge should show the default category icon.
- View a trait with an override icon — badge should show the override icon instead.
- Badge text (category name) should not change in either case.

## Tasks

- [ ] Update category badge in trait-row.tsx to use override icon when set
