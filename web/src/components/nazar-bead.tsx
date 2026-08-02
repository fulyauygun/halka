export function NazarBead({
  size = 28,
  className,
  spin = false,
}: {
  size?: number;
  className?: string;
  spin?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${spin ? "animate-spin" : ""} ${className ?? ""}`}
      style={spin ? { animationDuration: "1.6s" } : undefined}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill="#1c4f8c" />
      <circle cx="50" cy="50" r="40" fill="#f4ead2" />
      <circle cx="50" cy="50" r="32" fill="#0e93a0" />
      <circle cx="50" cy="50" r="22" fill="#f4ead2" />
      <circle cx="50" cy="50" r="14" fill="#0c2224" />
      <circle cx="45" cy="45" r="4" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}
