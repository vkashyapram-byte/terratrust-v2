import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crumbs, Field, Stepper } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PropertyMap } from "@/components/ui-ext/PropertyMap";
import { demoBoundaryFeatures } from "@/lib/gis";
import { properties } from "@/lib/mock-data";
import { toast } from "sonner";
import { storageUnavailableMessage } from "@/lib/client-actions";

export const Route = createFileRoute("/properties/new")({
  head: () => ({ meta: [{ title: "Register property — TerraTrust AI" }] }),
  component: Page,
});

const steps = ["Basics", "Location", "Boundary", "Documents", "Review"];

function Page() {
  const [s, setS] = useState(0);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("540");
  const [address, setAddress] = useState("");
  const validateCurrentStep = () => {
    if (s === 0 && (!title.trim() || !Number.isFinite(Number(area)) || Number(area) <= 0)) {
      toast.error("Enter a property title and a valid area before continuing.");
      return false;
    }
    if (s === 1 && !address.trim()) {
      toast.error("Enter the property address before continuing.");
      return false;
    }
    return true;
  };
  const next = () => {
    if (validateCurrentStep()) setS((current) => Math.min(current + 1, steps.length - 1));
  };
  return (
    <AppShell
      title="Register a new property"
      subtitle="Open a Property Passport in under 5 minutes."
    >
      <Crumbs items={[{ label: "Properties", to: "/properties" }, { label: "New" }]} />
      <Stepper steps={steps} current={s} />
      <div className="surface-card p-6">
        {s === 0 && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Property title">
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Indiranagar Residence"
                  required
                />
              </Field>
              <Field label="Property type">
                <Input defaultValue="Residential" />
              </Field>
              <Field label="Area (sqm)">
                <Input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  inputMode="decimal"
                  required
                />
              </Field>
              <Field label="Estimated value (INR)">
                <Input defaultValue="280000" />
              </Field>
            </div>
            <Field label="Description">
              <Textarea rows={3} placeholder="Describe the property…" />
            </Field>
          </div>
        )}
        {s === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Country">
              <Input defaultValue="India" />
            </Field>
            <Field label="Region/State">
              <Input defaultValue="Karnataka" />
            </Field>
            <Field label="Address" hint="Full street address">
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="12 100 Feet Road, Indiranagar"
                required
              />
            </Field>
            <Field label="GPS coordinates">
              <Input defaultValue="12.9716, 77.5946" />
            </Field>
          </div>
        )}
        {s === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Click the map to add vertices or drag a vertex to refine the polygon. Saving a
              boundary requires the server-side property registry.
            </p>
            <PropertyMap
              propertyId="new-property"
              editable
              submittedBoundary={demoBoundaryFeatures(properties[0]).submittedBoundary}
              latitude={12.9716}
              longitude={77.5946}
              onSaveBoundary={() =>
                toast.error(
                  "Boundary persistence is unavailable until the authenticated property registry is configured.",
                )
              }
            />
            <Button variant="outline" onClick={() => toast.error(storageUnavailableMessage())}>
              Upload .geojson or .kml
            </Button>
          </div>
        )}
        {s === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload deed, survey plan, tax clearance, and ID.
            </p>
            <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              Drop files here or click to browse
            </div>
            <Link
              to="/properties/$id/documents"
              params={{ id: "p_001" }}
              className="text-xs text-primary"
            >
              Go to dedicated upload screen →
            </Link>
          </div>
        )}
        {s === 4 && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">
              You're about to mint Property Passport <span className="font-mono">TT-XXXX-LG</span>.
            </p>
            <p className="text-muted-foreground">
              TerraTrust AI will run OCR, boundary verification, and AI valuation, then route this
              to the registry queue.
            </p>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => setS(Math.max(0, s - 1))} disabled={s === 0}>
            Back
          </Button>
          {s < steps.length - 1 ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button disabled title="Requires the authenticated property registry service">
              Mint Passport requires registry connection
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
