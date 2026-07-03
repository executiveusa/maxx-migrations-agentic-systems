# 14 — GHL Import Spec

## The 7 wizard steps

Source → Upload/Connect → Objects → Map fields → Validate → Run → Summary
— `GhlImportWizard.tsx`, matching spec section 8.9 exactly (no steps
collapsed or skipped).

## The 10 importable objects

`contacts, opportunities, pipelines, stages, notes, tasks, appointments,
conversations, tags, custom_fields` — `GhlObjectType` in
`lib/types/imports.ts`.

## Pipeline

1. `lib/import/ghl/csv-parser.ts` — `parseCsv()`, handles quoted fields
   and embedded commas.
2. `lib/import/ghl/mapper.ts` — `suggestMappings()`, alias-aware header
   matching with a confidence score (1.0 exact, 0.85 known alias, 0 no
   match).
3. `lib/import/ghl/validator.ts` — `validateRecords()`, flags missing
   required-mapped fields and malformed emails, per row.
4. `lib/import/ghl/import-runner.ts` — `runImport()` produces
   total/imported/error counts; `toErrorCsv()` produces a downloadable
   error report.

## CSV vs live API

CSV import requires zero configuration (a "load sample data" button ships
for the demo). The live API path (`GhlApiProvider`) is disabled in the
wizard's source step with an explicit "Setup required — add GHL_API_KEY
and GHL_LOCATION_ID" message until those env vars are set.
