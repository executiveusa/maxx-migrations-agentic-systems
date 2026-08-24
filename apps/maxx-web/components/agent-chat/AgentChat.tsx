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

      if (!response.ok) throw new Error("Popebot could not reach the business data right now");
      if (!response.body) throw new Error("Popebot returned no response");

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
          if (!line.startsWith("data: ")) continue;
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
                  if (lastMsg?.role === "assistant") lastMsg.content = assistantText;
                  else updated.push({ role: "assistant", content: event.content ?? "" });
                  return updated;
                });
                break;
              case "tool_call_pending":
                setPendingConfirmation({
                  toolId: event.toolId ?? "",
                  toolName: event.toolName ?? "",
                  toolInput: event.toolInput,
                });
                break;
              case "error":
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: event.error ?? "I couldn't complete that safely." },
                ]);
                break;
              default:
                break;
            }
          } catch {
            // Ignore malformed stream fragments and continue the readable response.
          }
        }
      }

      if (assistantText && !messages.some((m) => m.role === "assistant" && m.content === assistantText)) {
        setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Popebot is temporarily unavailable";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirmation = () => {
    setPendingConfirmation(null);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Cancelled. Nothing was changed." },
    ]);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-surface">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted">
            <div className="max-w-md text-center">
              <p className="mb-2 font-medium text-text">Ask Popebot about your business</p>
              <p className="text-sm">Use normal language. Ask what needs attention, what is moving, what is at risk, or what MAXX can safely handle next.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${msg.role === "user" ? "bg-accent text-white" : "bg-muted text-text"}`}>
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2 text-text">
              <p className="animate-pulse text-sm">Checking the business…</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Popebot…"
            disabled={loading}
            className="flex-1"
          />
          <ButtonEl disabled={loading || !input.trim()}>Ask</ButtonEl>
        </form>
      </div>

      <Dialog open={!!pendingConfirmation} onClose={() => setPendingConfirmation(null)} title="Your approval is needed">
        {pendingConfirmation && (
          <>
            <p className="mb-4 text-sm text-text">Popebot prepared this action but has not run it.</p>
            <div className="mb-6 rounded-xl bg-surface-2 p-4 text-sm text-muted">
              {pendingConfirmation.toolName.replace(/_/g, " ")}
            </div>
            <p className="mb-6 text-sm text-muted">Approval execution is still blocked server-side until the exact-action approval path is enabled. MAXX will not pretend an action ran.</p>
            <div className="flex justify-end gap-2">
              <ButtonEl variant="secondary" onClick={handleRejectConfirmation}>Cancel</ButtonEl>
              <ButtonEl disabled>Approve</ButtonEl>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
