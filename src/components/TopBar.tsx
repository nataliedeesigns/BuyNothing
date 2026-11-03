import { Link, useNavigate } from "react-router-dom";
import { icons } from "../assets";
import { Icon } from "./Icon";

/** Root variant: wordmark + notifications. Hidden ≥1024px, where the Desktop Header takes over. */
export function RootTopBar() {
  return (
    <div className="top-bar top-bar--root">
      <Link to="/" className="logo" aria-label="Buy Nothing home">
        <Icon src={icons.leaf} size={28} />
        <span className="t-headline-s">
          Buy <em>Nothing</em>
        </span>
      </Link>
      <button type="button" className="round-button" aria-label="Notifications">
        <Icon src={icons.bell} size={24} />
      </button>
    </div>
  );
}

interface BackTopBarProps {
  title: string;
  /** Where Back goes when there's no in-app history (e.g. a deep link). */
  fallback: string;
}

/** Back variant: 44px back button, centered title, overflow button. */
export function BackTopBar({ title, fallback }: BackTopBarProps) {
  const navigate = useNavigate();
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback);
  };
  return (
    <div className="top-bar top-bar--back">
      <button type="button" className="round-button" aria-label="Back" onClick={goBack}>
        <Icon src={icons.chevronLeft} size={24} />
      </button>
      <h1 className="t-label top-bar__title">{title}</h1>
      <button type="button" className="round-button" aria-label="More options">
        <Icon src={icons.more} size={24} />
      </button>
    </div>
  );
}
