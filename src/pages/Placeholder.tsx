import { ButtonLink } from "../components/Button";
import { RootTopBar } from "../components/TopBar";

/** Screens not covered by the designs yet. */
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <RootTopBar />
      <main className="m-page narrow-page placeholder">
        <h1 className="t-display-l">{title}</h1>
        <p className="t-body muted">This screen hasn’t been designed yet.</p>
        <ButtonLink to="/" variant="secondary">
          Back to Browse
        </ButtonLink>
      </main>
    </>
  );
}
