// Static preflight only. Database RLS must still be tested with independent JWTs.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const dir = dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(join(dir, name), 'utf8');
const schema = read('PROPOSED-SCHEMA-AND-SEED.sql');
const scope = read('CANONICAL-CLIENT-RPC-AND-RLS-CANDIDATE.sql');
const management = read('MANAGEMENT-RPC-CANDIDATE.sql');
const requiredClients = ['crown-and-core', 'thp-flooring', 'bunna-restaurant',
  'macs-digital-media', 'asc3nd', '3x-plumbers', 'tangles-and-locs'];
for (const slug of requiredClients) {
  assert.match(schema, new RegExp("'"+slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+"'"), 'missing client '+slug);
}
for (const table of ['project_memberships','project_prompt_templates','project_archive_requests']) {
  assert.match(schema, new RegExp('ALTER TABLE maxx\\.'+table+' ENABLE ROW LEVEL SECURITY'), 'RLS absent: '+table);
  assert.match(schema, new RegExp('REVOKE ALL ON maxx\\.'+table+' FROM PUBLIC, anon, authenticated'), 'grants too broad: '+table);
}
for (const policy of ['maxx_v3_project_read_scope','maxx_v3_run_steps_select',
  'maxx_v3_approvals_select','maxx_v3_intake_scope','maxx_v3_membership_scope']) {
  assert.ok(scope.includes('CREATE POLICY '+policy), 'missing restrictive policy '+policy);
}
for (const file of [scope, management]) {
  for (const match of file.matchAll(/GRANT EXECUTE ON FUNCTION (public\.maxx_service_\w+\([^;]+?\))\s+TO\s+([^;]+);/gs)) {
    assert.equal(match[2].trim(), 'service_role', 'unsafe public service RPC grant: '+match[1]);
  }
}
assert.match(management, /recovery_until=now\(\)\+interval '30 days'/);
assert.match(management, /v_project\.slug IN \('client-zero','macs-digital-media'\)/);
assert.match(schema, /NO automatic user membership/);
assert.match(scope, /'promptsSource', 'operator_template'/);
console.log('MAXX candidate static boundary checks passed (NOT a database RLS test)');
