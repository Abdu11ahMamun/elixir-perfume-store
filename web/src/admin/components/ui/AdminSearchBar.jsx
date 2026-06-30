export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold-dark)]">
        ⌕
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-full
          border
          border-[var(--gold)]/20
          bg-white
          py-3
          pl-11
          pr-5
          text-sm
          outline-none
          transition
          placeholder:text-[var(--mist)]/60
          focus:border-[var(--gold)]
          focus:shadow-[0_12px_40px_rgba(201,169,110,0.12)]
        "
      />
    </div>
  );
}