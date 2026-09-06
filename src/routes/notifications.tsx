import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { notifications } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — TerraTrust AI" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, read: true })));
  return (
    <AppShell
      title="Notifications"
      subtitle="Updates from your portfolio, community, and government registries."
      actions={
        <Button
          variant="outline"
          className="rounded-full"
          onClick={markAllRead}
          disabled={items.every((item) => item.read)}
        >
          Mark all read
        </Button>
      }
    >
      <div className="surface-card divide-y divide-border">
        {items.map((n) => (
          <Link
            key={n.id}
            to="/properties/$id"
            params={{ id: n.id === "n3" ? "p_003" : "p_001" }}
            onClick={() =>
              setItems((current) =>
                current.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
              )
            }
            className={`flex items-start gap-4 p-5 transition hover:bg-muted/40 ${!n.read ? "bg-primary/[0.03]" : ""}`}
          >
            <span
              className={`mt-2 h-2 w-2 rounded-full ${n.kind === "success" ? "bg-success" : n.kind === "warning" ? "bg-warning" : n.kind === "alert" ? "bg-destructive" : "bg-primary"}`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.at}</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
