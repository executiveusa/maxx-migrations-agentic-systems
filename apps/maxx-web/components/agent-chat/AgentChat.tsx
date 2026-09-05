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
  proposalId?: string;
  actionHash?: string;
  expiresAt?: string | null;
  error?: string;
}

interface ConfirmationPending {
  toolId: string;
  toolName: string;
  toolInput: unknown;
  proposalId: string;
  actionHash: string;
  expiresAt?: string | null;
}

export function AgentChat() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationPending | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const chatMessages: ChatMessage[] = messages.map((m) => ({ role: m.role, content: m.content }));
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
      let buffered = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        buffered += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const lines = buffered.split("\n");
        buffered = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)) as StreamEvent;
            if (event.type === "text") {
              assistantText += event.content ?? "";
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg?.role === "assistant") lastMsg.content = assistantText;
                else updated.push({ role: "assistant", content: event.content ?? "" });
                return updated;
              });
            } else if (event.type === "tool_call_pending") {
              if (!event.proposalId || !event.actionHash) throw new Error("Popebot did not return persisted approval proof.");
              setPendingConfirmation({
                toolId: event.toolId ?? "",
                toolName: event.toolName ?? "",
                toolInput: event.toolInput,
                proposalId: event.proposalId,
                actionHash: event.actionHash,
                expiresAt: event.expiresAt,
              });
            } else if (event.type === "error") {
              setMessages((prev) => [...prev, { role: "assistant", content: event.error ?? "I couldn't complete that safely." }]);
            }
          } catch {
            // A malformed SSE fragment must never cause a write or erase persisted approval state.
          }
        }
        if (done) break;
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: error instanceof Error ? error.message : "Popebot is temporarily unavailable" }]);
    } finally {
      setLoading(false);
    }
  };

  async function decide(decision: "approve" | "reject") {
    if (!pendingConfirmation || decisionLoading) return;
    setDecisionLoading(true);
    try {
      const response = await fetch(`/api/agent/proposals/${encodeURIComponent(pendingConfirmation.proposalId)}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const payload = (await response.json()) as { status?: string; toolName?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The approval decision could not be completed safely.");
      const message = decision === "reject"
        ? "Cancelled. The rejection was recorded and nothing was changed."
        : payload.status === "executed"
          ? `${(payload.toolName ?? pendingConfirmation.toolName).replace(/_/g, " ")} completed after exact approval revalidation.`
          : `The approved action finished with status: ${payload.status ?? "unknown"}.`;
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      setPendingConfirmation(null);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: error instanceof Error ? error.message : "Approval failed safely." }]);
    } finally {
      setDecisionLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-surface">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted">
            <div className="max-w-md text-center">
              <p className="mb-2 font-medium text-text">Ask Popebot about your business</p>
              <p className="text-sm">Ask what needs attention, what revenue is verified, what was recovered, or what MAXX can safely handle next.</p>
            </div>
          </div>
        ) : messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${msg.role === "user" ? "bg-accent text-white" : "bg-muted text-text"}`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="rounded-lg bg-muted px-4 py-2 text-text"><p className="animate-pulse text-sm">Checking the business…</p></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Popebot…" disabled={loading} className="flex-1" />
          <ButtonEl disabled={loading || !input.trim()}>Ask</ButtonEl>
        </form>
      </div>

      <Dialog open={!!pendingConfirmation} onClose={() => !decisionLoading && setPendingConfirmation(null)} title="Your approval is needed">
        {pendingConfirmation && (
          <>
            <p className="mb-4 text-sm text-text">Popebot prepared and persisted this exact action. It has not run yet.</p>
            <div className="mb-3 rounded-xl bg-surface-2 p-4 text-sm text-text">
              <p className="font-medium">{pendingConfirmation.toolName.replace(/_/g, " ")}</p>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-muted">{JSON.stringify(pendingConfirmation.toolInput, null, 2)}</pre>
            </div>
            <p className="mb-6 break-all text-xs text-muted">Approval proof: {pendingConfirmation.actionHash.slice(0, 16)}…</p>
            <div className="flex justify-end gap-2">
              <ButtonEl variant="secondary" disabled={decisionLoading} onClick={() => void decide("reject")}>Reject</ButtonEl>
              <ButtonEl disabled={decisionLoading} onClick={() => void decide("approve")}>{decisionLoading ? "Checking…" : "Approve"}</ButtonEl>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
