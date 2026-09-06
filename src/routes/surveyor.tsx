import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { Button } from "@/components/ui/button";
import { surveyorKpis, properties } from "@/lib/mock-data";
import { MapPin, Calendar, ChevronRight, Briefcase } from "lucide-react";

export const Route = createFileRoute("/surveyor")({
  head: () => ({ meta: [{ title: "Surveyor — TerraTrust AI" }] }),
  component: () => (
    <AppShell
      title="Surveyor workspace"
      subtitle="Assignments, boundary captures, and quality scoring."
      actions={
        <Button asChild className="rounded-full">
          <Link to="/surveyor/assignments">
            <Briefcase className="h-4 w-4" /> View assignments
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {surveyorKpis.map((k) => (
          <StatCard key={k.label} kpi={k} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <p className="font-medium">Upcoming field work</p>
          <ul className="mt-4 divide-y divide-border">
            {properties.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                to="/properties/$id/boundary"
                params={{ id: p.id }}
                className="flex items-center justify-between py-3 hover:text-primary"
              >
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {p.region} · <Calendar className="h-3 w-3" /> in {i + 1} day{i ? "s" : ""}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </ul>
        </div>
        <div className="surface-card p-5">
          <p className="font-medium">Boundary captures awaiting review</p>
          <ul className="mt-4 space-y-3">
            {["S-2238", "S-2240", "S-2241"].map((id) => (
              <li
                key={id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <span>{id} · boundary capture awaiting review</span>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/surveyor/assignments/$id" params={{ id }}>
                    Review
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  ),
});
