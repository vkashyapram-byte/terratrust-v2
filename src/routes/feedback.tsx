import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Field } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Feedback — TerraTrust AI" }] }),
  component: Page,
});

function Page() {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const working = String(form.get("working") ?? "").trim();
    const needsWork = String(form.get("needsWork") ?? "").trim();
    if (!rating || (!working && !needsWork)) return;
    setSubmitting(true);
    window.location.href = `mailto:feedback@terratrust.ai?subject=${encodeURIComponent(`TerraTrust feedback (${rating}/5)`)}&body=${encodeURIComponent(`What's working:\n${working}\n\nWhat needs work:\n${needsWork}\n\nWishlist:\n${String(form.get("wishlist") ?? "")}`)}`;
    window.setTimeout(() => setSubmitting(false), 300);
  };
  return (
    <AppShell
      title="Send feedback"
      subtitle="What's working, what isn't, and what we should build next."
    >
      <form onSubmit={submit} className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-2">
          <p className="text-sm">How would you rate TerraTrust today?</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                aria-label={`Rate ${i + 1} stars`}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Star
                  className={`h-5 w-5 ${i < rating ? "fill-warning-foreground text-warning-foreground" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <Field label="What's working">
          <Textarea name="working" rows={4} placeholder="Tell us what you love" />
        </Field>
        <Field label="What needs work">
          <Textarea name="needsWork" rows={4} placeholder="Where do we fall short?" />
        </Field>
        <Field label="Feature wishlist">
          <Input name="wishlist" placeholder="One feature that would change everything" />
        </Field>
        <Field label="Email (optional)">
          <Input placeholder="if you'd like a reply" />
        </Field>
        <div className="md:col-span-2 flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard">Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting || rating === 0}>
            {submitting ? "Opening email client…" : "Send feedback"}
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
