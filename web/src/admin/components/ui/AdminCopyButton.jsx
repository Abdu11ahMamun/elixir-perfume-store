import { useCopy } from "../../utils/clipboard";

/**
 * Small copy-to-clipboard button with a transient "Copied" indicator.
 * Reused anywhere a value (order number, phone, address, summary…) should
 * be copyable without turning the surrounding view into an editable field.
 */
export default function AdminCopyButton({ value, label = "Copy", copiedLabel = "Copied", className = "" }) {
  const { copy, copiedKey } = useCopy();
  const isCopied = copiedKey === value;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      disabled={!value}
      className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-500 transition duration-150 hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {isCopied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copiedLabel}
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2.5 8.5V2.5a1 1 0 011-1H8.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
