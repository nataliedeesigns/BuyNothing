import type { ChatMessage } from "../data";

/** Incoming = card surface w/ border, left-aligned. Outgoing = ink fill, right-aligned. 4px tail corner. */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const outgoing = message.from === "me";
  return (
    <div className={`bubble-row ${outgoing ? "bubble-row--out" : "bubble-row--in"}`}>
      <p className={`bubble t-body ${outgoing ? "bubble--out" : "bubble--in"}`}>{message.text}</p>
      <p className="t-label-small muted">
        {message.time}
        {message.status ? ` · ${message.status}` : ""}
      </p>
    </div>
  );
}
