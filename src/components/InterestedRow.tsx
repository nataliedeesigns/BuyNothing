import { icons } from "../assets";
import type { Neighbor } from "../data";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface Props {
  neighbor: Neighbor;
  story?: string;
  variant: "random" | "story";
  selected: boolean;
  onChoose?: () => void;
}

/**
 * Giver-side list of interested neighbors. Random = simple list. Story = reason + "Choose".
 * Selected = chosen recipient (bright fill + border + check icon).
 */
export function InterestedRow({ neighbor, story, variant, selected, onChoose }: Props) {
  return (
    <li className={`interested-row ${selected ? "interested-row--selected" : ""}`}>
      <Avatar src={neighbor.avatar} size="m" />
      <div className="interested-row__text">
        <p className="t-label">{neighbor.name}</p>
        {variant === "story" && story && <p className="t-body-small">“{story}”</p>}
        {variant === "random" && <p className="t-body-small muted">{neighbor.distanceMi} mi away</p>}
        {variant === "story" && onChoose && !selected && (
          <Button variant="secondary" onClick={onChoose}>
            Choose {neighbor.firstName}
          </Button>
        )}
        {selected && (
          <p className="t-label-small interested-row__chosen">
            <Icon src={icons.checkInk} size={16} /> CHOSEN
          </p>
        )}
      </div>
    </li>
  );
}
