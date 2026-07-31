import AdminButton from "./AdminButton";

export default function AdminEmptyState({
  icon = "◈",
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-400">
        {icon}
      </span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {actionLabel && onAction && (
        <AdminButton variant="primary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </AdminButton>
      )}
    </div>
  );
}
