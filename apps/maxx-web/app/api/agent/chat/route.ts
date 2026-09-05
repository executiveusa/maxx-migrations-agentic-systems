import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { getCurrentOrgId } from "@/lib/auth/supabase-auth";
import { selectModel, isWriteTool, type ChatMessage } from "@/lib/agents/chat-router";
import { getToolDefinitions, executeTool, type ToolName } from "@/lib/agents/tools";

interface RequestBody { messages: ChatMessage[] }

const SYSTEM_PROMPT = `You are Popebot, the conversational interface for MAXX Revenue Capture OS.
Your job is to help a nontechnical business owner understand what needs attention, what revenue is evidenced, what was recovered, and what MAXX can safely do next.
Use tools before making claims about contacts, pipeline, integrations, provider events, recovery receipts, or revenue.
Never mix VERIFIED, ATTRIBUTED, ESTIMATED, and UNKNOWN value. Never call pipeline value revenue.
Read-only tools may execute immediately. Any write, send, publish, spend, delete, credential, legal, payment, or other consequential action must stop at the exact approval boundary.
Do not claim an integration is live because code exists; require provider evidence such as an event ID, message SID, payment ID, sync result, or verification timestamp.
Keep responses concise, plain-language, and action-oriented.`;

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as RequestBody;
    const messages = body.messages ?? [];
    if (!Array.isArray(messages)) return NextResponse.json({ error: "Messages must be an array" }, { status: 400 });

    const orgId = await getCurrentOrgId();
    const model = selectModel(messages);
    const apiModel = model === "haiku" ? "claude-haiku-4-5-20251001" : "claude-sonnet-5-20241022";

    const stream = new ReadableStream<string>({
      async start(controller) {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        try {
          const anthropicMessages: MessageParam[] = messages.map((msg) => ({
            role: msg.role,
            content: typeof msg.content === "string"
              ? msg.content
              : msg.content.filter((block) => typeof block === "object" && "text" in block)
                .map((block) => ({ type: "text" as const, text: block.text ?? "" })),
          }));

          const tools = getToolDefinitions();
          let loopMessages = [...anthropicMessages];
          let continueLoop = true;

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: apiModel,
              max_tokens: 1400,
              tools,
              messages: loopMessages,
              system: SYSTEM_PROMPT,
            });
            const assistantContent: unknown[] = [];

            for (const block of response.content) {
              if (block.type === "text") {
                controller.enqueue(`data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`);
                assistantContent.push({ type: "text", text: block.text });
                continue;
              }
              if (block.type !== "tool_use") continue;

              assistantContent.push({ type: "tool_use", id: block.id, name: block.name, input: block.input });
              if (isWriteTool(block.name)) {
                controller.enqueue(`data: ${JSON.stringify({
                  type: "tool_call_pending",
                  toolId: block.id,
                  toolName: block.name,
                  toolInput: block.input,
                })}\n\n`);
                controller.enqueue(`data: ${JSON.stringify({ type: "done", reason: "awaiting_approval" })}\n\n`);
                controller.close();
                return;
              }

              const result = await executeTool(block.name as ToolName, block.input, orgId);
              controller.enqueue(`data: ${JSON.stringify({ type: "tool_result", toolName: block.name, content: result })}\n\n`);
              loopMessages.push({ role: "assistant", content: assistantContent as MessageParam["content"] });
              loopMessages.push({ role: "user", content: [{ type: "tool_result", tool_use_id: block.id, content: result }] });
              assistantContent.length = 0;
            }

            if (assistantContent.length > 0) loopMessages.push({ role: "assistant", content: assistantContent as MessageParam["content"] });
            continueLoop = response.stop_reason === "tool_use";
          }

          controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          controller.close();
        } catch (error) {
          controller.enqueue(`data: ${JSON.stringify({ type: "error", error: error instanceof Error ? error.message : "Unknown error" })}\n\n`);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (error) {
    const status = error instanceof Error && /authenticated|membership|organization/i.test(error.message) ? 401 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status });
  }
}
