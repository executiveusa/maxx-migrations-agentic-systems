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
  assert.ok(schema.includes("'" + slug + "'"), 'missing client '+slug);
}
// Membership and related records must be tied to the SAME organization as
// their project, including for service-role writes that bypass RLS.
for (const table of ['project_memberships', 'project_prompt_templates', 'project_archive_requests']) {
  const definition = schema.split('CREATE TABLE IF NOT EXISTS maxx.' + table + ' (')[1]
    ?.split(');')[0];
  assert.ok(definition, 'missing table definition: ' + table);
  assert.match(definition, /FOREIGN KEY\s*\(organization_id,\s*project_id\)\s*REFERENCES\s+maxx\.projects\s*\(organization_id,\s*id\)/i,
    'missing composite organization/project FK: ' + table);
}
for (const table of ['project_memberships','project_prompt_templates','project_archive_requests']) {
  assert.match(schema, new RegExp('ALTER TABLE maxx\\.'+table+' ENABLE ROW LEVEL SECURITY'), 'RLS absent: '+table);
  assert.match(schema, new RegExp('REVOKE ALL ON maxx\\.'+table+' FROM PUBLIC, anon, authenticated'), 'grants too broad: '+table);
}
for (const policy of ['maxx_v3_project_read_scope','maxx_v3_run_steps_select',
  'maxx_v3_approvals_select','maxx_v3_intake_scope','maxx_v3_membership_scope']) {
  // Anchor to a SQL statement so commented-out policies cannot satisfy the gate.
  assert.match(scope, new RegExp('^\\s*CREATE\\s+POLICY\\s+' + policy + '\\b', 'm'), 'missing restrictive policy '+policy);
}
// Fail closed if any privileged service RPC loses its revoke or gains a broad grant.
const serviceSql = scope + '\n' + management;
for (const name of [
  'maxx_service_client_workspaces',
  'maxx_service_create_client_workspace',
  'maxx_service_archive_client_step'
]) {
  const signature = 'public\\.' + name + '\\([^;]*?\\)';
  const grants = [...serviceSql.matchAll(new RegExp(
    'GRANT\\s+EXECUTE\\s+ON\\s+FUNCTION\\s+(' + signature + ')\\s+TO\\s+([^;]+);', 'gi'
  ))];
  assert.equal(grants.length, 1, 'expected one service grant: ' + name);
  assert.equal(grants[0][2].trim().toLowerCase(), 'service_role', 'unsafe grant: ' + name);
  const revokes = [...serviceSql.matchAll(new RegExp(
    'REVOKE\\s+ALL\\s+ON\\s+FUNCTION\\s+' + signature + '\\s+FROM\\s+([^;]+);', 'gi'
  ))];
  assert.equal(revokes.length, 1, 'missing revoke: ' + name);
  const roles = revokes[0][1].toLowerCase().split(',').map(x => x.trim());
  for (const role of ['public', 'anon', 'authenticated']) {
    assert.ok(roles.includes(role), 'missing ' + role + ' revoke: ' + name);
  }
}
assert.match(management, /recovery_until=now\(\)\+interval '30 days'/);
assert.match(management, /v_project\.slug IN \('client-zero','macs-digital-media'\)/);
assert.match(schema, /NO automatic user membership/);
// The service role bypasses RLS: an otherwise authenticated workspace-create
// RPC must not silently enroll the actor (or any other user) as a project owner.
// Membership changes require an independently authorized enrollment operation.
const createRpc = management.split('CREATE OR REPLACE FUNCTION public.maxx_service_create_client_workspace(')[1]
  ?.split('CREATE UNIQUE INDEX IF NOT EXISTS maxx_one_open_archive_request')[0];
assert.ok(createRpc, 'missing create-client RPC');
assert.doesNotMatch(createRpc, /INSERT\s+INTO\s+maxx\.project_memberships\b/i,
  'create-client RPC must not implicitly grant membership');
assert.match(scope, /'promptsSource', 'operator_template'/);
console.log('MAXX candidate static boundary checks passed (NOT a database RLS test)');
