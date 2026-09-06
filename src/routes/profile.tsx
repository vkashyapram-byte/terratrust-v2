import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccessControl, type ProfileDetails } from "@/lib/access-control";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — TerraTrust AI" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { role, profile, updateProfile } = useAccessControl();
  const [draft, setDraft] = useState<ProfileDetails>(profile);
  const [saved, setSaved] = useState(false);
  const unavailable = () =>
    toast.error(
      "Profile updates require the authenticated profiles service, which is not configured in this build.",
    );
  return (
    <AppShell title="Profile" subtitle="Your identity, verification status, and contact info.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="surface-card flex flex-col items-center p-6 text-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl text-primary-foreground">
              AO
            </AvatarFallback>
          </Avatar>
          <p className="mt-4 font-display text-2xl">{profile.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {role} · {profile.region}
          </p>
          <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs text-success">
            <ShieldCheck className="h-3 w-3" /> Identity verified
          </div>
          <Button variant="outline" size="sm" className="mt-6 w-full" onClick={unavailable}>
            Change photo
          </Button>
        </div>
        <div className="surface-card p-6">
          <p className="font-medium">Account information</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateProfile(draft);
              setSaved(true);
              toast.success("Profile changes updated for this session.");
            }}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            <div className="grid gap-2">
              <Label>Full name</Label>
              <Input
                value={draft.name}
                onChange={(event) => {
                  setDraft({ ...draft, name: event.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={draft.email}
                onChange={(event) => {
                  setDraft({ ...draft, email: event.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                value={draft.phone}
                onChange={(event) => {
                  setDraft({ ...draft, phone: event.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Region</Label>
              <Input
                value={draft.region}
                onChange={(event) => {
                  setDraft({ ...draft, region: event.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Bio</Label>
              <Textarea
                rows={3}
                value={draft.bio}
                onChange={(event) => {
                  setDraft({ ...draft, bio: event.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save changes</Button>
            </div>
            {saved && (
              <p
                className="md:col-span-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-foreground"
                role="status"
              >
                Changes are reflected in this session. Configure the authenticated profile workflow
                to save them permanently.
              </p>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
