import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  FileBadge,
  Sparkles,
  Users2,
  Briefcase,
  Building2,
  BarChart3,
  ShieldCheck,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  MessageSquare,
  FileText,
  Gavel,
  ShieldAlert,
  Banknote,
  LifeBuoy,
  Brain,
  ScanLine,
  Activity,
  Compass,
  ListChecks,
  Lightbulb,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { notifications } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canAccessPath, useAccessControl, ROLE_PROFILES } from "@/lib/access-control";
import { canAccessNavItem } from "@/lib/navAccessConfig";

const nav = [
  {
    group: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/properties", label: "Properties", icon: FileBadge },
      { to: "/map", label: "GIS Map", icon: Map },
      { to: "/valuation", label: "AI Valuation", icon: Sparkles },
      { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
      { to: "/search", label: "Search", icon: Search },
    ],
  },
  {
    group: "AI Intelligence",
    items: [
      { to: "/ai", label: "AI Overview", icon: Brain },
      { to: "/ai-passport", label: "AI Passport", icon: FileBadge },
      { to: "/ai-valuation", label: "Valuation engine", icon: Sparkles },
      { to: "/ai-ocr", label: "Document OCR", icon: FileText },
      { to: "/ai-fraud", label: "Fraud detection", icon: ShieldAlert },
      { to: "/ai-risk", label: "Risk analysis", icon: Activity },
      { to: "/ai-confidence", label: "Confidence score", icon: ShieldCheck },
      { to: "/ai-boundary", label: "Boundary detection", icon: Compass },
      { to: "/ai-timeline", label: "Ownership timeline", icon: ListChecks },
      { to: "/ai-recommendations", label: "Recommendations", icon: Lightbulb },
      { to: "/ai-summary", label: "Document summary", icon: FileText },
      { to: "/ai-suggestions", label: "Verification AI", icon: Sparkles },
    ],
  },
  {
    group: "Trust",
    items: [
      { to: "/verification", label: "Verification", icon: Users2 },
      { to: "/community", label: "Community", icon: Users2 },
      { to: "/fraud", label: "Fraud detection", icon: ShieldAlert },
      { to: "/disputes", label: "Disputes", icon: Gavel },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/impact", label: "Impact", icon: Sparkles },
    ],
  },
  {
    group: "Roles",
    items: [
      { to: "/surveyor", label: "Surveyor", icon: Briefcase },
      { to: "/government", label: "Government", icon: Building2 },
      { to: "/bank", label: "Bank", icon: Banknote },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/admin", label: "Admin", icon: ShieldCheck },
    ],
  },

  {
    group: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: User },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/support", label: "Support", icon: LifeBuoy },
      { to: "/help", label: "Help center", icon: HelpCircle },
    ],
  },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { role, setRole, signOut, profile } = useAccessControl();
  const unread = notifications.filter((n) => !n.read).length;
  const canAccess = canAccessPath(role, pathname);
  const [searchTerm, setSearchTerm] = useState("");
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate({ to: "/search", search: { q: searchTerm.trim() } });
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-[260px_1fr] bg-background">
      <aside className="sticky top-0 h-screen border-r border-border bg-surface-elevated">
        <div className="flex h-16 items-center px-5">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex h-[calc(100vh-4rem-3.5rem)] flex-col gap-6 overflow-y-auto px-3 py-3">
          {nav
            .map((group) => {
              // Filter items by both nav access matrix AND role-workspace guards
              const visibleItems = group.items.filter(
                (item) => canAccessNavItem(role, item.to) && canAccessPath(role, item.to),
              );
              // Hide entire group if no items are visible for this role
              if (visibleItems.length === 0) return null;
              return (
                <div key={group.group}>
                  <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.group}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {visibleItems.map((item) => {
                      const active =
                        pathname === item.to ||
                        (item.to !== "/dashboard" && pathname.startsWith(item.to));
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                            active
                              ? "bg-primary/8 text-foreground ring-1 ring-primary/15"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              active
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                          {item.to === "/notifications" && unread > 0 && (
                            <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                              {unread}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/login"
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-8 backdrop-blur-xl">
          <form onSubmit={search} className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-9 pl-9"
              placeholder="Search properties, passport IDs, regions…"
              aria-label="Search properties"
            />
          </form>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/notifications" className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1 pr-3 transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {profile.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <p className="text-xs font-medium leading-tight">{profile.name}</p>
                    <p className="text-[10px] capitalize text-muted-foreground">{role}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5 hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-foreground">{profile.name}</p>
                    <p className="text-[11px] text-muted-foreground">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-2 py-1">
                    Switch Account / Role
                  </DropdownMenuLabel>
                  {(["citizen", "surveyor", "officer", "verifier", "bank", "admin"] as const).map((r) => {
                    const item = ROLE_PROFILES[r];
                    const isCurrent = role === r;
                    return (
                      <DropdownMenuItem
                        key={r}
                        onClick={() => {
                          setRole(r);
                          toast.success(`Switched to ${item.name} (${item.roleLabel})`);
                        }}
                        className="flex items-center justify-between cursor-pointer px-2 py-1.5"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-medium truncate">{item.roleLabel}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{item.email}</p>
                        </div>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile" className="flex items-center gap-2 text-xs">
                    <User className="h-3.5 w-3.5" /> View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate({ to: "/login" });
                  }}
                  className="flex items-center gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="border-b border-border bg-background px-8 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl text-foreground">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
        </div>

        <main className="min-w-0 flex-1 px-8 py-8">
          {canAccess ? children : <AccessDenied role={role} />}
        </main>
      </div>
    </div>
  );
}

function AccessDenied({ role }: { role: string }) {
  return (
    <div className="surface-card mx-auto max-w-xl p-8 text-center">
      <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
      <h2 className="font-display mt-4 text-3xl text-foreground">Workspace restricted</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Your current {role} account does not have access to this workspace. Switch to an authorized
        account to continue.
      </p>
      <Link
        to="/login"
        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Switch account
      </Link>
    </div>
  );
}

export function StatusBadge({ status }: { status: "verified" | "pending" | "disputed" | "draft" }) {
  const map = {
    verified: { label: "Verified", cls: "bg-success/10 text-success ring-success/20" },
    pending: { label: "Pending", cls: "bg-warning/15 text-warning-foreground ring-warning/30" },
    disputed: { label: "Disputed", cls: "bg-destructive/10 text-destructive ring-destructive/30" },
    draft: { label: "Draft", cls: "bg-muted text-muted-foreground ring-border" },
  } as const;
  return (
    <Badge variant="outline" className={cn("rounded-full ring-1", map[status].cls)}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {map[status].label}
    </Badge>
  );
}
