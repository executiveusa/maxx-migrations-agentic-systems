/**
 * Chat message routing — determines which Claude model to use based on message intent.
 * Simple heuristic: scan for write keywords to decide between Haiku (reads) and Sonnet (writes).
 */

export type ChatMessage = {
  role: "user" | "assistant";
  content: string | Array<{ type: string; text?: string; name?: string; input?: unknown; id?: string }>;
};

export function selectModel(messages: ChatMessage[]): "haiku" | "sonnet" {
  if (!messages || messages.length === 0) {
    return "haiku";
  }

  // Check the last user message for write intent
  const lastUserMessage = messages
    .slice()
    .reverse()
    .find((m) => m.role === "user");

  if (!lastUserMessage) {
    return "haiku";
  }

  // Extract text from message
  let text = "";
  if (typeof lastUserMessage.content === "string") {
    text = lastUserMessage.content;
  } else if (Array.isArray(lastUserMessage.content)) {
    text = lastUserMessage.content
      .filter((block) => typeof block === "object" && "text" in block)
      .map((block) => (block as { text?: string }).text ?? "")
      .join(" ");
  }

  // Write intent keywords
  const writeKeywords = [
    "create",
    "add",
    "new",
    "make",
    "write",
    "update",
    "move",
    "delete",
    "remove",
    "edit",
    "modify",
    "change",
    "save",
    "draft",
  ];

  const lowerText = text.toLowerCase();
  const isWrite = writeKeywords.some((keyword) => lowerText.includes(keyword));

  return isWrite ? "sonnet" : "haiku";
}

/**
 * Determine if a tool call is a write operation requiring user confirmation.
 */
export function isWriteTool(toolName: string): boolean {
  const writeTools = ["create_contact", "move_deal", "delete_contact"];
  return writeTools.includes(toolName);
}
