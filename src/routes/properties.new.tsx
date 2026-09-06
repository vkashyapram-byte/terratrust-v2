import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crumbs, Field, Stepper } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const Route = createFileRoute("/properties/new")({
  head: () => ({ meta: [{ title: "Register property — TerraTrust AI" }] }),
  component: Page,
});

const steps = ["Basics", "Location", "Boundary", "Documents", "Review"];

function Page() {
  const [s, setS] = useState(0);
  return (
    <AppShell title="Register a new property" subtitle="Open a Property Passport in under 5 minutes.">
      <Crumbs items={[{ label: "Properties", to: "/properties" }, { label: "New" }]} />
      <Stepper steps={steps} current={s} />
      <div className="surface-card p-6">
        {s === 0 && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Property title"><Input placeholder="e.g. Indiranagar Residence" /></Field>
              <Field label="Property type"><Input defaultValue="Residential" /></Field>
              <Field label="Area (sqm)"><Input defaultValue="540" /></Field>
              <Field label="Estimated value (INR)"><Input defaultValue="280000" /></Field>
            </div>
            <Field label="Description"><Textarea rows={3} placeholder="Describe the property…" /></Field>
          </div>
        )}
        {s === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Country"><Input defaultValue="India" /></Field>
            <Field label="Region/State"><Input defaultValue="Karnataka" /></Field>
            <Field label="Address" hint="Full street address"><Input defaultValue="12 100 Feet Road, Indiranagar" /></Field>
            <Field label="GPS coordinates"><Input defaultValue="12.9716, 77.5946" /></Field>
          </div>
        )}
        {s === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Drag the polygon points on the map, or upload a GIS file.</p>
            <div className="grid h-64 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-sm text-muted-foreground">[ Interactive boundary editor ]</div>
            <Button variant="outline">Upload .geojson or .kml</Button>
          </div>
        )}
        {s === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Upload deed, survey plan, tax clearance, and ID.</p>
            <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">Drop files here or click to browse</div>
            <Link to="/properties/$id/documents" params={{ id: "p_001" }} className="text-xs text-primary">Go to dedicated upload screen →</Link>
          </div>
        )}
        {s === 4 && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">You're about to mint Property Passport <span className="font-mono">TT-XXXX-LG</span>.</p>
            <p className="text-muted-foreground">TerraTrust AI will run OCR, boundary verification, and AI valuation, then route this to the registry queue.</p>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => setS(Math.max(0, s - 1))} disabled={s === 0}>Back</Button>
          {s < steps.length - 1 ? <Button onClick={() => setS(s + 1)}>Continue</Button> : <Link to="/properties"><Button>Mint Passport</Button></Link>}
        </div>
      </div>
    </AppShell>
  );
}
