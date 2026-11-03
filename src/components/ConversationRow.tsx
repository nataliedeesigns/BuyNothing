import { icons } from "../assets";
import { getItem, type Conversation } from "../data";
import { Avatar } from "./Avatar";

interface ConversationRowProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
}

/** Inbox row, 72px min. Unread = ink preview + outlined dot (not color-only). */
export function ConversationRow({ conversation: c, selected, onSelect }: ConversationRowProps) {
  const item = getItem(c.itemId);
  return (
    <li>
      <button
        type="button"
        className={`conversation ${selected ? "conversation--selected" : ""}`}
        aria-current={selected ? "true" : undefined}
        onClick={onSelect}
      >
        <Avatar src={c.avatar} size="m" />
        <span className="conversation__text">
          <span className="conversation__top">
            <span className="t-label">{c.name}</span>
            <span className="t-label-small muted">{c.time}</span>
          </span>
          <span className="conversation__bottom">
            <span className={`conversation__preview t-body-small ${c.unread ? "" : "muted"}`}>
              Re: {item?.title} — {c.preview}
            </span>
            {c.unread && (
              <>
                <img src={icons.unreadDot} width={12} height={12} alt="" aria-hidden="true" className="icon" />
                <span className="visually-hidden">Unread</span>
              </>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}
