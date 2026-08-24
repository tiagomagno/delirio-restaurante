'use client'

export default function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <div className="admin-switch-field">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`admin-switch${checked ? ' admin-switch--on' : ''}`}
        onClick={() => onChange(!checked)}
        disabled={disabled}
      >
        <span className="admin-switch__thumb" />
      </button>
      <span className="admin-switch-field__label">{label}</span>
    </div>
  )
}
