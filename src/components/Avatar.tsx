/** Circular neighbor photo. Always paired with a visible name, so it is decorative. */
export function Avatar({ src, size = "m" }: { src: string; size?: "s" | "m" }) {
  return <img src={src} alt="" className={`avatar avatar--${size}`} />;
}
