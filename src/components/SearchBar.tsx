import { icons } from "../assets";
import { Icon } from "./Icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  label: string;
  className?: string;
}

/** 48px pill search input. */
export function SearchBar({ value, onChange, onSubmit, placeholder, label, className }: SearchBarProps) {
  return (
    <form
      role="search"
      className={`search-bar ${className ?? ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <Icon src={icons.search} size={20} />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}
