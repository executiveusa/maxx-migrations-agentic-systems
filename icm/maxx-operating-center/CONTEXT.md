# MAXX Operating Center — completion pipeline

The flow in one line: understand the real system → connect the missing seams → perform one real job → prove safety and outcome → package the pattern for the next company.

| Stage | Job | Input | Output | Human check |
|---|---|---|---|---|
| `01_orient` | establish current truth | repo + live infrastructure | `output/current-state.md` | confirm no important system is missing |
| `02_connect` | close required seams | current state + canonical architecture | `output/connection-map.md` | approve consequential connection/credential changes |
| `03_execute` | complete one business job | connected MAXX + MACS ICM | `output/mission-result.md` | review only decisions requiring human judgment |
| `04_prove` | verify readiness | mission evidence + tests + logs | `output/readiness.md` | accept or reject readiness claim |
| `05_package` | extract reusable company pattern | verified MAXX + Client Zero | `output/company-template.md` | confirm another company can be onboarded without MACS leakage |

Factory (stable): `_shared/`
Product (changes as the build advances): each stage `output/` plus `working-state/STATUS.md`.

A stage is complete only when its named output exists and its evidence requirement is satisfied. Code presence alone is not completion.
