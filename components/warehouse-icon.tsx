interface WarehouseIconProps {
  size?: number;
  className?: string;
}

export function WarehouseIcon({ size = 24, className }: WarehouseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* Base/ground */}
      <path
        d="M32 56L4 40V24L32 8L60 24V40L32 56Z"
        fill="currentColor"
        opacity="0.15"
      />
      {/* Roof */}
      <path
        d="M32 8L4 24L32 40L60 24L32 8Z"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Left wall */}
      <path
        d="M4 24V40L32 56V40L4 24Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Right wall */}
      <path
        d="M60 24V40L32 56V40L60 24Z"
        fill="currentColor"
        opacity="0.35"
      />
      {/* Door */}
      <path
        d="M24 44V36L32 40V48L24 44Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M40 44V36L32 40V48L40 44Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Roof ridge */}
      <path
        d="M32 8L32 40"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Outline */}
      <path
        d="M32 8L4 24V40L32 56L60 40V24L32 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Roof line */}
      <path
        d="M4 24L32 40L60 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Windows (dots) */}
      <circle cx="18" cy="33" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="25" cy="36.5" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="46" cy="33" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="39" cy="36.5" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
