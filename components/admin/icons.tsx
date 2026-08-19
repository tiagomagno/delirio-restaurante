type IconProps = { size?: number }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconGrid({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function IconImage({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="M21 15.5l-5.5-5.5-9.5 9.5" />
    </svg>
  )
}

export function IconStore({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 9.5 5.2 4h13.6L20 9.5" />
      <path d="M4 9.5a2.3 2.3 0 0 0 4.4 1 2.3 2.3 0 0 0 4.4 0 2.3 2.3 0 0 0 4.4 0 2.3 2.3 0 0 0 4.4-1" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  )
}

export function IconPages({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 15.8h6M9 9.2h2.5" />
    </svg>
  )
}

export function IconClipboard({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="6" y="4.5" width="12" height="16" rx="2" />
      <rect x="9" y="3" width="6" height="3" rx="1" />
      <path d="M9 11.5h6M9 15h6M9 8.2h2.5" />
    </svg>
  )
}

export function IconMail({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  )
}

export function IconLogout({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
      <path d="M14 16l4-4-4-4" />
      <path d="M18 12H9" />
    </svg>
  )
}

export function IconChevronDown({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function IconPlus({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconTrash({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 7h16" />
      <path d="M9 7V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V7" />
      <path d="M6 7l.9 12.1A1.6 1.6 0 0 0 8.5 20.5h7A1.6 1.6 0 0 0 17.1 19.1L18 7" />
    </svg>
  )
}

export function IconArrowUp({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 19V6M6 11l6-6 6 6" />
    </svg>
  )
}

export function IconArrowDown({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 5v13M6 13l6 6 6-6" />
    </svg>
  )
}

export function IconCheck({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function IconUpload({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  )
}

export function IconEdit({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M14.5 4.5l5 5L8 21H3v-5z" />
    </svg>
  )
}

export function IconEye({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export function IconEyeOff({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.6A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.2 13.2 0 0 1-3.3 4M6.5 7.6C4.2 9.2 2.5 12 2.5 12S6 18.5 12 18.5a9.7 9.7 0 0 0 3.5-.7" />
      <path d="M9.9 10a2.6 2.6 0 0 0 3.7 3.6" />
    </svg>
  )
}
