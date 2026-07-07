import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { getCurrentOrgId } from "@/lib/data/supabase-client";
import { selectModel, isWriteTool, type ChatMessage } from "@/lib/agents/chat-router";
import { getToolDefinitions, executeTool, type ToolName } from "@/lib/agents/tools";

/**
 * POST /api/agent/chat
 *
 * Streaming chat endpoint that accepts messages and returns an SSE stream of agent responses.
 *
 * Request body:
 * { messages: { role, content }[] }
 *
 * Response: text/event-stream with JSON events
 * { type: "text", content: "..." } — assistant text chunk
 * { type: "tool_call", toolName: "...", toolInput: {...} } — tool call pending approval
 * { type: "tool_result", toolName: "...", content: "..." } — tool execution result
 * { type: "error", error: "..." } — error message
 * { type: "done" } — stream end marker
 */

interface RequestBody {
  messages: ChatMessage[];
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as RequestBody;
    const messages = body.messages || [];

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages must be an array" }, { status: 400 });
    }

    const orgId = getCurrentOrgId();
    const model = selectModel(messages);
    const apiModel = model === "haiku" ? "claude-haiku-4-5-20251001" : "claude-sonnet-5-20241022";

    // Create streaming response
    const stream = new ReadableStream<string>({
      async start(controller) {
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        try {
          // Convert chat messages to Anthropic format
          const anthropicMessages: MessageParam[] = messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content:
              typeof msg.content === "string"
                ? msg.content
                : msg.content.filter((block) => typeof block === "object" && "text" in block)
                    .map((block) => ({
                      type: "text" as const,
                      text: (block as { text?: string }).text ?? "",
                    })),
          }));

          const tools = getToolDefinitions();
          let continueLoop = true;
          let loopMessages = [...anthropicMessages];

          // Agent loop: process messages, handle tool calls, stream responses
          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: apiModel,
              max_tokens: 1024,
              tools: tools,
              messages: loopMessages,
              system:
                "You are a helpful AI assistant for a nonprofit CRM. Help users manage contacts and deals. " +
                "Always ask for confirmation before making changes. Keep responses concise and focused. " +
                "When the user asks to create, move, or delete, explain what you would do and ask for approval.",
            });

            // Stream response blocks
            const assistantContent: unknown[] = [];

            for (const block of response.content) {
              if (block.type === "text") {
                controller.enqueue(`data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`);
                assistantContent.push({ type: "text", text: block.text });
              } else if (block.type === "tool_use") {
                assistantContent.push({
                  type: "tool_use",
                  id: block.id,
                  name: block.name,
                  input: block.input,
                });

                // Check if this is a write tool that needs approval
                if (isWriteTool(block.name)) {
                  controller.enqueue(
                    `data: ${JSON.stringify({
                      type: "tool_call_pending",
                      toolId: block.id,
                      toolName: block.name,
                      toolInput: block.input,
                    })}\n\n`,
                  );

                  // Execute write tool
                  const result = await executeTool(block.name as ToolName, block.input, orgId);
                  loopMessages.push({
                    role: "assistant",
                    content: assistantContent as any,
                  });
                  loopMessages.push({
                    role: "user",
                    content: [
                      {
                        type: "tool_result",
                        tool_use_id: block.id,
                        content: result,
                      },
                    ],
                  });
                  assistantContent.length = 0; // Clear for next iteration
                } else {
                  // Read-only tool, execute immediately
                  const result = await executeTool(block.name as ToolName, block.input, orgId);
                  controller.enqueue(
                    `data: ${JSON.stringify({
                      type: "tool_result",
                      toolName: block.name,
                      content: result,
                    })}\n\n`,
                  );

                  loopMessages.push({
                    role: "assistant",
                    content: assistantContent as any,
                  });
                  loopMessages.push({
                    role: "user",
                    content: [
                      {
                        type: "tool_result",
                        tool_use_id: block.id,
                        content: result,
                      },
                    ],
                  });
                  assistantContent.length = 0; // Clear for next iteration
                }
              }
            }

            // Add final assistant message if it had content
            if (assistantContent.length > 0) {
              loopMessages.push({
                role: "assistant",
                content: assistantContent as any,
              });
            }

            // Check stop reason
            continueLoop = response.stop_reason === "tool_use";
          }

          controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          controller.close();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(`data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
