import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccessControl } from "@/lib/access-control";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({ meta: [{ title: "Complete profile — TerraTrust AI" }] }),
  component: CompleteProfile,
});

function CompleteProfile() {
  const navigate = useNavigate();
  const { role } = useAccessControl();
  const destination =
    role === "officer"
      ? "/government"
      : role === "admin"
        ? "/admin"
        : role === "surveyor"
          ? "/surveyor"
          : role === "bank"
            ? "/bank"
            : role === "verifier"
              ? "/attestations"
              : "/dashboard";
  return (
    <AuthLayout
      title="Complete your profile"
      subtitle="A few details so authorities can verify you against records."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: destination });
        }}
        className="grid gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>Country</Label>
            <Select defaultValue="ng">
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Region / State</Label>
            <Input className="h-11" defaultValue="Karnataka" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Government ID number</Label>
          <Input className="h-11" placeholder="Aadhaar / PAN / etc." />
        </div>
        <div className="grid gap-2">
          <Label>Phone</Label>
          <Input className="h-11" placeholder="+91 ..." />
        </div>
        <div className="grid gap-2">
          <Label>Short bio (optional)</Label>
          <Textarea rows={3} placeholder="A few words about you" />
        </div>
        <Button className="h-11">Enter the platform</Button>
      </form>
    </AuthLayout>
  );
}
