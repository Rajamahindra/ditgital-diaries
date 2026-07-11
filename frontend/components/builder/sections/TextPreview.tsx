"use client";

import { useBuilderStore } from "@/lib/store";
import { InlineBio } from "./InlineEditHelpers";

interface Props { data: Record<string, unknown>; sectionId?: string; }

export function TextPreview({ data, sectionId }: Props) {
  const { updateSection, selectedSectionId } = useBuilderStore();
  const id = sectionId ?? selectedSectionId ?? "";
  const update = (key: string, v: unknown) => { if (id) updateSection(id, { [key]: v }); };
  const content = (data.content as string) || "";

  return (
    <div className="px-5 py-4">
      <InlineBio
        value={content}
        placeholder="Click to add text..."
        onChange={(v) => update("content", v)}
        style={{ color: "inherit", fontSize: "0.875rem", lineHeight: 1.6 }}
        className="text-gray-700 dark:text-white/70"
      />
    </div>
  );
}
