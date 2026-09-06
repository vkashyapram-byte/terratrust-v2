import { toast } from "sonner";

/** Browser-only actions shared by pages that can operate without a backend. */
export async function copyToClipboard(value: string, label = "Link") {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard.`);
  } catch {
    toast.error(`Couldn't copy the ${label.toLowerCase()}. Please copy it manually.`);
  }
}

export function downloadTextFile(contents: string, filename: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * The current repository intentionally has no Supabase client or storage API.
 * Keep write operations unavailable until the authenticated server integration
 * is installed instead of pretending uploaded data has been persisted.
 */
export function storageUnavailableMessage() {
  return "Document storage is unavailable in this build. Configure the authenticated Supabase storage integration before uploading files.";
}
