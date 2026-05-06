# Task 4-b: Fix Dead Buttons in Proposals and Audit Modules

## Summary
Fixed 3 dead/non-functional button handlers across the Proposals and Audit modules.

## Changes Made

### Proposals Module (`src/components/modules/proposals.tsx`)

1. **handleShare** (line ~598): Replaced dead URL generation (`/proposal/{token}` - no such route exists) with copying proposal data (title, client, value, status) to clipboard as formatted JSON. Uses `navigator.clipboard.writeText()`.

2. **handleExportPdf** (line ~612): Replaced toast-only handler with actual file download. Generates a formatted text report containing proposal header, sections, and pricing table, then creates a Blob and triggers browser download as `.txt` file.

### Audit Module (`src/components/modules/audit.tsx`)

3. **handleExportReport** (line ~489): Replaced toast-only handler with actual file download. Generates a detailed text report including URL, status, scores (Overall, SEO, UX, Performance, Accessibility), findings with severity, and recommendations. Downloads as `.txt` file.

## Verification
- All other buttons in both modules were verified to have working onClick handlers
- Lint passes cleanly with no errors
- No other dead buttons found
