import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui-ext/Scaffold";
import { ThumbsUp, ThumbsDown, MapPin, Users2 } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — TerraTrust AI" }] }),
  component: Page,
});

const items = [
  {
    passport: "TT-7188-LG",
    title: "Koramangala Family Compound",
    region: "Bengaluru",
    neighbours: 7,
    attestations: 5,
    owner: "B. Patel",
    years: 22,
  },
  {
    passport: "TT-5610-OY",
    title: "Kothrud Mixed-use Plot",
    region: "Pune",
    neighbours: 9,
    attestations: 6,
    owner: "C. Iyer",
    years: 14,
  },
  {
    passport: "TT-4422-PUN",
    title: "Mulshi Farmstead",
    region: "Pune",
    neighbours: 5,
    attestations: 3,
    owner: "M. Joshi",
    years: 31,
  },
  {
    passport: "TT-9981-HYD",
    title: "Hitech City Townhouse",
    region: "Hyderabad",
    neighbours: 8,
    attestations: 7,
    owner: "K. Reddy",
    years: 9,
  },
];

function Page() {
  const [attestedPassports, setAttestedPassports] = useState<string[]>([]);

  const attest = (passport: string) => {
    setAttestedPassports((submitted) => [...submitted, passport]);
  };

  return (
    <AppShell
      title="Community verification"
      subtitle="Strengthen trust by attesting to properties in your neighborhood."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const attested = attestedPassports.includes(p.passport);
          return (
            <div key={p.passport} className="surface-card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">
                    {p.passport}
                  </p>
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.region}
                  </p>
                </div>
                <Pill tone="info">
                  {p.attestations + Number(attested)}/{p.neighbours}
                </Pill>
              </div>
              <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Owner <span className="font-medium text-foreground">{p.owner}</span> has occupied
                this parcel for ~{p.years} years. Do you recognise them as the lawful occupant?
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => attest(p.passport)}
                  disabled={attested}
                >
                  <ThumbsUp className="h-4 w-4" /> {attested ? "Attested" : "Yes, attest"}
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/disputes/new">
                    <ThumbsDown className="h-4 w-4" /> Dispute
                  </Link>
                </Button>
              </div>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users2 className="h-3 w-3" /> {p.neighbours} neighbours invited
              </p>
              {attested && (
                <p
                  className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-foreground"
                  role="status"
                >
                  Your attestation is marked for this session. Connect the authenticated community
                  workflow to submit it permanently.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
