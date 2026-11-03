interface IconProps {
  src: string;
  size?: number;
  className?: string;
}

/** Decorative icon exported from Figma. Pair with visible text or an aria-label on the parent. */
export function Icon({ src, size = 20, className }: IconProps) {
  return <img src={src} width={size} height={size} alt="" aria-hidden="true" className={`icon ${className ?? ""}`} />;
}
