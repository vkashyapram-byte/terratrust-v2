import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crumbs, Field } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail, Banknote, Building2 } from "lucide-react";
import { copyToClipboard } from "@/lib/client-actions";
import { toast } from "sonner";

export const Route = createFileRoute("/properties/$id/share")({
  head: () => ({ meta: [{ title: "Share — TerraTrust AI" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const shareUrl = `https://terratrust.ai/p/${id}/v/9F2A-1C7B`;
  return (
    <AppShell
      title="Share Property Passport"
      subtitle="Issue a verifiable share link or send to a specific institution."
    >
      <Crumbs
        items={[
          { label: "Properties", to: "/properties" },
          { label: id, to: "/properties/$id" },
          { label: "Share" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card space-y-3 p-6">
          <p className="font-display text-lg">Verifiable share link</p>
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} aria-label="Property Passport share link" />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(shareUrl, "Share link")}
              aria-label="Copy share link"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Field label="Expires after">
            <Input defaultValue="7 days" />
          </Field>
          <Field label="Access">
            <Input defaultValue="View-only · masks personal data" />
          </Field>
        </div>
        <div className="surface-card space-y-3 p-6">
          <p className="font-display text-lg">Send to institution</p>
          {[
            { icon: Banknote, name: "HDFC Bank — Mortgage" },
            { icon: Building2, name: "Bengaluru Land Records" },
            { icon: Mail, name: "Custom email" },
          ].map((o) => (
            <button
              key={o.name}
              type="button"
              onClick={() =>
                toast.error(
                  "Institutional sharing requires the authenticated property-passport shares service, which is not configured in this build.",
                )
              }
              className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:bg-muted"
            >
              <o.icon className="h-4 w-4 text-primary" />
              {o.name}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
