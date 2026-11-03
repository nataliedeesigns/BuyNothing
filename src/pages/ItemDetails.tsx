import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { icons } from "../assets";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { TextAreaField } from "../components/InputField";
import { Tag } from "../components/Tag";
import { BackTopBar } from "../components/TopBar";
import { getItem, neighbors, type Item, type Neighbor } from "../data";
import { useIsMobile } from "../hooks/useIsMobile";
import { useInterests } from "../state/interests";
import { useMessages } from "../state/messages";

const STORY_LIMIT = 300;

/** Shared interest + story logic for both layouts. */
function useItemInterest(item: Item, giver: Neighbor) {
  const { interests, setInterest, withdraw } = useInterests();
  const { start } = useMessages();
  const navigate = useNavigate();
  const [story, setStory] = useState(interests[item.id] ?? "");
  const [error, setError] = useState("");

  const interested = item.id in interests;
  const isStory = item.method === "Tell your story";
  const count = item.interestedCount + (interested ? 1 : 0);

  const submit = () => {
    if (isStory && story.trim().length === 0) {
      setError(`Add a few words so ${giver.firstName} can choose.`);
      return;
    }
    setError("");
    setInterest(item.id, story.trim());
  };

  const messageGiver = () => {
    const id = start({
      neighborId: giver.id,
      kind: "Receiving",
      itemTitle: item.title,
      itemImage: item.thumbImage ?? item.image,
      itemHref: `/item/${item.id}`,
      contextLine: `${giver.firstName} is giving · ${item.endsLabel}`,
    });
    navigate(`/messages/${id}`);
  };

  const updateStory = (v: string) => {
    setStory(v);
    if (error) setError("");
  };

  return { interested, isStory, count, story, updateStory, error, submit, withdraw: () => withdraw(item.id), messageGiver };
}

type Interest = ReturnType<typeof useItemInterest>;

export function ItemDetails() {
  const { id = "" } = useParams();
  const item = getItem(id);
  if (!item) return <Navigate to="/" replace />;
  return <ItemDetailsFor key={item.id} item={item} />;
}

function ItemDetailsFor({ item }: { item: Item }) {
  const giver = neighbors[item.giverId];
  const interest = useItemInterest(item, giver);
  const mobile = useIsMobile();
  return mobile ? <ItemMobile item={item} giver={giver} interest={interest} /> : <ItemDesktop item={item} giver={giver} interest={interest} />;
}

interface LayoutProps {
  item: Item;
  giver: Neighbor;
  interest: Interest;
}

function Explainer({ item, giver, interest, withCount }: LayoutProps & { withCount?: boolean }) {
  if (item.ended) return null;
  const { isStory, count } = interest;
  const tail = withCount ? ` ${count} ${count === 1 ? "neighbor is" : "neighbors are"} interested so far.` : "";
  return (
    <div className="explainer">
      <Icon src={isStory ? icons.pen : icons.shuffle} size={24} />
      <p className="t-body-small">
        {isStory
          ? `${giver.firstName} will choose based on neighbors’ stories.${withCount ? tail : ` Tell ${giver.pronoun} why it would mean something to you.`}`
          : `${giver.firstName} will pick a neighbor at random — ${item.endsLabel.toLowerCase()}. Just raise your hand.${tail}`}
      </p>
    </div>
  );
}

function StoryAndActions({ item, giver, interest }: LayoutProps) {
  const { isStory, interested, story, updateStory, error, submit, withdraw } = interest;
  return (
    <>
      {isStory && !item.ended && (
        <TextAreaField
          label="Why would you love this?"
          placeholder="Share a little about how you’d use it…"
          helper={`${giver.firstName} sees this. Keep it kind and short (${STORY_LIMIT} characters).`}
          error={error || undefined}
          value={story}
          maxLength={STORY_LIMIT}
          onChange={updateStory}
        />
      )}
      <div className="details__actions">
        {item.ended ? (
          <Button variant="disabled" fullWidth>
            Ended
          </Button>
        ) : interested ? (
          <>
            <p className="t-body-small" role="status">
              You’re in! {giver.firstName} will let you know {isStory ? "after choosing" : "after the drawing"}.
            </p>
            <Button variant="secondary" icon={icons.checkInk} fullWidth onClick={withdraw}>
              Interest sent · Withdraw
            </Button>
          </>
        ) : (
          <Button icon={icons.heartOnInk} fullWidth onClick={submit}>
            {isStory ? "Send my interest" : "I’m interested"}
          </Button>
        )}
      </div>
    </>
  );
}

function Tags({ item, isStory }: { item: Item; isStory: boolean }) {
  return (
    <div className="details__tags">
      {item.ended ? <Tag label="Gifted" tone="neutral" /> : <Tag label={item.method} tone={isStory ? "ink" : "bright"} />}
      {item.isNew && <Tag label="New" tone="warm" />}
    </div>
  );
}

/* ================= D2 · Desktop ================= */

function ItemDesktop({ item, giver, interest }: LayoutProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const gallery = [item.heroImage, item.heroImage, item.heroImage];

  return (
    <main className="details">
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb t-body-small">
          <li>
            <Link to="/">Browse</Link>
          </li>
          <li aria-hidden="true">
            <Icon src={icons.chevronRight} size={16} />
          </li>
          <li>
            <Link to={`/?category=${encodeURIComponent(item.category)}`}>{item.category}</Link>
          </li>
          <li aria-hidden="true">
            <Icon src={icons.chevronRight} size={16} />
          </li>
          <li aria-current="page" className="t-supporting">
            {item.title}
          </li>
        </ol>
      </nav>

      <div className="details__columns">
        <section className="gallery" aria-label="Photos">
          <img
            className={`gallery__hero ${item.ended ? "is-ended" : ""}`}
            src={gallery[activeThumb]}
            alt={`${item.title}, photo ${activeThumb + 1} of ${gallery.length}`}
          />
          <div className="gallery__thumbs">
            {gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`gallery__thumb ${i === activeThumb ? "is-active" : ""}`}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === activeThumb}
                onClick={() => setActiveThumb(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className="details__panel" aria-labelledby="item-title">
          <Tags item={item} isStory={interest.isStory} />
          <h1 id="item-title" className="t-display-l">
            {item.title}
          </h1>

          <ul className="details__meta t-body muted">
            <li>
              <Icon src={icons.pin20} size={20} />
              {item.distanceMi} mi · {item.crossStreets}
            </li>
            <li>
              <Icon src={icons.clock} size={20} />
              {item.endsLabel}
            </li>
            <li>
              <Icon src={icons.heartMuted} size={20} />
              {interest.count} interested
            </li>
          </ul>

          <div className="giver-card">
            <Avatar src={giver.avatar} size="m" />
            <div className="giver-card__text">
              <p className="t-label">{giver.name}</p>
              <p className="t-body-small muted">
                {giver.itemsGiven} items given · neighbor since {giver.since}
              </p>
            </div>
            <Button variant="secondary" icon={icons.message} onClick={interest.messageGiver}>
              Message {giver.firstName}
            </Button>
          </div>

          <p className="t-body">{item.description}</p>
          <Explainer item={item} giver={giver} interest={interest} />
          <StoryAndActions item={item} giver={giver} interest={interest} />
        </section>
      </div>
    </main>
  );
}

/* ================= M3 · Mobile ================= */

function ItemMobile({ item, giver, interest }: LayoutProps) {
  return (
    <>
      <BackTopBar title="Item details" fallback="/" />
      <main className="m-details">
        <img className={`m-details__hero ${item.ended ? "is-ended" : ""}`} src={item.heroImage} alt={item.title} />
        <div className="m-details__content">
          <Tags item={item} isStory={interest.isStory} />

          <div className="m-details__title">
            <h2 className="t-headline-m">{item.title}</h2>
            <ul className="m-details__meta t-body-small muted">
              <li>
                <Icon src={icons.pin16} size={16} />
                {item.distanceMi} mi · {item.crossStreets}
              </li>
              <li>
                <Icon src={icons.clock} size={16} />
                {item.endsLabel}
              </li>
            </ul>
          </div>

          <div className="giver-card giver-card--compact">
            <Avatar src={giver.avatar} size="m" />
            <div className="giver-card__text">
              <p className="t-label">{giver.name}</p>
              <p className="t-body-small muted">{giver.itemsGiven} items given</p>
            </div>
            <Button variant="secondary" icon={icons.message} onClick={interest.messageGiver} aria-label={`Message ${giver.firstName}`}>
              Message
            </Button>
          </div>

          <p className="t-body">{item.description}</p>

          <dl className="detail-rows">
            <div>
              <dt className="t-body muted">Category</dt>
              <dd className="t-label">{item.category}</dd>
            </div>
            <div>
              <dt className="t-body muted">Condition</dt>
              <dd className="t-label">{item.condition}</dd>
            </div>
            <div>
              <dt className="t-body muted">Pickup</dt>
              <dd className="t-label">{item.pickup}</dd>
            </div>
          </dl>

          <Explainer item={item} giver={giver} interest={interest} withCount />
          <StoryAndActions item={item} giver={giver} interest={interest} />
          {!item.ended && (
            <p className="t-body-small muted m-details__footnote">
              You can withdraw anytime from <Link to="/my-items?tab=interested">My Items</Link>.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
