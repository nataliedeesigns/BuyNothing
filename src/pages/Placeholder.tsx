import { ButtonLink } from "../components/Button";

/** Screens not covered by the desktop designs yet. */
export function Placeholder({ title }: { title: string }) {
  return (
    <main className="placeholder">
      <h1 className="t-display-l">{title}</h1>
      <p className="t-body muted">This screen hasn’t been designed for desktop yet.</p>
      <ButtonLink to="/" variant="secondary">
        Back to Browse
      </ButtonLink>
    </main>
  );
}
