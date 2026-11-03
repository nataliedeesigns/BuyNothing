import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { icons } from "../assets";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { InterestedRow } from "../components/InterestedRow";
import { Tag } from "../components/Tag";
import { BackTopBar } from "../components/TopBar";
import { neighbors, type Giveaway as GiveawayT, type Method } from "../data";
import { giveawayStatus } from "../giveawayLabels";
import { useGiving } from "../state/giving";
import { useMessages } from "../state/messages";

const PREVIEW = 2;

/** M4 · Item details — Giver (choose recipient). */
export function Giveaway() {
  const { id = "" } = useParams();
  const { giveaways } = useGiving();
  const g = giveaways.find((x) => x.id === id);
  if (!g) return <Navigate to="/my-items" replace />;
  return <GiveawayFor key={g.id} g={g} />;
}

function GiveawayFor({ g }: { g: GiveawayT }) {
  const { update } = useGiving();
  const { start } = useMessages();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>(g.method);
  const [showAll, setShowAll] = useState(false);
  const [chosen, setChosen] = useState<{ id: string; how: "story" | "random" } | null>(null);

  const status = giveawayStatus(g);
  const isActive = g.status === "active";
  const n = g.interested.length;
  const list = showAll ? g.interested : g.interested.slice(0, PREVIEW);
  const recipient = g.recipientId ? neighbors[g.recipientId] : undefined;
  const headerTag = isActive ? `Active · ends ${g.endsLabel}` : status.tag;

  const changeMethod = (m: Method) => {
    setMethod(m);
    update(g.id, { method: m });
  };

  const pickRandom = () => {
    const pick = g.interested[Math.floor(Math.random() * n)];
    setChosen({ id: pick.neighborId, how: "random" });
  };

  const confirm = () => {
    if (!chosen) return;
    const r = neighbors[chosen.id];
    update(g.id, { status: "pickup", recipientId: r.id, pickupDay: g.endsDay });
    const convoId = start({
      neighborId: r.id,
      kind: "Giving",
      itemTitle: g.title,
      itemImage: g.photos[0],
      itemHref: `/giving/${g.id}`,
      contextLine: `You’re giving · Pickup ${g.endsDay}`,
      statusTag: `Pickup ${g.endsDay}`,
      systemNote: chosen.how === "random" ? `${r.firstName} was picked at random` : `You chose ${r.firstName}`,
      firstMessage: `Hi ${r.firstName}! You were picked for the ${g.title.toLowerCase()} 🎉 When works for pickup?`,
    });
    navigate(`/messages/${convoId}`, { replace: true });
  };

  const endEarly = () => {
    if (window.confirm(`End the giveaway for “${g.title}”? Interested neighbors will be told it’s no longer available.`)) {
      update(g.id, { status: "ended" });
      navigate("/my-items");
    }
  };

  return (
    <>
      <BackTopBar title="Your giveaway" fallback="/my-items" />
      <main className="m-page narrow-page giveaway">
        <div className="giveaway__summary">
          {g.photos[0] ? <img src={g.photos[0]} alt="" className="giveaway__thumb" /> : <span className="giveaway__thumb" />}
          <div className="giveaway__summary-text">
            <h2 className="t-headline-s">{g.title}</h2>
            <Tag label={headerTag} tone={status.tone} />
          </div>
        </div>

        <dl className="stats">
          <div className="stat">
            <dd className="t-headline-m">{n}</dd>
            <dt className="t-label-small muted">Interested</dt>
          </div>
          <div className="stat">
            <dd className="t-headline-m">{isActive ? `${g.daysLeft}d` : "—"}</dd>
            <dt className="t-label-small muted">Left</dt>
          </div>
          <div className="stat">
            <dd className="t-headline-m">{g.views}</dd>
            <dt className="t-label-small muted">Views</dt>
          </div>
        </dl>

        {!isActive && (
          <div className="explainer">
            <p className="t-body-small">
              {g.status === "pickup" && recipient
                ? `${recipient.name} is your recipient · pickup ${g.pickupDay}.`
                : g.status === "gifted"
                  ? `${g.giftedLabel ?? "Gifted"} — thank you for giving!`
                  : "This giveaway was ended early."}
            </p>
          </div>
        )}

        {isActive && (
          <>
            <fieldset className="filter-group">
              <legend className="t-label">How you’re choosing</legend>
              <div className="chip-group chip-group--nowrap">
                <Chip label="Read their stories" selected={method === "Tell your story"} onClick={() => changeMethod("Tell your story")} />
                <Chip label="Random pick" selected={method === "Random pick"} onClick={() => changeMethod("Random pick")} />
              </div>
            </fieldset>

            <div className="list-header">
              <h2 className="t-headline-s">
                Who’s <em>interested</em>
              </h2>
              <p className="t-body-small muted">
                {n} {n === 1 ? "neighbor" : "neighbors"}
              </p>
            </div>

            {n === 0 ? (
              <p className="t-body muted">No one’s raised a hand yet. We’ll let you know when they do.</p>
            ) : (
              <>
                <ul className="interested-list">
                  {list.map((i) => (
                    <InterestedRow
                      key={i.neighborId}
                      neighbor={neighbors[i.neighborId]}
                      story={i.story}
                      variant={method === "Tell your story" ? "story" : "random"}
                      selected={chosen?.id === i.neighborId}
                      onChoose={() => setChosen({ id: i.neighborId, how: "story" })}
                    />
                  ))}
                </ul>
                {n > PREVIEW && (
                  <Button variant="secondary" fullWidth onClick={() => setShowAll((s) => !s)} aria-expanded={showAll}>
                    {showAll ? "Show fewer" : `Show ${n - PREVIEW} more`}
                  </Button>
                )}
              </>
            )}

            {chosen ? (
              <div className="callout" role="status">
                <p className="t-body-small">
                  You picked <strong>{neighbors[chosen.id].firstName}</strong>
                  {chosen.how === "random" ? " at random" : ""}. We’ll kindly let the other {n - 1} know.
                </p>
                <Button icon={icons.messageOnInk} fullWidth onClick={confirm}>
                  Confirm &amp; message {neighbors[chosen.id].firstName}
                </Button>
                <Button variant="secondary" fullWidth onClick={() => setChosen(null)}>
                  Choose someone else
                </Button>
              </div>
            ) : (
              n > 0 && (
                <div className="callout">
                  <p className="t-body-small">Can’t decide? Let chance choose fairly among all {n}.</p>
                  <Button icon={icons.shuffleOnInk} fullWidth onClick={pickRandom}>
                    Pick at random
                  </Button>
                </div>
              )
            )}

            <Button variant="secondary" fullWidth onClick={endEarly}>
              End giveaway early
            </Button>
          </>
        )}
      </main>
    </>
  );
}
