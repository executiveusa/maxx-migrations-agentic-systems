import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response({ error: "MAXX backend configuration is incomplete" }, 500);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    return response({ error: "Authentication required" }, 401);
  }

  const token = authorization.slice("Bearer ".length).trim();
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  const user = userData?.user;
  if (userError || !user) {
    return response({ error: "Invalid or expired authentication" }, 401);
  }

  try {
    if (req.method === "GET") {
      const organizationId = new URL(req.url).searchParams.get("organization_id");
      if (!organizationId) {
        return response({ error: "organization_id is required" }, 400);
      }

      const { data, error } = await userClient.rpc("maxx_agent_snapshot", {
        p_organization_id: organizationId,
      });
      if (error) {
        return response({ error: error.message }, error.code === "42501" ? 403 : 400);
      }
      if (!data?.organization) {
        return response({ error: "Organization not found or not authorized" }, 404);
      }
      return response({ ok: true, data });
    }

    if (req.method !== "POST") {
      return response({ error: "Method not allowed" }, 405);
    }

    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body || typeof body.operation !== "string") {
      return response({ error: "operation is required" }, 400);
    }

    if (body.operation === "create_proposal") {
      const { data, error } = await userClient.rpc("maxx_agent_create_proposal", {
        p_organization_id: body.organization_id,
        p_project_id: body.project_id ?? null,
        p_action_key: body.action_key,
        p_action_class: body.action_class,
        p_tool_key: body.tool_key ?? null,
        p_risk_class: body.risk_class ?? "medium",
        p_payload_redacted: body.payload_redacted ?? {},
        p_idempotency_key: body.idempotency_key,
        p_requested_by_agent: body.requested_by_agent ?? "agent-maxx",
        p_requires_approval: body.requires_approval ?? true,
        p_expires_at: body.expires_at ?? null,
      });
      if (error) {
        return response({ error: error.message, code: error.code }, error.code === "42501" ? 403 : 400);
      }
      return response({ ok: true, data }, 201);
    }

    if (body.operation === "decide_proposal") {
      const { data, error } = await userClient.rpc("maxx_agent_decide_proposal", {
        p_action_proposal_id: body.action_proposal_id,
        p_decision: body.decision,
        p_rationale: body.rationale ?? null,
      });
      if (error) {
        return response({ error: error.message, code: error.code }, error.code === "42501" ? 403 : 400);
      }
      return response({ ok: true, data });
    }

    if (body.operation === "execute_test_action") {
      const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await serviceClient.rpc("maxx_execute_approved_test_action", {
        p_action_proposal_id: body.action_proposal_id,
        p_actor_user_id: user.id,
      });
      if (error) {
        return response({ error: error.message, code: error.code }, error.code === "42501" ? 403 : 400);
      }
      return response({ ok: true, data });
    }

    return response({ error: "Unsupported operation" }, 400);
  } catch (error) {
    console.error("maxx-agent-api", error);
    return response({ error: "Internal MAXX API error" }, 500);
  }
});
