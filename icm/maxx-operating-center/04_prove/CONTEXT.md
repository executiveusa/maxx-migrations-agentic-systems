# 04_prove — verify MAXX readiness

One job: prove that the completed mission was safe, correct, observable, reversible where promised, and portable.

## Inputs
- Working: `../03_execute/output/mission-result.md`
- Reference: `../_shared/readiness-bar.md`
- Authority: `../../../docs/icm/HUMAN_MACHINE_CONTRACT.md`
- Repo gates: `../../../apps/maxx-web/package.json`

Do NOT convert implementation claims into verified claims without receipts.

## Process
1. Run the ICM walk test with a memoryless-agent perspective.
2. Run the relevant repository verification gates.
3. Verify tenant isolation, approval binding, exactly-once behavior, evidence, rollback/recovery, and export where the mission touches them.
4. Check live deployment/runtime health for touched production surfaces.
5. Run a separate harsh critic against the readiness bar and record the single largest remaining gap.

## Outputs
- `readiness.md` → `output/`

## Human check
Accept MAXX as ready only if the evidence supports the claim and any remaining gaps are explicitly accepted.
