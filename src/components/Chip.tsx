import { icons } from "../assets";
import { Icon } from "./Icon";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** Filter chip, 44px tall. Selected = ink fill + check (state isn't color-only). */
export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button type="button" className={`chip ${selected ? "chip--on" : ""}`} aria-pressed={selected} onClick={onClick}>
      {selected && <Icon src={icons.checkOnInk} size={16} />}
      <span>{label}</span>
    </button>
  );
}
