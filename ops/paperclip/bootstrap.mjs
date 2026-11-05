#!/usr/bin/env node
import { PROJECT, TASKS, MARKER, ROOT_TITLE } from "./crown-core-plan.mjs";

const normalize = (value) => String(value || "").replace(/\/+$/, "");
function requireEndpoint(raw) {
  const endpoint = new URL(raw);
  if (endpoint.username || endpoint.password || endpoint.hash || endpoint.search) throw new Error("Invalid Paperclip endpoint.");
  const local = ["127.0.0.1", "localhost", "::1", "[::1]"].includes(endpoint.hostname);
  if (endpoint.protocol !== "https:" && !(endpoint.protocol === "http:" && local)) {
    throw new Error("Paperclip endpoint must use HTTPS (or local loopback HTTP).");
  }
  return normalize(endpoint.href);
}

function onlyOne(items, predicate, name) {
  const matching = items.filter(predicate);
  if (matching.length > 1) throw new Error("Duplicate " + name + " records; manual reconciliation required.");
  return matching[0] || null;
}
function itemsOf(response) {
  if (Array.isArray(response)) return response;
  if (response && Array.isArray(response.items)) return response.items;
  throw new Error("Unexpected Paperclip collection response.");
}

export async function syncCrownProject(options = {}) {
  const apply = options.apply === true;
  const preview = {
    status: apply ? "PREFLIGHT" : "DRY_RUN",
    project: PROJECT.name,
    stable_marker: MARKER,
    project_repo: PROJECT.workspace.repoUrl,
    task_count: TASKS.length,
    existing_company_required: true,
    existing_instinct_required: true,
    expected_manager_heartbeat_seconds: 600,
    heartbeat_activation_proven: false,
    estimated_incremental_paid_spend_usd: 0,
    forbidden: ["create_company","create_instinct","activate_external_actions","publish","deploy","send","spend"]
  };
  if (!apply) return preview;

  const endpoint = requireEndpoint(options.apiUrl);
  const key = options.apiKey;
  const companyId = options.companyId;
  const managerId = options.managerId;
  if (!key || !companyId || !managerId) {
    throw new Error("An existing authorized Paperclip board token, company ID and Instinct agent ID are required.");
  }
  const fetchImpl = options.fetchImpl || fetch;
  async function api(path, body) {
    const response = await fetchImpl(endpoint + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        authorization: "Bearer " + key,
        "content-type": "application/json"
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error("Paperclip rejected " + path + ": HTTP " + response.status);
    }
    return payload;
  }

  // A board identity, not an agent or a public user, must activate bootstrap.
  await api("/api/cli-auth/me");
  const company = await api("/api/companies/" + encodeURIComponent(companyId));
  if (company.id !== companyId) throw new Error("Paperclip company identity mismatch.");
  const manager = await api("/api/agents/" + encodeURIComponent(managerId));
  if (manager.id !== managerId || manager.companyId !== companyId || ["terminated","pending_approval"].includes(manager.status)) {
    throw new Error("Instinct identity is not an active agent in the specified company.");
  }

  const projectPath = "/api/companies/" + encodeURIComponent(companyId) + "/projects";
  let projects = itemsOf(await api(projectPath));
  let project = onlyOne(projects, (p) => (p.description || "").includes(MARKER), "Crown project");
  let projectCreated = false;
  if (!project) {
    // Second read before the first mutation to reduce stale-read duplicates.
    projects = itemsOf(await api(projectPath));
    project = onlyOne(projects, (p) => (p.description || "").includes(MARKER), "Crown project");
    if (!project) {
      project = await api(projectPath, PROJECT);
      projectCreated = true;
    }
  }
  if (!project.id) throw new Error("Missing Paperclip project ID.");
  const issuePath = "/api/companies/" + encodeURIComponent(companyId) + "/issues";
  const listPath = issuePath + "?projectId=" + encodeURIComponent(project.id);
  const existing = itemsOf(await api(listPath));
  const rootMarker = "[task_id:CC-ROOT]";
  let root = onlyOne(existing, (x) => (x.description || "").includes(rootMarker) || (x.title === ROOT_TITLE && x.projectId === project.id), "root issue");
  let created = 0;
  if (!root) {
    root = await api(issuePath, {
      title: ROOT_TITLE,
      description: rootMarker + "\n" + MARKER +
        "\nGoal: working internal Vibe Audit, reviewed and cost-capped, followed by explicitly authorized commercial stages. Source: https://github.com/executiveusa/maxx-migrations-agentic-systems/pull/39",
      status:"todo",priority:"high",projectId:project.id,assigneeAgentId:managerId
    });
    created++;
  }
  if (!root.id) throw new Error("Paperclip did not return root issue ID.");

  for (const task of TASKS) {
    // Re-read per iteration so re-running after a crash cannot blindly recreate completed work.
    const snapshot = itemsOf(await api(listPath));
    const marker = "[task_id:" + task.id + "]";
    const match = onlyOne(snapshot, (x) => (x.description || "").includes(marker) ||
      (x.title?.startsWith(task.id + " |") && x.parentId === root.id), task.id);
    if (match) continue;
    await api(issuePath, {
      title: task.id + " | " + task.title,
      description: marker + "\n" + MARKER + "\n" + task.description +
        "\nDepends on: " + (task.depends_on.join(", ") || "none") +
        "\nEvidence required: exact SHA, real run ID or truthful BLOCKED, independent review.",
      status:task.status,priority:task.priority,
      projectId:project.id,parentId:root.id,
      ...(task.id === "CC-P0" || task.id === "CC-P1" ? { assigneeAgentId:managerId } : {})
    });
    created++;
  }

  return {
    status:"PAPERCLIP_TASKS_CREATED_OR_REUSED",
    company_id:companyId,project_id:project.id,manager_agent_id:managerId,
    project_created:projectCreated,issues_created:created,expected_total_issues:TASKS.length+1,
    heartbeat_configuration:"UNVERIFIED",
    live_timed_worker_proof:false,
    next_action:"Inspect actual Paperclip agent adapter/heartbeat policy, set 600 seconds if authorized, then verify three timed runs and real worker checkpoint; no duplicate monitor."
  };
}

if (process.argv[1] && import.meta.url === new URL("file://" + process.argv[1]).href) {
  const apply = process.argv.includes("--apply");
  syncCrownProject({
    apply,
    apiUrl:process.env.PAPERCLIP_API_URL,
    apiKey:process.env.PAPERCLIP_BOARD_API_KEY,
    companyId:process.env.PAPERCLIP_COMPANY_ID,
    managerId:process.env.PAPERCLIP_INSTINCT_AGENT_ID
  }).then((result) => {
    process.stdout.write(JSON.stringify(result,null,2) + "\n");
  }).catch((error) => {
    process.stderr.write("Paperclip bootstrap blocked: " + error.message + "\n");
    process.exitCode=1;
  });
}
