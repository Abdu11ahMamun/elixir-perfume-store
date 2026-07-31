export default function AdminModal({ title, description, onClose, closeDisabled, children, maxWidth = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gray-900/40" onClick={closeDisabled ? undefined : onClose} />

      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl`}>
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={closeDisabled ? undefined : onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
