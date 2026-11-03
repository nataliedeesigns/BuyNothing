import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { icons } from "../assets";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { TextAreaField } from "../components/InputField";
import { Tag } from "../components/Tag";
import { conversations, getItem, neighbors } from "../data";
import { useInterests } from "../state";

const STORY_LIMIT = 300;

export function ItemDetails() {
  const { id = "" } = useParams();
  const item = getItem(id);
  const navigate = useNavigate();
  const { interests, setInterest, withdraw } = useInterests();
  const [story, setStory] = useState(interests[id] ?? "");
  const [activeThumb, setActiveThumb] = useState(0);
  const [error, setError] = useState("");

  if (!item) return <Navigate to="/" replace />;

  const giver = neighbors[item.giverId];
  const interested = item.id in interests;
  const isStory = item.method === "Tell your story";
  const count = item.interestedCount + (interested ? 1 : 0);
  const gallery = [item.heroImage, item.heroImage, item.heroImage];

  const messageGiver = () => {
    const existing = conversations.find((c) => c.name === giver.name);
    navigate(existing ? `/messages?c=${existing.id}` : `/messages?to=${giver.id}&item=${item.id}`);
  };

  const submit = () => {
    if (isStory && story.trim().length === 0) {
      setError(`Add a few words so ${giver.firstName} can choose.`);
      return;
    }
    setError("");
    setInterest(item.id, story.trim());
  };

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
          <div className="details__tags">
            {item.ended ? (
              <Tag label="Gifted" tone="neutral" />
            ) : (
              <Tag label={item.method} tone={isStory ? "ink" : "bright"} />
            )}
            {item.isNew && <Tag label="New" tone="warm" />}
          </div>

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
              {count} interested
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
            <Button variant="secondary" icon={icons.message} onClick={messageGiver}>
              Message {giver.firstName}
            </Button>
          </div>

          <p className="t-body">{item.description}</p>

          {!item.ended && (
            <div className="explainer">
              <Icon src={isStory ? icons.pen : icons.shuffle} size={24} />
              <p className="t-body-small">
                {isStory
                  ? `${giver.firstName} will choose based on neighbors’ stories. Tell ${giver.pronoun} why it would mean something to you.`
                  : `${giver.firstName} will pick a neighbor at random — ${item.endsLabel.toLowerCase()}. Just raise your hand.`}
              </p>
            </div>
          )}

          {isStory && !item.ended && (
            <TextAreaField
              label="Why would you love this?"
              placeholder="Share a little about how you’d use it…"
              helper={error || `${giver.firstName} sees this. Keep it kind and short (${STORY_LIMIT} characters).`}
              value={story}
              maxLength={STORY_LIMIT}
              onChange={(v) => {
                setStory(v);
                if (error) setError("");
              }}
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
                <Button variant="secondary" icon={icons.checkInk} fullWidth onClick={() => withdraw(item.id)}>
                  Interest sent · Withdraw
                </Button>
              </>
            ) : (
              <Button icon={icons.heartOnInk} fullWidth onClick={submit}>
                {isStory ? "Send my interest" : "I’m interested"}
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
