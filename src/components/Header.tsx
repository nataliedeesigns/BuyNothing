import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { avatars, icons } from "../assets";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { SearchBar } from "./SearchBar";

const navLinks = [
  { to: "/", label: "Browse", end: true },
  { to: "/my-items", label: "My Items", end: false },
  { to: "/messages", label: "Messages", end: false },
];

/** Desktop/tablet (≥1024px) global header: wordmark, primary nav, search, Give CTA, profile. */
export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    if (location.pathname === "/") setQuery(params.get("q") ?? "");
  }, [location.pathname, params]);

  const path = location.pathname;
  const activeFor: Record<string, boolean> = {
    "/": path === "/" || path.startsWith("/item/"),
    "/my-items": path.startsWith("/my-items") || path.startsWith("/giving/"),
    "/messages": path.startsWith("/messages"),
  };

  return (
    <header className="site-header">
      <Link to="/" className="logo" aria-label="Buy Nothing home">
        <Icon src={icons.leaf} size={32} />
        <span className="t-headline-s">
          Buy <em>Nothing</em>
        </span>
      </Link>

      <nav aria-label="Primary" className="site-nav">
        {navLinks.map((l) => {
          const active = activeFor[l.to];
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={`nav-link t-label ${active ? "nav-link--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {l.label}
            </NavLink>
          );
        })}
      </nav>

      <SearchBar
        className="site-header__search"
        label="Search items"
        placeholder="Search free items near you"
        value={query}
        onChange={(v) => {
          setQuery(v);
          if (location.pathname === "/") navigate(v ? `/?q=${encodeURIComponent(v)}` : "/", { replace: true });
        }}
        onSubmit={() => navigate(query ? `/?q=${encodeURIComponent(query)}` : "/")}
      />

      <Button icon={icons.plus} onClick={() => navigate("/give")}>
        Give an item
      </Button>

      <Link to="/profile" className="profile-button" aria-label="Your profile">
        <Avatar src={avatars.me} size="m" />
      </Link>
    </header>
  );
}
