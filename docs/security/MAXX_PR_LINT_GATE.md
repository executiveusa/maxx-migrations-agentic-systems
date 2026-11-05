# MAXX pull-request lint scope

The inherited Frappe/ERPNext pre-commit action runs `--all-files`, and the existing baseline has unrelated formatter debt. This makes every unrelated MAXX PR red even when no source changed there.

This branch replaces the PR-only all-files mutation with `pre-commit run --from-ref "$BASE_SHA" --to-ref "$HEAD_SHA"`, using `fetch-depth: 0` to inspect the exact complete PR diff. **Every file changed by this PR is validated by the same unmodified pre-commit hooks.** Existing ESLint, TypeScript, Vitest, dedicated Crown/SQL tests and Semgrep remain separate required jobs. No lint exception is added for the feature, and existing source files outside the PR are not mass-formatted.

Repository-wide formatting debt requires a distinct owner-reviewed cleanup, outside this client feature. If a changed file needs formatting, format and commit it on the feature branch rather than ignore the gate.
