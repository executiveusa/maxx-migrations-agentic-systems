import { describe, expect, it } from "vitest";
import { routeModel } from "@/lib/agents/model-router";
import { checkBudget, checkToolPermission } from "@/lib/agents/tool-policy";
import { evaluateAgentRun } from "@/lib/agents/agent-runner";
import type { AiAgent } from "@/lib/types/agents";

const agent: AiAgent = {
  id: "agent_test",
  name: "Test Agent",
  description: "Test",
  modelPolicy: "claude-sonnet-5",
  status: "active",
  toolPermissions: ["read", "write"],
  monthlyBudgetUsd: 10,
  monthlySpendUsd: 5,
};

describe("routeModel", () => {
  it("routes low-token, non-generative tasks to the fast model", () => {
    const route = routeModel(500, false);
    expect(route.model).toBe("claude-haiku-4-5");
  });

  it("routes generative tasks to the default reasoning model", () => {
    const route = routeModel(500, true);
    expect(route.model).toBe("claude-sonnet-5");
  });
});

describe("tool-policy", () => {
  it("denies a permission the agent does not have", () => {
    const check = checkToolPermission(agent, "billing");
    expect(check.granted).toBe(false);
  });

  it("denies an inactive agent regardless of permissions", () => {
    const check = checkToolPermission({ ...agent, status: "inactive" }, "read");
    expect(check.granted).toBe(false);
  });

  it("denies when over budget", () => {
    const check = checkBudget({ ...agent, monthlySpendUsd: 10 });
    expect(check.granted).toBe(false);
  });
});

describe("evaluateAgentRun", () => {
  it("allows a run within permissions and budget", () => {
    const result = evaluateAgentRun(agent, "Test task", 500, false);
    expect(result.allowed).toBe(true);
    expect(result.route).toBeDefined();
  });

  it("blocks a run over budget", () => {
    const result = evaluateAgentRun({ ...agent, monthlySpendUsd: 10 }, "Test task", 500, false);
    expect(result.allowed).toBe(false);
  });
});
