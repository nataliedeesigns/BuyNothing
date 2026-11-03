import { Link } from "react-router-dom";
import { icons } from "../assets";
import { neighbors, type Item } from "../data";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Tag } from "./Tag";

interface ItemCardProps {
  item: Item;
  interested: boolean;
  onToggleInterest: () => void;
}

/**
 * Item listing card. Default = open giveaway (primary "I’m interested").
 * Interested = secondary "Interested" with check; status line shows draw time.
 * Ended = desaturated image, Gifted tag, disabled CTA.
 * The whole card links to Item Details; the CTA is a separate 48px target.
 */
export function ItemCard({ item, interested, onToggleInterest }: ItemCardProps) {
  const giver = neighbors[item.giverId];
  const count = item.interestedCount + (interested ? 1 : 0);

  let status: string;
  if (item.ended) status = "Gifted to a neighbor";
  else if (interested && item.method === "Random pick") status = `You’re in · ${item.endsLabel.replace("Drawing ", "drawing ").replace(",", "")}`;
  else if (interested) status = "You’re in · story sent";
  else status = `${count} ${count === 1 ? "neighbor" : "neighbors"} interested`;

  return (
    <article className={`item-card ${item.ended ? "item-card--ended" : ""}`}>
      <div className="item-card__image">
        <img src={item.image} alt="" />
        {item.ended ? (
          <Tag label="Gifted" tone="neutral" />
        ) : (
          <Tag label={item.method} tone={item.method === "Tell your story" ? "ink" : "bright"} />
        )}
      </div>
      <div className="item-card__body">
        <h3 className={`t-headline-s ${item.ended ? "muted" : ""}`}>
          <Link to={`/item/${item.id}`} className="item-card__link">
            {item.title}
          </Link>
        </h3>
        <p className="item-card__meta t-body-small muted">
          <Icon src={icons.pin16} size={16} />
          <span>
            {item.distanceMi} mi · {item.postedLabel}
          </span>
        </p>
        <p className="item-card__giver t-supporting muted">
          <Avatar src={giver.avatar} size="s" />
          <span>Given by {giver.name}</span>
        </p>
        <div className="item-card__footer">
          <p className={`t-body-small ${interested ? "" : "muted"}`}>{status}</p>
          {item.ended ? (
            <Button variant="disabled">Ended</Button>
          ) : interested ? (
            <Button variant="secondary" icon={icons.checkInk} onClick={onToggleInterest} aria-label={`Withdraw interest in ${item.title}`}>
              Interested
            </Button>
          ) : (
            <Button icon={icons.heartOnInk} onClick={onToggleInterest} aria-label={`I’m interested in ${item.title}`}>
              I’m interested
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
