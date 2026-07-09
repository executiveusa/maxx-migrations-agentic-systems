"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ButtonEl } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import type { CallEvent, MctbRule, MissedCallEvent, PhoneNumber, SmsOptOut, SmsTemplate } from "@/lib/types/telephony";

const statusPillMap: Record<string, "connected" | "pending" | "setup_required" | "failed"> = {
  sent: "connected",
  opted_out: "pending",
  not_configured: "setup_required",
  failed: "failed",
};

export function MissedCallsView({
  callEvents,
  missedCallEvents,
  phoneNumbers,
  rules: initialRules,
  templates,
  optOuts,
  twilioConfigured,
}: {
  callEvents: CallEvent[];
  missedCallEvents: MissedCallEvent[];
  phoneNumbers: PhoneNumber[];
  rules: MctbRule[];
  templates: SmsTemplate[];
  optOuts: SmsOptOut[];
  twilioConfigured: boolean;
}) {
  const [rules, setRules] = useState(initialRules);
  const [templateDrafts, setTemplateDrafts] = useState(templates);
  const { pushToast } = useToast();
  const phoneConfigured = phoneNumbers.length > 0 && twilioConfigured;

  async function toggleRule(ruleId: string) {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;
    const res = await fetch("/api/missed-calls/text-back", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruleId, active: !rule.active }),
    });
    const body = await res.json();
    if (!res.ok) {
      pushToast(body.error ?? "Could not update rule.", "error");
      return;
    }
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r)));
    pushToast(body.message ?? "Rule updated.", "success");
  }

  function updateTemplate(id: string, body: string) {
    setTemplateDrafts((prev) => prev.map((t) => (t.id === id ? { ...t, body } : t)));
  }

  return (
    <>
      <PageHeader
        eyebrow="Telephony"
        title="Missed Call Text Back"
        description="Every missed call can trigger an automatic text within seconds — configured to respect opt-outs."
      />

      {!phoneConfigured && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-text">
            <strong>Twilio setup required.</strong> Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER
            in Settings → Integrations to enable live text-back sending. Rules and templates can still be configured now.
          </p>
        </Card>
      )}

      <Tabs
        items={[
          {
            id: "calls",
            label: "Missed calls",
            content: (
              <Table>
                <Thead>
                  <Th>From</Th>
                  <Th>Occurred</Th>
                  <Th>Text-back status</Th>
                </Thead>
                <Tbody>
                  {missedCallEvents.map((event) => (
                    <tr key={event.id}>
                      <Td>{event.fromNumber}</Td>
                      <Td className="text-muted">{new Date(event.occurredAt).toLocaleString()}</Td>
                      <Td><StatusPill status={statusPillMap[event.textBackStatus] ?? "pending"} /></Td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            ),
          },
          {
            id: "rules",
            label: "Text-back rules",
            content: (
              <div className="max-w-xl space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{rule.name}</p>
                      <p className="text-xs text-muted">Delay: {rule.delaySeconds}s · Template: {templates.find((t) => t.id === rule.templateId)?.name}</p>
                    </div>
                    <ButtonEl size="sm" variant={rule.active ? "danger" : "primary"} onClick={() => toggleRule(rule.id)}>
                      {rule.active ? "Disable" : "Enable"}
                    </ButtonEl>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "templates",
            label: "Templates",
            content: (
              <div className="max-w-xl space-y-4">
                {templateDrafts.map((template) => (
                  <Card key={template.id}>
                    <Field label={template.name}>
                      <Textarea
                        value={template.body}
                        maxLength={320}
                        onChange={(e) => updateTemplate(template.id, e.target.value)}
                      />
                    </Field>
                    <p className="mt-1 text-xs text-muted">Variables: {"{{organizationName}}"}, {"{{bookingLink}}"}</p>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "optouts",
            label: `Opt-outs (${optOuts.length})`,
            content: (
              <Table>
                <Thead>
                  <Th>Phone number</Th>
                  <Th>Opted out</Th>
                </Thead>
                <Tbody>
                  {optOuts.map((optOut) => (
                    <tr key={optOut.id}>
                      <Td>{optOut.phoneNumber}</Td>
                      <Td className="text-muted">{new Date(optOut.optedOutAt).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </Tbody>
              </Table>
            ),
          },
          {
            id: "log",
            label: "Webhook event log",
            content: (
              <div className="max-w-2xl space-y-2">
                {callEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border px-4 py-2.5 text-sm">
                    <span className="text-text">{event.direction} call {event.status}</span>{" "}
                    <span className="text-muted">from {event.fromNumber} · {new Date(event.occurredAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />

      <Card className="mt-8 max-w-2xl border-border/60 bg-surface/60">
        <p className="text-xs text-muted">
          Compliance: Missed Call Text Back only sends when MCTB is enabled for this organization, a phone
          number is configured, and the recipient has not opted out. Every attempt — sent or blocked — is
          logged. Replying STOP immediately and permanently opts a number out.
        </p>
      </Card>
    </>
  );
}
