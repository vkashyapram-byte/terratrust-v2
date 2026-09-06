import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Field } from "@/components/ui-ext/Scaffold";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TerraTrust AI" },
      {
        name: "description",
        content:
          "Talk to TerraTrust about citizen onboarding, registry partnership, or institutional sales.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [submitting, setSubmitting] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !email || !message) return;
    setSubmitting(true);
    window.location.href = `mailto:hello@terratrust.ai?subject=${encodeURIComponent(`TerraTrust enquiry from ${name}`)}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
    window.setTimeout(() => setSubmitting(false), 300);
  };
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </p>
            <h1 className="font-display mt-2 text-5xl">Tell us about your land.</h1>
            <p className="mt-3 text-muted-foreground">
              Whether you have one parcel or a national registry, we want to talk.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> hello@terratrust.ai
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> +234 1 700 0044
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Bengaluru, Delhi, Mumbai
              </p>
            </div>
          </div>
          <form onSubmit={submit} className="surface-card grid gap-3 p-6">
            <Field label="Name">
              <Input name="name" placeholder="Your full name" required />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" placeholder="you@example.com" required />
            </Field>
            <Field label="Organisation (optional)">
              <Input name="organisation" placeholder="Bureau, bank, NGO…" />
            </Field>
            <Field label="How can we help?">
              <Textarea
                name="message"
                rows={5}
                placeholder="Briefly describe what you're after."
                required
              />
            </Field>
            <Button type="submit" disabled={submitting} className="mt-2 w-full">
              {submitting ? "Opening email client…" : "Send message"}
            </Button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
