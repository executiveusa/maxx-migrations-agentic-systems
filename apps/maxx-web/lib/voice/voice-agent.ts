/**
 * Voice Agent - SSE stream parser for /api/agent/chat
 *
 * Accumulates text chunks from streaming SSE events and returns
 * the complete agent response.
 */

export interface StreamEvent {
  type: string;
  content?: string;
  toolId?: string;
  toolName?: string;
  toolInput?: unknown;
  error?: string;
}

/**
 * Parse SSE stream from /api/agent/chat endpoint
 * @param response - Fetch Response object with SSE stream body
 * @returns Promise resolving to complete assistant text response
 */
export async function parseVoiceAgentStream(response: Response): Promise<string> {
  if (!response.body) {
    throw new Error("No response body");
  }

  let assistantText = "";
  let pendingApprovalText = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const json = line.slice(6);
          if (json === "[DONE]") continue;

          try {
            const event = JSON.parse(json) as StreamEvent;

            // Accumulate text chunks
            if (event.type === "text" && event.content) {
              assistantText += event.content;
            }

            if (event.type === "tool_call_pending") {
              const action = event.toolName?.replaceAll("_", " ") ?? "requested action";
              pendingApprovalText = `The ${action} action is ready, but it needs your approval before I can continue.`;
            }

            // Stop on stream complete or error
            if (event.type === "done" || event.type === "error") {
              break;
            }
          } catch {
            // Parse error, skip this line
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!assistantText && pendingApprovalText) {
    return pendingApprovalText;
  }

  if (!assistantText) {
    throw new Error("No response from agent");
  }

  return assistantText;
}

/**
 * Check if a string is an abort command ("stop" or "cancel")
 */
export function isAbortCommand(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return normalized === "stop" || normalized === "cancel";
}
