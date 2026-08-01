import { useCallback, useRef, useState } from "react";

async function writeToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts / browsers without the Clipboard API.
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Copy-to-clipboard with a transient "copied" indicator.
 * `copiedKey` lets multiple copy buttons on the same page each know
 * whether THEY are the one that was just copied.
 */
export function useCopy(resetDelay = 1500) {
  const [copiedKey, setCopiedKey] = useState(null);
  const timerRef = useRef(null);

  const copy = useCallback(async (text, key = text) => {
    if (!text) return;
    try {
      await writeToClipboard(String(text));
      setCopiedKey(key);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedKey(null), resetDelay);
    } catch {
      // Clipboard access denied/unavailable — silently no-op.
    }
  }, [resetDelay]);

  return { copy, copiedKey };
}
