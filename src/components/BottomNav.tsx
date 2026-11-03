import { NavLink } from "react-router-dom";
import { tabIcons } from "../assets";

const tabs = [
  { to: "/", label: "Browse", icon: tabIcons.home, active: tabIcons.homeActive, end: true },
  { to: "/my-items", label: "My Items", icon: tabIcons.gift, active: tabIcons.giftActive },
  { to: "/give", label: "Give", icon: tabIcons.plus, active: tabIcons.plus },
  { to: "/messages", label: "Messages", icon: tabIcons.message, active: tabIcons.messageActive },
  { to: "/profile", label: "Profile", icon: tabIcons.user, active: tabIcons.user },
];

/** Mobile primary navigation, 5 destinations. Hidden ≥1024px. */
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className="tab">
          {({ isActive }) => (
            <>
              <span className="tab__indicator">
                <img src={isActive ? t.active : t.icon} width={24} height={24} alt="" aria-hidden="true" />
              </span>
              <span className="t-label-small">{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
