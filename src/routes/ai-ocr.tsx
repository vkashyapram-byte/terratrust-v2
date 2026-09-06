import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AIBadge, ConfidenceMeter, AIInsightCard, ReasoningTrace, VerdictBanner } from "@/components/ai/AIPrimitives";
import { SectionTitle, Pill } from "@/components/ui-ext/Scaffold";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { ocrFields, recommendationsForDoc } from "@/lib/ai-mock";

export const Route = createFileRoute("/ai-ocr")({
  head: () => ({ meta: [{ title: "AI Document OCR — TerraTrust AI" }] }),
  component: OCRPage,
});

function OCRPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState("Certificate of Occupancy.pdf");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState("Ready for a document upload.");

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  const handleFile = (file?: File) => {
    if (!file) return;
    setSelectedFile(file.name);
    setUploadMessage(`Queued ${file.name} for OCR extraction.`);
  };

  return (
    <AppShell
      title="Document OCR & Extraction"
      subtitle="Pull structured fields out of any title document — verified line by line."
      actions={<>
        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={event => handleFile(event.target.files?.[0])} />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Upload</Button>
      </>}
    >
      <div className="grid gap-4 md:grid-cols-4">
        <AIInsightCard title="Fields extracted" value="8 / 8" hint="Open source document" tone="success" onClick={() => jumpTo("ocr-source")} />
        <AIInsightCard title="Avg. confidence" value="94%" delta={{ value: 3, label: "vs prior scan" }} hint="Review confidence" tone="primary" onClick={() => jumpTo("ocr-confidence")} />
        <AIInsightCard title="Verification" value="Auto-pass" hint="View cross-checks" tone="success" onClick={() => jumpTo("ocr-cross-checks")} />
        <AIInsightCard title="Time to extract" value="1.2s" hint="View pipeline" tone="accent" onClick={() => jumpTo("ocr-pipeline")} />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <span className="font-medium text-foreground">{selectedFile}</span>
        <span>· {uploadMessage}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_440px]">
        <div id="ocr-source" className="surface-card p-6">
          <SectionTitle eyebrow="Source · page 2" title={selectedFile} action={<AIBadge>OCR v3.1</AIBadge>} />
          <div className="relative overflow-hidden rounded-xl border border-border bg-[oklch(0.985_0.005_95)] p-6">
            <div className="absolute right-4 top-4"><Pill tone="success"><CheckCircle2 className="h-3 w-3" /> Stamped & valid</Pill></div>
            <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Lagos State Land Bureau</p>
            <p className="mt-1 text-center font-display text-2xl">Certificate of Occupancy</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">Ref. LSLB-2024-00831</p>
            <div className="mt-6 space-y-3 text-sm">
              {ocrFields.map((f, i) => (
                <button key={i} type="button" onClick={() => { setSelectedField(f.label); jumpTo("ocr-confidence"); }} className={`group relative block w-full rounded-md bg-surface p-2.5 text-left ring-1 transition hover:ring-primary/50 ${selectedField === f.label ? "ring-2 ring-primary" : "ring-primary/15"}`}>
                  <div className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-primary/40" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</p>
                  <p className="font-medium text-foreground">{f.value}</p>
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-[10px] text-muted-foreground">— end of extracted region —</p>
          </div>
        </div>

        <div className="space-y-6">
          <VerdictBanner verdict="trusted" headline="All 8 fields extracted & cross-validated." detail="Stamp matches issuance window. NIN, BVN and bureau ref. align with registry." />
          <div id="ocr-confidence" className="surface-card p-5">
            <SectionTitle eyebrow="Per-field confidence" title="Extraction quality" />
            <div className="space-y-3">
              {ocrFields.map((f, i) => (
                <div key={i} className={selectedField === f.label ? "rounded-lg bg-primary/5 p-2 ring-1 ring-primary/30" : "p-2"}>
                  <ConfidenceMeter value={f.confidence} label={f.label} hint={f.value} />
                </div>
              ))}
            </div>
          </div>
          <div id="ocr-cross-checks" className="surface-card p-5">
            <SectionTitle eyebrow="Cross-checks" title="What the model verified" />
            <ul className="space-y-2 text-sm">
              {recommendationsForDoc.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> {r}</li>
              ))}
            </ul>
          </div>
          <div id="ocr-pipeline" className="surface-card p-5">
            <SectionTitle eyebrow="Pipeline" title="OCR reasoning trace" />
            <ReasoningTrace steps={[
              { label: "Document fingerprint", detail: "Hash matches Bureau template v2024." },
              { label: "Layout detection", detail: "Identified 4 regions: header, body, stamp, signature." },
              { label: "Field-level OCR", detail: "Tesseract + LayoutLMv3 ensemble · 99.1% char accuracy." },
              { label: "Schema validation", detail: "All 8 fields conform to expected types." },
              { label: "Registry cross-check", detail: "Bureau ref. LSLB-2024-00831 confirmed valid." },
            ]} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
