import { describe, it, expect, beforeEach, vi } from "vitest";
import { parseVoiceAgentStream, isAbortCommand } from "@/lib/voice/voice-agent";

describe("Voice Agent", () => {
  describe("isAbortCommand", () => {
    it("detects 'stop' as abort command", () => {
      expect(isAbortCommand("stop")).toBe(true);
    });

    it("detects 'cancel' as abort command", () => {
      expect(isAbortCommand("cancel")).toBe(true);
    });

    it("detects 'stop' case-insensitively", () => {
      expect(isAbortCommand("STOP")).toBe(true);
      expect(isAbortCommand("Stop")).toBe(true);
      expect(isAbortCommand("sToP")).toBe(true);
    });

    it("detects 'cancel' case-insensitively", () => {
      expect(isAbortCommand("CANCEL")).toBe(true);
      expect(isAbortCommand("Cancel")).toBe(true);
      expect(isAbortCommand("cAnCeL")).toBe(true);
    });

    it("ignores whitespace around abort commands", () => {
      expect(isAbortCommand("  stop  ")).toBe(true);
      expect(isAbortCommand("\n cancel \t")).toBe(true);
    });

    it("rejects non-abort commands", () => {
      expect(isAbortCommand("start")).toBe(false);
      expect(isAbortCommand("hello")).toBe(false);
      expect(isAbortCommand("")).toBe(false);
      expect(isAbortCommand("stopping")).toBe(false);
    });

    it("rejects partial matches", () => {
      expect(isAbortCommand("stop now")).toBe(false);
      expect(isAbortCommand("please cancel")).toBe(false);
    });
  });

  describe("parseVoiceAgentStream", () => {
    it("parses single text event", async () => {
      const sseText = `data: ${JSON.stringify({ type: "text", content: "Hello world" })}\ndata: ${JSON.stringify({ type: "done" })}\n\n`;
      const mockStream = createMockStream(sseText);
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("Hello world");
    });

    it("accumulates multiple text chunks", async () => {
      const sseText = [
        `data: ${JSON.stringify({ type: "text", content: "Hello " })}`,
        `data: ${JSON.stringify({ type: "text", content: "world" })}`,
        `data: ${JSON.stringify({ type: "done" })}`,
      ].join("\n");

      const mockStream = createMockStream(sseText + "\n\n");
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("Hello world");
    });

    it("ignores tool_call_pending and tool_result events", async () => {
      const sseText = [
        `data: ${JSON.stringify({ type: "text", content: "I'll create a contact" })}`,
        `data: ${JSON.stringify({ type: "tool_call_pending", toolName: "create_contact" })}`,
        `data: ${JSON.stringify({ type: "tool_result", toolName: "create_contact" })}`,
        `data: ${JSON.stringify({ type: "text", content: " named John" })}`,
        `data: ${JSON.stringify({ type: "done" })}`,
      ].join("\n");

      const mockStream = createMockStream(sseText + "\n\n");
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("I'll create a contact named John");
    });

    it("throws error when response has no body", async () => {
      const response = { body: null } as Response;

      await expect(parseVoiceAgentStream(response)).rejects.toThrow("No response body");
    });

    it("throws error when no text content in stream", async () => {
      const sseText = `data: ${JSON.stringify({ type: "done" })}\n\n`;
      const mockStream = createMockStream(sseText);
      const response = { body: mockStream } as Response;

      await expect(parseVoiceAgentStream(response)).rejects.toThrow("No response from agent");
    });

    it("skips invalid JSON lines", async () => {
      const sseText = [
        `data: ${JSON.stringify({ type: "text", content: "First " })}`,
        `data: invalid json {]`,
        `data: ${JSON.stringify({ type: "text", content: "second" })}`,
        `data: ${JSON.stringify({ type: "done" })}`,
      ].join("\n");

      const mockStream = createMockStream(sseText + "\n\n");
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("First second");
    });

    it("skips [DONE] marker", async () => {
      const sseText = [
        `data: ${JSON.stringify({ type: "text", content: "Hello" })}`,
        `data: [DONE]`,
        `data: ${JSON.stringify({ type: "text", content: " World" })}`,
        `data: ${JSON.stringify({ type: "done" })}`,
      ].join("\n");

      const mockStream = createMockStream(sseText + "\n\n");
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("Hello World");
    });

    it("stops on error event", async () => {
      const sseText = [
        `data: ${JSON.stringify({ type: "text", content: "Partial " })}`,
        `data: ${JSON.stringify({ type: "error", error: "Something went wrong" })}`,
      ].join("\n");

      const mockStream = createMockStream(sseText + "\n\n");
      const response = { body: mockStream } as Response;

      const result = await parseVoiceAgentStream(response);
      expect(result).toBe("Partial ");
    });
  });
});

/**
 * Mock ReadableStream for testing
 */
function createMockStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let isRead = false;

  return new ReadableStream({
    start(controller) {
      // Simulate streaming by breaking text into chunks
      const chunks = text.split("\n").map((line) => encoder.encode(line + "\n"));

      Promise.resolve().then(async () => {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
          // Small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
        controller.close();
      });
    },
  });
}
