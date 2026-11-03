import { neighbors, type Giveaway } from "./data";
import type { TagTone } from "./components/Tag";

/** Status tag + meta line for a giveaway, shared by My Items and the giveaway screen. */
export function giveawayStatus(g: Giveaway): { tag: string; tone: TagTone; meta: string } {
  const n = g.interested.length;
  switch (g.status) {
    case "active":
      return {
        tag: `Active · ${n} interested`,
        tone: "bright",
        meta: n ? `${n} interested · ${g.method === "Tell your story" ? "choose" : "drawing"} by ${g.endsDay}` : `Posted · ends ${g.endsLabel}`,
      };
    case "pickup": {
      const r = g.recipientId ? neighbors[g.recipientId] : undefined;
      return { tag: `Pickup ${g.pickupDay ?? g.endsDay}`, tone: "warm", meta: `Recipient: ${r?.name ?? "—"} · pickup ${g.pickupDay ?? g.endsDay}` };
    }
    case "gifted":
      return { tag: "Gifted", tone: "neutral", meta: `${g.giftedLabel ?? "Gifted"} · ${g.method}` };
    case "ended":
      return { tag: "Ended", tone: "neutral", meta: "Ended early · no recipient" };
  }
}
