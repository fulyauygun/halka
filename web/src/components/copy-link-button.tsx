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
      className="mt-2 text-sm font-medium text-terracotta-dark hover:underline dark:text-gold-light"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
