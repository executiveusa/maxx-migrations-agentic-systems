"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { ButtonEl } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import type { ChatMessage } from "@/lib/agents/chat-router";

interface StreamEvent {
  type: string;
  content?: string;
  toolId?: string;
  toolName?: string;
  toolInput?: unknown;
  error?: string;
}

interface ConfirmationPending {
  toolId: string;
  toolName: string;
  toolInput: unknown;
}

export function AgentChat() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationPending | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Build message history for the API
      const chatMessages: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      chatMessages.push({ role: "user", content: userMessage });

      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      let assistantText = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

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

              switch (event.type) {
                case "text":
                  assistantText += event.content ?? "";
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg?.role === "assistant") {
                      lastMsg.content = assistantText;
                    } else {
                      updated.push({ role: "assistant", content: event.content ?? "" });
                    }
                    return updated;
                  });
                  break;

                case "tool_call_pending":
                  // Show confirmation modal
                  setPendingConfirmation({
                    toolId: event.toolId ?? "",
                    toolName: event.toolName ?? "",
                    toolInput: event.toolInput,
                  });
                  break;

                case "tool_result":
                  // Tool result received, continue
                  break;

                case "error":
                  setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: `Error: ${event.error ?? "Unknown error"}` },
                  ]);
                  break;

                case "done":
                  // Stream complete
                  break;
              }
            } catch (e) {
              // Parse error, skip
            }
          }
        }
      }

      if (assistantText && !messages.some((m) => m.role === "assistant" && m.content === assistantText)) {
        setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to send message";
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveConfirmation = () => {
    // In a real implementation, this would send an approval to the backend
    // For now, we'll just close the dialog and let the agent continue
    setPendingConfirmation(null);
  };

  const handleRejectConfirmation = () => {
    setPendingConfirmation(null);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "I've cancelled that operation as requested." },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-lg border border-border">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted">
            <div className="text-center">
              <p className="font-medium mb-2">Start a conversation</p>
              <p className="text-sm">Ask me to search contacts, view your pipeline, or manage deals.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                  msg.role === "user" ? "bg-accent text-white" : "bg-muted text-text"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-text rounded-lg px-4 py-2">
              <p className="text-sm animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={loading}
            className="flex-1"
          />
          <ButtonEl disabled={loading || !input.trim()}>Send</ButtonEl>
        </form>
      </div>

      {/* Confirmation modal */}
      <Dialog
        open={!!pendingConfirmation}
        onClose={() => setPendingConfirmation(null)}
        title="Confirm Action"
      >
        {pendingConfirmation && (
          <>
            <p className="text-sm text-muted mb-6">
              {`Do you want to ${pendingConfirmation.toolName.replace(/_/g, " ")}?`}
            </p>
            <div className="flex gap-2 justify-end">
              <ButtonEl
                variant="secondary"
                onClick={handleRejectConfirmation}
              >
                Cancel
              </ButtonEl>
              <ButtonEl onClick={handleApproveConfirmation}>Approve</ButtonEl>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
