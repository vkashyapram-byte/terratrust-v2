import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — TerraTrust AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get a free Property Passport for your land in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.error(
            "Account registration is unavailable until Supabase Auth is configured for this deployment.",
          );
        }}
        className="grid gap-4"
      >
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() =>
            toast.error(
              "Google sign-up is unavailable: this build has no configured authentication provider.",
            )
          }
        >
          Continue with Google
        </Button>
        <div className="relative my-1 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="bg-background px-2 relative z-10">or with email</span>
          <span className="absolute left-0 top-1/2 h-px w-full bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label>First name</Label>
            <Input className="h-11" required />
          </div>
          <div className="grid gap-2">
            <Label>Last name</Label>
            <Input className="h-11" required />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input type="email" className="h-11" required />
        </div>
        <div className="grid gap-2">
          <Label>Password</Label>
          <Input type="password" className="h-11" minLength={8} required />
        </div>
        <Button type="submit" className="h-11">
          Continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms and Privacy.
        </p>
      </form>
    </AuthLayout>
  );
}
