import { useSearchParams } from "react-router-dom";
import { icons } from "../assets";
import { ButtonLink } from "../components/Button";
import { Chip } from "../components/Chip";
import { Icon } from "../components/Icon";
import { MyItemRow } from "../components/MyItemRow";
import { RootTopBar } from "../components/TopBar";
import { getItem, neighbors } from "../data";
import { giveawayStatus } from "../giveawayLabels";
import { useGiving } from "../state/giving";
import { useInterests } from "../state/interests";
import { useMessages } from "../state/messages";

/** M7 · My Items (Giving & Interested). */
export function MyItems() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "interested" ? "interested" : "giving";
  const { giveaways } = useGiving();
  const { interests } = useInterests();
  const interestedItems = Object.keys(interests).map(getItem).filter((i) => i !== undefined);

  return (
    <>
      <RootTopBar />
      <main className="m-page narrow-page my-items">
        <h1 className="t-display-l">
          Your items, in <em>one place.</em>
        </h1>
        <div className="chip-group chip-group--nowrap" role="group" aria-label="Show">
          <Chip label={`Giving · ${giveaways.length}`} selected={tab === "giving"} onClick={() => setParams({}, { replace: true })} />
          <Chip
            label={`Interested · ${interestedItems.length}`}
            selected={tab === "interested"}
            onClick={() => setParams({ tab: "interested" }, { replace: true })}
          />
        </div>
        {tab === "giving" ? <GivingTab /> : <InterestedTab items={interestedItems} stories={interests} />}
      </main>
    </>
  );
}

function GivingTab() {
  const { giveaways } = useGiving();
  const { conversations } = useMessages();
  const current = giveaways.filter((g) => g.status === "active" || g.status === "pickup");
  const past = giveaways.filter((g) => g.status === "gifted" || g.status === "ended");
  const pickups = current.filter((g) => g.status === "pickup" && g.recipientId);

  if (giveaways.length === 0) {
    return (
      <div className="empty-state">
        <p className="t-headline-s">Nothing given yet.</p>
        <ButtonLink to="/give" icon={icons.plus}>
          Give an item
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      {current.length > 0 && (
        <section className="my-items__group" aria-labelledby="g-active">
          <h2 id="g-active" className="t-label-small muted">
            NEEDS YOUR ATTENTION
          </h2>
          {current.map((g) => {
            const s = giveawayStatus(g);
            return <MyItemRow key={g.id} to={`/giving/${g.id}`} image={g.photos[0]} title={g.title} meta={s.meta} tag={s.tag} tone={s.tone} />;
          })}
          {pickups.map((g) => {
            const r = neighbors[g.recipientId!];
            const convo = conversations.find((c) => c.neighborId === r.id && c.itemTitle === g.title);
            return (
              <div key={g.id} className="nudge">
                <Icon src={icons.message} size={24} />
                <div className="nudge__text">
                  <p className="t-body-small">
                    {r.firstName} is ready to pick up your {g.title.toLowerCase()}.
                  </p>
                  <ButtonLink to={convo ? `/messages/${convo.id}` : "/messages"} icon={icons.messageOnInk}>
                    Open chat
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </section>
      )}
      {past.length > 0 && (
        <section className="my-items__group" aria-labelledby="g-past">
          <h2 id="g-past" className="t-label-small muted">
            PAST GIVEAWAYS
          </h2>
          {past.map((g) => {
            const s = giveawayStatus(g);
            return <MyItemRow key={g.id} to={`/giving/${g.id}`} image={g.photos[0]} title={g.title} meta={s.meta} tag={s.tag} tone={s.tone} />;
          })}
        </section>
      )}
    </>
  );
}

function InterestedTab({ items, stories }: { items: NonNullable<ReturnType<typeof getItem>>[]; stories: Record<string, string> }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="t-headline-s">You haven’t raised a hand yet.</p>
        <ButtonLink to="/" variant="secondary">
          Browse free items
        </ButtonLink>
      </div>
    );
  }
  return (
    <section className="my-items__group" aria-label="Items you’re interested in">
      {items.map((item) => {
        const giver = neighbors[item.giverId];
        const meta =
          item.method === "Random pick"
            ? `${giver.name} · ${item.endsLabel.toLowerCase()}`
            : stories[item.id]
              ? `Story sent to ${giver.firstName} · ${item.endsLabel.toLowerCase()}`
              : `${giver.name} · ${item.endsLabel.toLowerCase()}`;
        return (
          <MyItemRow
            key={item.id}
            to={`/item/${item.id}`}
            image={item.thumbImage ?? item.image}
            title={item.title}
            meta={meta}
            tag={item.ended ? "Ended" : "You’re in"}
            tone={item.ended ? "neutral" : "bright"}
          />
        );
      })}
    </section>
  );
}
