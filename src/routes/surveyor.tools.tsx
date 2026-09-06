import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Calculator, Ruler, FileText, Compass, Layers, ScanLine } from "lucide-react";

export const Route = createFileRoute("/surveyor/tools")({
  head: () => ({ meta: [{ title: "Tools — TerraTrust AI" }] }),
  component: Page,
});

const tools = [
  {
    icon: Ruler,
    name: "Distance & area",
    desc: "Measure parcels on the map. Auto-converts to sqm, hectares, acres.",
    to: "/map",
  },
  {
    icon: Compass,
    name: "Bearing calculator",
    desc: "Compute bearings between corner markers from GPS readings.",
    to: "/map",
  },
  {
    icon: ScanLine,
    name: "GeoJSON validator",
    desc: "Lint and repair survey GeoJSON before submission.",
    to: "/properties/$id/boundary",
    params: { id: "p_001" },
  },
  {
    icon: Layers,
    name: "Overlay imagery",
    desc: "Drape Sentinel-2 / Maxar imagery beneath your parcel sketch.",
    to: "/properties/$id/gis-layers",
    params: { id: "p_001" },
  },
  {
    icon: Calculator,
    name: "Coord. converter",
    desc: "WGS84 ↔ UTM ↔ Local datum (Minna, Adindan, Clarke 1880).",
    to: "/map",
  },
  {
    icon: FileText,
    name: "Report builder",
    desc: "Generate signed PDF survey reports from field data.",
    to: "/reports/new",
  },
];

function Page() {
  return (
    <AppShell
      title="Surveyor toolkit"
      subtitle="Calibrated utilities for licensed field surveyors."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.name}
            to={t.to}
            params={t.params}
            className="surface-card flex flex-col gap-3 p-5 text-left transition hover:shadow-[var(--shadow-elev)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-lg">{t.name}</p>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
