// Negative controls for the static preflight; never touches a database.
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const sourceDir = dirname(fileURLToPath(import.meta.url));
const files = [
  'verify-candidate-boundaries.mjs',
  'PROPOSED-SCHEMA-AND-SEED.sql',
  'CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql',
  'MANAGEMENT-RPC-CANDIDATE.sql',
];
const source = Object.fromEntries(files.map(name => [name, readFileSync(join(sourceDir, name), 'utf8')]));
const tmp = mkdtempSync(join(tmpdir(), 'maxx-boundary-negative-'));
function run(changes = {}) {
  for (const name of files) writeFileSync(join(tmp, name), changes[name] ?? source[name]);
  return spawnSync(process.execPath, [join(tmp, 'verify-candidate-boundaries.mjs')], {
    encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024,
  });
}
function mustFail(label, changes) {
  const result = run(changes);
  assert.notEqual(result.status, 0, label + ' unexpectedly passed');
  assert.match(result.stderr, /AssertionError/, label + ' did not fail on an assertion');
}
try {
  const baseline = run();
  assert.equal(baseline.status, 0, 'baseline preflight failed: ' + baseline.stderr);
  assert.match(baseline.stdout, /NOT a database RLS test/);
  const scopeName = 'CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql';
  const scope = source[scopeName];
  const grant = /GRANT\s+EXECUTE\s+ON\s+FUNCTION\s+public\.maxx_service_client_workspaces\([^;]*?\)\s+TO\s+service_role\s*;/i;
  assert.match(scope, grant, 'fixture missing expected service grant');
  mustFail('missing service grant', { [scopeName]: scope.replace(grant, '') });
  mustFail('broad service grant', { [scopeName]: scope.replace(grant, match => match.replace(/TO\s+service_role/i, 'TO authenticated')) });
  const revoke = /REVOKE\s+ALL\s+ON\s+FUNCTION\s+public\.maxx_service_client_workspaces\([^;]*?\)\s+FROM\s+[^;]+;/i;
  assert.match(scope, revoke, 'fixture missing expected service revoke');
  mustFail('missing service revoke', { [scopeName]: scope.replace(revoke, '') });
  // A child-table policy regression must fail the same static gate.
  assert.match(scope, /CREATE POLICY maxx_v3_approvals_select/);
  mustFail('missing approvals isolation policy', {
    [scopeName]: scope.replace('CREATE POLICY maxx_v3_approvals_select',
      '-- CREATE POLICY maxx_v3_approvals_select removed'),
  });
  const schemaName = 'PROPOSED-SCHEMA-AND-SEED.sql';
  const schema = source[schemaName];
  assert.match(schema, /ALTER TABLE maxx\.project_memberships ENABLE ROW LEVEL SECURITY/);
  mustFail('missing membership RLS', {
    [schemaName]: schema.replace('ALTER TABLE maxx.project_memberships ENABLE ROW LEVEL SECURITY', '-- RLS deliberately removed'),
  });
  console.log('MAXX boundary negative controls passed (static only; database isolation untested)');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
