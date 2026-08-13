-- MAXX authenticated tenant-isolation regression test.
-- Runs entirely inside a transaction and rolls all fixtures back.
-- Any failed assertion raises and should fail CI/test execution.

begin;

create temp table maxx_rls_test_result (
  test_name text primary key,
  passed boolean not null,
  detail jsonb not null default '{}'::jsonb
);
grant select, insert, update on maxx_rls_test_result to authenticated;

insert into auth.users (id, aud, role, created_at, updated_at)
values
  ('11111111-1111-4111-8111-111111111111'::uuid, 'authenticated', 'authenticated', now(), now()),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'authenticated', 'authenticated', now(), now());

insert into maxx.organizations (id, slug, name)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'rls-test-tenant-a', 'RLS Test Tenant A'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'rls-test-tenant-b', 'RLS Test Tenant B');

insert into maxx.memberships (organization_id, user_id, role, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, '11111111-1111-4111-8111-111111111111'::uuid, 'owner', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, '22222222-2222-4222-8222-222222222222'::uuid, 'owner', 'active');

insert into maxx.projects (id, organization_id, slug, name, project_type)
values
  ('aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa'::uuid, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'tenant-a-project', 'Tenant A Project', 'client'),
  ('bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb'::uuid, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, 'tenant-b-project', 'Tenant B Project', 'client');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);

insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_a_sees_only_own_org', count(*) = 1, jsonb_build_object('visible_rows', count(*))
from maxx.organizations;

insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_a_cannot_read_tenant_b_project', count(*) = 0, jsonb_build_object('visible_foreign_rows', count(*))
from maxx.projects where id = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb'::uuid;

with attempted as (
  update maxx.projects set name = 'ILLEGAL TENANT A WRITE'
  where id = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb'::uuid returning id
)
insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_a_cannot_update_tenant_b_project', count(*) = 0, jsonb_build_object('updated_foreign_rows', count(*))
from attempted;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);

insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_b_sees_only_own_org', count(*) = 1, jsonb_build_object('visible_rows', count(*))
from maxx.organizations;

insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_b_cannot_read_tenant_a_project', count(*) = 0, jsonb_build_object('visible_foreign_rows', count(*))
from maxx.projects where id = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa'::uuid;

with attempted as (
  update maxx.projects set name = 'ILLEGAL TENANT B WRITE'
  where id = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa'::uuid returning id
)
insert into maxx_rls_test_result(test_name, passed, detail)
select 'tenant_b_cannot_update_tenant_a_project', count(*) = 0, jsonb_build_object('updated_foreign_rows', count(*))
from attempted;

reset role;

do $$
begin
  if exists (select 1 from maxx_rls_test_result where passed is not true) then
    raise exception 'MAXX tenant-isolation test failed: %', (
      select jsonb_agg(jsonb_build_object('test', test_name, 'passed', passed, 'detail', detail))
      from maxx_rls_test_result where passed is not true
    );
  end if;
end $$;

rollback;
