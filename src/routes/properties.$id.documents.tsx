import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Crumbs, Pill } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ShieldCheck, AlertTriangle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { storageUnavailableMessage } from "@/lib/client-actions";

export const Route = createFileRoute("/properties/$id/documents")({
  head: () => ({ meta: [{ title: "Documents — TerraTrust AI" }] }),
  component: Page,
});

const docs = [
  {
    name: "Certificate of Occupancy.pdf",
    kind: "Deed",
    size: "2.4 MB",
    at: "2024-03-14",
    ocr: 99,
    verified: true,
  },
  {
    name: "Survey Plan 2023.pdf",
    kind: "Survey",
    size: "1.1 MB",
    at: "2023-11-02",
    ocr: 96,
    verified: true,
  },
  {
    name: "Tax Clearance 2024.pdf",
    kind: "Tax",
    size: "640 KB",
    at: "2024-08-19",
    ocr: 98,
    verified: true,
  },
  {
    name: "National ID.pdf",
    kind: "ID",
    size: "320 KB",
    at: "2024-03-12",
    ocr: 100,
    verified: true,
  },
];

function Page() {
  const { id } = Route.useParams();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const chooseFile = () => fileInput.current?.click();
  const handleFile = (file?: File) => {
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast.error("Choose a PDF, JPG, JPEG, or PNG document.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Documents must be 25 MB or smaller.");
      return;
    }
    setUploading(true);
    window.setTimeout(() => {
      setUploading(false);
      toast.error(storageUnavailableMessage());
    }, 250);
  };
  return (
    <AppShell
      title="Property documents"
      subtitle="Upload, verify, and manage records for this Property Passport."
      actions={
        <Button onClick={chooseFile} disabled={uploading}>
          <Upload className="h-4 w-4" /> {uploading ? "Checking file…" : "Upload document"}
        </Button>
      }
    >
      <Crumbs
        items={[
          { label: "Properties", to: "/properties" },
          { label: id, to: "/properties/$id" },
          { label: "Documents" },
        ]}
      />
      <input
        ref={fileInput}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <button
        type="button"
        onClick={chooseFile}
        className="surface-card grid h-48 w-full place-items-center rounded-xl border-2 border-dashed border-border bg-muted/20 text-center transition hover:border-primary/50 hover:bg-primary/[0.03]"
      >
        <div>
          <p className="text-sm font-medium">Choose a document to validate</p>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG up to 25MB · persistent uploads require configured Supabase Storage
          </p>
        </div>
      </button>
      <div className="mt-6 space-y-2">
        {docs.map((d) => (
          <div key={d.name} className="surface-card flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.kind} · {d.size} · Uploaded {d.at}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Pill tone={d.ocr > 95 ? "success" : "warning"}>OCR {d.ocr}%</Pill>
              {d.verified ? (
                <Pill tone="success">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </Pill>
              ) : (
                <Pill tone="warning">
                  <AlertTriangle className="h-3 w-3" /> Pending
                </Pill>
              )}
              <Link to="/properties/$id" params={{ id }} className="text-xs text-primary">
                View passport
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
