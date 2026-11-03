import { icons } from "../assets";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** 52×32 switch inside a 44px-tall row; the whole row is the hit target. */
export function ToggleRow({ label, checked, onChange }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="toggle-row" onClick={() => onChange(!checked)}>
      <span className="t-label">{label}</span>
      {checked ? (
        <img src={icons.toggleOn} width={52} height={32} alt="" aria-hidden="true" className="toggle" />
      ) : (
        <span className="toggle toggle--off" aria-hidden="true">
          <span className="toggle__knob" />
        </span>
      )}
    </button>
  );
}
