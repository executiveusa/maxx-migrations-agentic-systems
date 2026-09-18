# 06 — BUILD

## Purpose
Implement the approved system without destroying useful brownfield capability.

## Inputs
- approved architecture
- proof/media assets
- approved visual system
- repository operating rules
- current production/runtime constraints

## Process
Build templates before one-off pages. Preserve working forms, SEO, analytics, APIs, accessibility, auth, webhooks, localization, and other validated infrastructure unless a decision explicitly replaces them. Implement in bounded vertical slices with rollback.

## Default implementation order
1. global shell/navigation
2. typography/tokens
3. media system
4. homepage
5. program/offer template
6. work/case-study template
7. story/about
8. built-here/culture/editorial surfaces
9. notes/blog
10. apply/contact conversion path

## Outputs
- working branch/PR
- implementation evidence
- changed-file inventory
- migration notes where applicable
- rollback path

## Evidence
Build, lint, typecheck, tests, browser checks, accessibility checks, responsive captures, route/API checks.

## Human/authority check
No production/domain/destructive data change without the repository's required approval.

## Exit condition
The implementation matches the approved architecture and design, existing critical capabilities still work, and all declared build gates pass.
