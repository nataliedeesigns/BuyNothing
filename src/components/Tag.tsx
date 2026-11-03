export type TagTone = "bright" | "warm" | "neutral" | "ink";

/** Non-interactive uppercase status label. */
export function Tag({ label, tone }: { label: string; tone: TagTone }) {
  return <span className={`tag tag--${tone} t-label-small`}>{label.toUpperCase()}</span>;
}
