import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  createMessage: vi.fn(),
  executeTool: vi.fn(),
  persistWriteProposal: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mocks.createMessage };
  },
}));

vi.mock("@/lib/auth/supabase-auth", () => ({
  getCurrentOrgId: async () => "org_test",
}));

vi.mock("@/lib/agents/tools", () => ({
  getToolDefinitions: () => [],
  executeTool: mocks.executeTool,
}));

vi.mock("@/lib/agents/approval", () => ({
  persistWriteProposal: mocks.persistWriteProposal,
}));

import { POST } from "@/app/api/agent/chat/route";

describe("agent human approval gate", () => {
  beforeEach(() => {
    mocks.createMessage.mockReset();
    mocks.executeTool.mockReset();
    mocks.persistWriteProposal.mockReset();
    mocks.persistWriteProposal.mockResolvedValue({
      proposalId: "proposal_test_1",
      actionHash: "abc123hash",
      status: "proposed",
      expiresAt: "2026-09-06T00:00:00Z",
    });
  });

  it("persists the exact write proposal and fails closed before execution", async () => {
    mocks.createMessage.mockResolvedValue({
      content: [{
        type: "tool_use",
        id: "tool_write_1",
        name: "create_contact",
        input: { firstName: "Test", lastName: "Person", email: "test@example.com" },
      }],
      stop_reason: "tool_use",
    });

    const request = new NextRequest("http://localhost/api/agent/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Create this contact" }] }),
    });

    const response = await POST(request);
    const reader = response.body?.getReader();
    let stream = "";
    expect(reader).toBeDefined();
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      stream += typeof value === "string" ? value : new TextDecoder().decode(value);
    }

    expect(response.status).toBe(200);
    expect(mocks.persistWriteProposal).toHaveBeenCalledWith(expect.objectContaining({
      organizationId: "org_test",
      toolName: "create_contact",
      idempotencyKey: "popebot:tool_write_1",
    }));
    expect(stream).toContain('"proposalId":"proposal_test_1"');
    expect(stream).toContain('"actionHash":"abc123hash"');
    expect(stream).toContain('"reason":"awaiting_approval"');
    expect(mocks.executeTool).not.toHaveBeenCalled();
  });
});
