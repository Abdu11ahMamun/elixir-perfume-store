export default function Eyebrow({ children, light = false, className = "" }) {
  return (
    <span
      className={`eyebrow ${className}`}
      style={{
        color: light ? "var(--gold)" : "var(--gold)",
      }}
    >
      {children}
    </span>
  );
}