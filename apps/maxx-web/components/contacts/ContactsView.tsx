"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonEl, Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { Table, Thead, Th, Tbody, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { contactSchema, contactStatuses, type ContactInput } from "@/lib/validation/contact";
import type { Contact, ContactStatus } from "@/lib/types/contacts";

export function ContactsView({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const { pushToast } = useToast();

  const allTags = useMemo(() => Array.from(new Set(contacts.flatMap((c) => c.tags))), [contacts]);

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      search.trim() === "" ||
      `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesTag = tagFilter === "all" || c.tags.includes(tagFilter);
    return matchesSearch && matchesStatus && matchesTag;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      tags: [],
      status: "lead",
      source: "manual",
    },
  });

  function openCreateDialog() {
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      tags: [],
      status: "lead",
      source: "manual",
    });
    setCreateOpen(true);
  }

  async function onCreate(data: ContactInput) {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      pushToast("Could not create contact. Check the form and try again.", "error");
      return;
    }
    const created = await res.json();
    setContacts((prev) => [created.contact as Contact, ...prev]);
    pushToast(`${data.firstName} ${data.lastName} added to Contacts.`, "success");
    reset();
    setCreateOpen(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Contacts"
        description="Every lead, donor, and volunteer your organization has ever talked to, in one place."
        actions={<ButtonEl onClick={openCreateDialog}>Add contact</ButtonEl>}
      />

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <Field label="Search" className="min-w-[240px] flex-1">
          <Input
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field label="Status" className="w-48">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContactStatus | "all")}>
            <option value="all">All statuses</option>
            {contactStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tag" className="w-48">
          <Select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="all">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No contacts match these filters"
          description="Try clearing your search or filters, or add a new contact."
          action={<ButtonEl onClick={openCreateDialog}>Add contact</ButtonEl>}
        />
      ) : (
        <Table>
          <Thead>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Tags</Th>
            <Th>Source</Th>
          </Thead>
          <Tbody>
            {filtered.map((contact) => (
              <tr
                key={contact.id}
                className="cursor-pointer hover:bg-surface-2"
                onClick={() => setDetailContact(contact)}
              >
                <Td className="font-medium">{contact.firstName} {contact.lastName}</Td>
                <Td>{contact.email}</Td>
                <Td><StatusPill status={contact.status === "lead" ? "pending" : contact.status === "archived" ? "inactive" : "active"} /></Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </Td>
                <Td className="text-muted">{contact.source.replace(/_/g, " ")}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Add contact">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <Input {...register("firstName")} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input {...register("lastName")} />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Field label="Phone (optional)">
            <Input type="tel" {...register("phone")} />
          </Field>
          <Field label="Status">
            <Select {...register("status")} defaultValue="lead">
              {contactStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <ButtonEl type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding…" : "Add contact"}
          </ButtonEl>
        </form>
      </Dialog>

      <Dialog
        open={detailContact !== null}
        onClose={() => setDetailContact(null)}
        title={detailContact ? `${detailContact.firstName} ${detailContact.lastName}` : ""}
      >
        {detailContact && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <p><span className="text-muted">Email:</span> {detailContact.email}</p>
              <p><span className="text-muted">Phone:</span> {detailContact.phone ?? "—"}</p>
              <p><span className="text-muted">Status:</span> {detailContact.status}</p>
              <p><span className="text-muted">Source:</span> {detailContact.source.replace(/_/g, " ")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text">Notes</h4>
              {detailContact.notes.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No notes yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {detailContact.notes.map((note) => (
                    <li key={note.id} className="rounded-lg border border-border p-3 text-sm">
                      <p className="text-text">{note.body}</p>
                      <p className="mt-1 text-xs text-muted">{note.authorName}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-text">Timeline</h4>
              {detailContact.timeline.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No activity recorded yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {detailContact.timeline.map((event) => (
                    <li key={event.id} className="text-sm text-muted">
                      <span className="text-text">{event.summary}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button href={`/app/pipeline?contact=${detailContact.id}`} variant="secondary">
              View in pipeline
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
}
