# 05_release — ship with control and rollback

## Inputs

- verified receipt from `04_verify`
- deployment/release contract for the target system
- approval payload for consequential production actions

## Process

1. Revalidate approval immediately before consequential execution.
2. Release only the verified revision.
3. Preserve domain/data/credential ownership.
4. Confirm runtime health after release.
5. Keep rollback executable.
6. Do not call release verified until production evidence exists.

## Outputs

Release receipt: revision, environment, evidence, owner, rollback, status.

## Human check

Required for consequential production changes and final acceptance where policy demands it.
