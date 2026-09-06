import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crumbs, Field } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/support/new")({
  head: () => ({ meta: [{ title: "New ticket — TerraTrust AI" }] }),
  component: Page,
});

function Page() {
  const [submitting, setSubmitting] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = String(form.get("subject") ?? "").trim();
    const details = String(form.get("details") ?? "").trim();
    if (!subject || !details) return;
    setSubmitting(true);
    window.location.href = `mailto:support@terratrust.ai?subject=${encodeURIComponent(`[Support] ${subject}`)}&body=${encodeURIComponent(details)}`;
    window.setTimeout(() => setSubmitting(false), 300);
  };
  return (
    <AppShell title="Open a support ticket" subtitle="We typically reply within 90 minutes.">
      <Crumbs items={[{ label: "Support", to: "/support" }, { label: "New" }]} />
      <form onSubmit={submit} className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <Field label="Subject">
          <Input name="subject" placeholder="Brief summary" required />
        </Field>
        <Field label="Category">
          <Input defaultValue="Documents" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Describe the issue">
            <Textarea
              name="details"
              rows={6}
              placeholder="What were you trying to do? What happened instead?"
              required
            />
          </Field>
        </div>
        <Field label="Property (optional)">
          <Input placeholder="TT-8421-LG" />
        </Field>
        <Field label="Priority">
          <Input defaultValue="Medium" />
        </Field>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Link to="/support">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Opening email client…" : "Submit ticket"}
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
