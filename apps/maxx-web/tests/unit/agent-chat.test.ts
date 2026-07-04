import { describe, it, expect } from "vitest";
import { selectModel, isWriteTool, type ChatMessage } from "@/lib/agents/chat-router";

describe("Agent Chat Router", () => {
  describe("selectModel", () => {
    it("routes read-only queries to haiku", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Show me all active contacts" },
      ];
      expect(selectModel(messages)).toBe("haiku");
    });

    it("routes write queries to sonnet", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Create a new contact named John Doe" },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });

    it("routes 'create' intent to sonnet", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Create a new contact" },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });

    it("routes 'add' intent to sonnet", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Add a contact to the CRM" },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });

    it("routes 'delete' intent to sonnet", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Delete the contact named Jane" },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });

    it("routes 'move' intent to sonnet", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Move this deal to the next stage" },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });

    it("defaults to haiku for empty messages", () => {
      expect(selectModel([])).toBe("haiku");
    });

    it("scans last user message, not assistant messages", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Create a contact" },
        { role: "assistant", content: "I can do that" },
        { role: "user", content: "Show me contacts" },
      ];
      expect(selectModel(messages)).toBe("haiku");
    });

    it("handles messages with text blocks", () => {
      const messages: ChatMessage[] = [
        {
          role: "user",
          content: [{ type: "text", text: "Create a new contact" }],
        },
      ];
      expect(selectModel(messages)).toBe("sonnet");
    });
  });

  describe("isWriteTool", () => {
    it("identifies create_contact as write tool", () => {
      expect(isWriteTool("create_contact")).toBe(true);
    });

    it("identifies move_deal as write tool", () => {
      expect(isWriteTool("move_deal")).toBe(true);
    });

    it("identifies delete_contact as write tool", () => {
      expect(isWriteTool("delete_contact")).toBe(true);
    });

    it("identifies search_contacts as read tool", () => {
      expect(isWriteTool("search_contacts")).toBe(false);
    });

    it("identifies get_pipeline as read tool", () => {
      expect(isWriteTool("get_pipeline")).toBe(false);
    });
  });
});
