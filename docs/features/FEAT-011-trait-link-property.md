# FEAT-011: Trait link property

---
page: /traits, /link/[username]
area: traits
priority: medium
status: proposed
created: 2026-06-28
---

## Summary

Add an optional `link` field to traits that, when set, renders the trait value as a clickable link on the public link page. The link supports two modes:

1. **Direct URL** — the `link` value is used as-is as the `href` (e.g., `https://example.com`)
2. **Template URL** — the `link` value contains `{{value}}` which is replaced with the trait's `value` at render time (e.g., `https://twitter.com/{{value}}` with value `@daniel` produces `https://twitter.com/@daniel`)

## Motivation

Traits often represent contact information or social handles that naturally correspond to URLs — email addresses, Twitter handles, GitHub profiles, personal websites, etc. Currently these are displayed as plain text, requiring the viewer to copy and paste them. A link property lets trait owners make values directly clickable, improving usability for anyone viewing the link page.

## Scope

**In scope:**
- Add `link` optional `String?` field to the `Trait` model in Prisma
- Add `link` to the GraphQL `Trait` type and `CreateTraitInput` / `UpdateTraitInput`
- Add a `link` input field to the create trait form (`TraitForm`) and edit trait dialog (`EditTraitDialog`)
- Add a helper text explaining `{{value}}` template syntax below the link input
- Update the link page (`/link/[username]`) to render trait values as clickable `<a>` tags when a `link` is set
- Implement template replacement: `{{value}}` in the link string is replaced with the trait's `value`
- Add basic URL validation on create/update (must be a valid URL or contain `{{value}}`)

**Out of scope:**
- Changing the traits management table layout on `/traits` (the link field does not need to be displayed there, only editable)
- Adding link preview or favicon fetching
- Supporting other template variables besides `{{value}}`
- Opening links in new tabs vs same tab (default behavior is fine)
- Changing trait visibility or group logic

## Design

### Data model: `Trait.link`

Add an optional string field to the Trait model:

```prisma
model Trait {
  // ... existing fields ...
  link String?
}
```

### Template replacement

A small utility function processes the link before rendering:

```ts
function resolveTraitLink(link: string | null, value: string): string | null {
  if (!link) return null;
  return link.replace(/\{\{value\}\}/g, encodeURIComponent(value));
}
```

The `{{value}}` placeholder is replaced with the URL-encoded trait value. If the link does not contain `{{value}}`, it is used as-is.

### Create/Edit trait UI

In both `TraitForm` (create) and `EditTraitDialog` (edit), add a `link` input field below the "Value" field:

```
┌─────────────────────────────────────┐
│ Key          [email            ]    │
│ Value        [user@example.com ]    │
│ Link         [mailto:{{value}}  ]    │
│              {{value}} is replaced  │
│              with the trait value   │
│ Category     [Contact Info ▼  ]     │
│ ...                                 │
└─────────────────────────────────────┘
```

The input is optional — leaving it blank means the value renders as plain text (existing behavior).

Helper text below the input:
> Use `{{value}}` to insert the trait value, or enter a full URL directly.

### Link page rendering

In `/link/[username]/page.tsx`, the trait value cell changes from:

```tsx
<div className="text-muted-foreground truncate">
  {trait.value}
</div>
```

To:

```tsx
<div className="text-muted-foreground truncate">
  {trait.link ? (
    <a
      href={resolveTraitLink(trait.link, trait.value)}
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {trait.value}
    </a>
  ) : (
    trait.value
  )}
</div>
```

### GraphQL changes

- Add `link: String` to the `Trait` type
- Add `link: String` to `CreateTraitInput` and `UpdateTraitInput`

### Service layer changes

- `traitService.trait.createTrait`: accept `link` in the data object
- `traitService.trait.updateTrait`: accept `link` in the data object
- No validation changes needed — the field is optional and stored as-is

## Notes

- Prisma schema: `prisma/schema.prisma` — Trait model at line 57
- Trait create form: `src/app/traits/_components/trait-form.tsx` (190 lines) — 5-column grid layout
- Trait edit dialog: `src/app/traits/_components/edit-trait-dialog.tsx` (243 lines)
- Trait row: `src/app/traits/_components/trait-row.tsx` — does not need changes (link is not displayed in the table)
- Trait table: `src/app/traits/_components/trait-table.tsx` — does not need changes
- Link page: `src/app/link/[username]/page.tsx` (163 lines) — value rendering at lines 145-147
- Trait service: `src/lib/services/traitService.ts` — `createTrait` at line 25, `updateTrait` at line 40
- GraphQL types: `src/lib/graphql/typeDefs.ts` — Trait type at line 30, inputs at lines 64-77
- Trait actions: `src/app/traits/actions.ts` — `createTraitAction` at line 8, `updateTraitAction` at line 43
- The create form uses a 5-column grid (Key, Value, Category, Override Icon, Actions) — the link input could be added as a 6th column, or placed below in a new row to avoid crowding
- Consider placing the link input in the same column as the value (column 2) to keep the form compact, or add it as a full-width row below the first row of inputs

## Agent Instructions

**What to look for:**
- The `TraitForm` component layout (5-column grid) and how to add a new input without breaking the layout
- The `EditTraitDialog` component and its existing field structure
- The link page trait rendering loop that displays `trait.value` as plain text
- The `createTraitAction` and `updateTraitAction` server actions that pass trait data to the service layer

**Files to check:**
- `prisma/schema.prisma` — add `link String?` to Trait model
- `src/lib/graphql/typeDefs.ts` — add `link` to Trait type and input types
- `src/lib/services/traitService.ts` — update `createTrait` and `updateTrait` to accept `link`
- `src/app/traits/actions.ts` — update `createTraitAction` and `updateTraitAction` to pass `link`
- `src/app/traits/_components/trait-form.tsx` — add link input field with `{{value}}` helper text
- `src/app/traits/_components/edit-trait-dialog.tsx` — add link input field with `{{value}}` helper text
- `src/app/link/[username]/page.tsx` — render trait value as clickable link when `link` is set
- `src/app/traits/page.tsx` — include `link` in the trait fetch if needed

**What not to change:**
- The traits table layout or columns on `/traits`
- The trait visibility or group logic
- The GraphQL mutations for groups or connections
- The link page layout or connection action buttons
- The `TraitRow` component (link is not displayed in the management table)

**Verification:**
1. Run `yarn prisma generate` and `yarn prisma db push` to apply schema change
2. Create a trait with a direct URL link (e.g., `https://example.com`) → save → visit link page → value is clickable and opens the URL
3. Create a trait with a template link (e.g., `https://twitter.com/{{value}}`) and value `@daniel` → save → visit link page → value is clickable and opens `https://twitter.com/@daniel`
4. Create a trait with no link → save → visit link page → value renders as plain text (existing behavior)
5. Edit an existing trait to add a link → save → confirm it updates on the link page
6. Edit a trait to remove its link → save → confirm it reverts to plain text
7. Run `yarn lint`

## Tasks

- [ ] Add `link String?` to Trait model in `prisma/schema.prisma`
- [ ] Run `yarn prisma generate` and `yarn prisma db push`
- [ ] Add `link: String` to Trait GraphQL type and input types in `typeDefs.ts`
- [ ] Update `traitService.trait.createTrait` to accept `link`
- [ ] Update `traitService.trait.updateTrait` to accept `link`
- [ ] Update `createTraitAction` to pass `link`
- [ ] Update `updateTraitAction` to pass `link`
- [ ] Add `link` input to `TraitForm` with `{{value}}` helper text
- [ ] Add `link` input to `EditTraitDialog` with `{{value}}` helper text
- [ ] Update traits page to include `link` in trait fetch
- [ ] Create `resolveTraitLink` utility function for template replacement
- [ ] Update `/link/[username]/page.tsx` to render clickable links when `link` is set
- [ ] Run `yarn lint`

## Agent Instructions: When Completing a Feature

After implementing the feature:
1. Change `status: proposed` (or `in_progress`) to `status: done` in this file's YAML frontmatter.
2. Move the entry from the **Proposed** or **In Progress** table to the **Done** table in [docs/features/index.md](index.md), replacing the `—` placeholder with the feature ID, title, priority, and today's date.
