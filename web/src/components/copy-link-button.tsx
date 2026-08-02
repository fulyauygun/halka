"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="mt-2 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
    >
      {copied ? "Kopyalandı!" : "Linki kopyala"}
    </button>
  );
}
