import type { MigrationAsset } from "@/lib/types/migrations";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg"]);
const DOCUMENT_EXTENSIONS = new Set(["pdf", "doc", "docx"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "webm"]);

export function classifyAsset(filename: string): MigrationAsset["type"] {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (VIDEO_EXTENSIONS.has(extension)) return "video";
  if (DOCUMENT_EXTENSIONS.has(extension)) return "document";
  return "document";
}

export function summarizeAssets(assets: MigrationAsset[]) {
  return {
    total: assets.length,
    totalSizeKb: assets.reduce((sum, a) => sum + a.sizeKb, 0),
    byType: {
      image: assets.filter((a) => a.type === "image").length,
      document: assets.filter((a) => a.type === "document").length,
      video: assets.filter((a) => a.type === "video").length,
    },
  };
}
