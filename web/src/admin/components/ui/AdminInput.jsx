const fieldBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition duration-150 " +
  "placeholder:text-gray-400 focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20";

function FieldWrap({ label, required, error, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </label>
  );
}

export function AdminField({ label, value, onChange, placeholder, type = "text", required, error, autoComplete }) {
  return (
    <FieldWrap label={label} required={required} error={error}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`${fieldBase} ${error ? "border-red-300" : "border-gray-300"}`}
      />
    </FieldWrap>
  );
}

export function AdminTextArea({ label, value, onChange, placeholder, rows = 4, error, required }) {
  return (
    <FieldWrap label={label} required={required} error={error}>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${fieldBase} resize-none ${error ? "border-red-300" : "border-gray-300"}`}
      />
    </FieldWrap>
  );
}

export function AdminSelectField({ label, value, onChange, options, error, required, disabled }) {
  return (
    <FieldWrap label={label} required={required} error={error}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${fieldBase} ${error ? "border-red-300" : "border-gray-300"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {options.map((o) => (typeof o === "object" ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o}>{o}</option>))}
      </select>
    </FieldWrap>
  );
}

// ─── Standalone filter select (pill-free, standard combobox) ──
export function AdminSelect({ value, onChange, options, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${fieldBase} border-gray-300 ${className}`}
    >
      {options.map((o) => (typeof o === "object" ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o}>{o}</option>))}
    </select>
  );
}

export function AdminToggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        value ? "bg-[var(--gold)]" : "bg-gray-200"
      }`}
    >
      <span
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: value ? "calc(100% - 1.25rem)" : "4px" }}
      />
    </button>
  );
}

export function AdminToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
      </div>
      <AdminToggle value={value} onChange={onChange} />
    </div>
  );
}
