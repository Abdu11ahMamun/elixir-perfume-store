export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) {
  const classes =
    variant === "ghost"
      ? "btn-ghost"
      : variant === "ghost-light"
      ? "btn-ghost-light"
      : "btn-primary";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${classes}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}