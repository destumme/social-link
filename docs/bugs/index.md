# Bugs

Track known bugs and their resolution status.

## Open

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| [BUG-001](BUG-001-connections-not-updated-group-reorder.md) | Connections not updated on group edit + group reorder | medium | open |
| [BUG-005](BUG-005-add-to-group-edit-button-toggle.md) | "Add to group" button should be "Edit groups" with Switch toggles | low | open |

## Resolved

| ID | Title | Severity | Resolved |
|----|-------|----------|----------|
| [BUG-002](BUG-002-category-badge-override-icon.md) | Category badge doesn't show override icon | low | 2026-06-21 |
| [BUG-003](BUG-003-dead-rename-button-groups.md) | Dead "Rename" button on connection groups page | low | 2026-06-21 |
| [BUG-004](BUG-004-int-test-not-containerized.md) | Integration tests share host with running dev service | medium | 2026-06-21 |

## Agent Instructions: Creating a New Bug

**IMPORTANT: Do NOT implement the fix when logging a bug.** Creating a bug report and fixing it are separate steps. Only log the bug — do not edit any source code.

Prompt the user for this information if needed.
Do not diagnose the entire bug, gather information as needed to fill out the template.

1. Create a new file in this directory named `BUG-NNN-short-title.md` (use the next sequential number).
2. Copy the contents of `TEMPLATE.md` into the new file.
3. Fill in the YAML frontmatter (`page`, `area`, `severity`, `status`, `created`).
4. Write the summary, observed behavior, and expected behavior.
5. Add a link to the new file in the **Open** table above.
