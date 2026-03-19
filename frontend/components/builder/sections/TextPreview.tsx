"use client";

interface Props {
  data: Record<string, unknown>;
}

export function TextPreview({ data }: Props) {
  const content = (data.content as string) || "Add your text here...";

  return (
    <div className="px-5 py-4">
      <p className="text-gray-700 dark:text-white/70 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
