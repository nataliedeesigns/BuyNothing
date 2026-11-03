import { Link } from "react-router-dom";
import { icons } from "../assets";
import { Icon } from "./Icon";
import { Tag, type TagTone } from "./Tag";

interface MyItemRowProps {
  to: string;
  image?: string;
  title: string;
  meta: string;
  tag: string;
  tone: TagTone;
}

/** Row in My Items. Status tag spells out state; the entire 96px row opens the item. */
export function MyItemRow({ to, image, title, meta, tag, tone }: MyItemRowProps) {
  return (
    <Link to={to} className="my-item-row">
      {image ? <img src={image} alt="" className="my-item-row__thumb" /> : <span className="my-item-row__thumb" />}
      <span className="my-item-row__text">
        <span className="t-subheading">{title}</span>
        <span className="t-body-small muted">{meta}</span>
        <Tag label={tag} tone={tone} />
      </span>
      <Icon src={icons.chevronRight} size={24} />
    </Link>
  );
}
