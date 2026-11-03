import { icons } from "../assets";
import type { Method } from "../data";
import { Icon } from "./Icon";

const copy: Record<Method, { title: string; body: string; icon: string }> = {
  "Random pick": { title: "Random pick", body: "We’ll choose a neighbor at random when the giveaway ends.", icon: icons.shuffle },
  "Tell your story": { title: "Ask for their story", body: "Neighbors tell you why they’d love it. You pick.", icon: icons.pen },
};

interface Props {
  name: string;
  value: Method;
  onChange: (m: Method) => void;
}

/** Radio cards for the giver's choice. Selected = bright fill, 2px ink border, filled radio. */
export function GivingMethodChoice({ name, value, onChange }: Props) {
  return (
    <fieldset className="method-choice">
      <legend className="t-label">How should we choose?</legend>
      {(Object.keys(copy) as Method[]).map((m) => {
        const c = copy[m];
        const selected = value === m;
        return (
          <label key={m} className={`method-option ${selected ? "method-option--on" : ""}`}>
            <span className="method-option__icon">
              <Icon src={c.icon} size={24} />
            </span>
            <span className="method-option__text">
              <span className="t-label">{c.title}</span>
              <span className="t-body-small">{c.body}</span>
            </span>
            <input type="radio" name={name} checked={selected} onChange={() => onChange(m)} className="method-option__radio" />
          </label>
        );
      })}
    </fieldset>
  );
}
