const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium " +
  "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 whitespace-nowrap";

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5",
  lg: "px-5 py-3",
};

const variants = {
  primary:
    "bg-[var(--gold)] text-[#1a1408] hover:brightness-95 shadow-sm focus-visible:ring-[#c9a96e]/40",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#c9a96e]/50 hover:text-[var(--gold-dark)] focus-visible:ring-gray-300",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-300",
  "danger-solid":
    "bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-400",
  ghost:
    "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300",
  outline:
    "bg-white text-gray-600 border border-gray-200 hover:border-[#c9a96e]/50 hover:text-[var(--gold-dark)] focus-visible:ring-gray-300",
};

export default function AdminButton({
  as = "button",
  variant = "secondary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) {
  const Comp = as;
  return (
    <Comp
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.secondary} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
      )}
      {children}
    </Comp>
  );
}
