import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { icons } from "../assets";
import { Avatar } from "../components/Avatar";
import { Button, ButtonLink } from "../components/Button";
import { Chip } from "../components/Chip";
import { ConversationRow } from "../components/ConversationRow";
import { Icon } from "../components/Icon";
import { MessageBubble } from "../components/MessageBubble";
import { SearchBar } from "../components/SearchBar";
import { Tag } from "../components/Tag";
import { BackTopBar, RootTopBar } from "../components/TopBar";
import { neighbors, type Conversation, type ConversationKind } from "../data";
import { useIsMobile } from "../hooks/useIsMobile";
import { useMessages } from "../state/messages";

type Filter = "All" | ConversationKind;
const filters: Filter[] = ["All", "Giving", "Receiving"];

export function Messages() {
  const { id } = useParams();
  const mobile = useIsMobile();
  const { conversations } = useMessages();

  if (id && !conversations.some((c) => c.id === id)) return <Navigate to="/messages" replace />;
  if (!mobile) return <MessagesDesktop selectedId={id ?? conversations[0]?.id} />;
  return id ? <ChatMobile id={id} /> : <InboxMobile />;
}

/* ---------- Shared pieces ---------- */

function useInbox() {
  const { conversations } = useMessages();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations
      .filter((c) => filter === "All" || c.kind === filter)
      .filter((c) => !q || `${neighbors[c.neighborId].name} ${c.itemTitle} ${c.preview}`.toLowerCase().includes(q));
  }, [conversations, filter, search]);
  return { filter, setFilter, search, setSearch, visible };
}

function InboxHeader({ inbox }: { inbox: ReturnType<typeof useInbox> }) {
  return (
    <div className="inbox__header">
      <h1 className="t-display-l">
        <em>Messages</em>
      </h1>
      <SearchBar label="Search conversations" placeholder="Search conversations" value={inbox.search} onChange={inbox.setSearch} />
      <div className="chip-group chip-group--nowrap">
        {filters.map((f) => (
          <Chip key={f} label={f} selected={inbox.filter === f} onClick={() => inbox.setFilter(f)} />
        ))}
      </div>
    </div>
  );
}

function InboxList({ inbox, selectedId }: { inbox: ReturnType<typeof useInbox>; selectedId?: string }) {
  const navigate = useNavigate();
  return (
    <ul className="inbox__list">
      {inbox.visible.map((c) => (
        <ConversationRow
          key={c.id}
          conversation={c}
          selected={c.id === selectedId}
          onSelect={() => navigate(`/messages/${c.id}`, { replace: !!selectedId })}
        />
      ))}
      {inbox.visible.length === 0 && <li className="inbox__empty t-body-small muted">No conversations match.</li>}
    </ul>
  );
}

function Thread({ convo }: { convo: Conversation }) {
  const ref = useRef<HTMLDivElement>(null);
  const { markRead } = useMessages();
  const n = neighbors[convo.neighborId];

  // Opening a thread marks it read.
  useEffect(() => {
    if (convo.unread) markRead(convo.id);
  }, [convo.id, convo.unread, markRead]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [convo.id, convo.messages.length]);

  return (
    <div className="chat__thread" ref={ref} role="log" aria-live="polite">
      <p className="t-label-small muted chat__day">TODAY</p>
      {convo.systemNote && (
        <p className="system-note t-label-small">
          <Icon src={icons.shuffle} size={16} />
          {convo.systemNote}
        </p>
      )}
      {convo.messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {convo.messages.length === 0 && <p className="t-body-small muted chat__empty">Say hi to {n.firstName} 👋</p>}
    </div>
  );
}

function Composer({ convoId, compact }: { convoId: string; compact?: boolean }) {
  const { send } = useMessages();
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <form
      className={`composer ${compact ? "composer--compact" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        send(convoId, draft);
        setDraft("");
      }}
    >
      <button
        type="button"
        className={compact ? "round-button" : "icon-button"}
        aria-label="Attach a photo"
        onClick={() => fileRef.current?.click()}
      >
        <Icon src={icons.camera} size={24} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) send(convoId, `📷 ${file.name}`);
          e.target.value = "";
        }}
      />
      <label className="pill-input composer__input">
        <span className="visually-hidden">Message</span>
        <input placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      {compact ? (
        <button type="submit" className="send-button" aria-label="Send">
          <Icon src={icons.send} size={24} />
        </button>
      ) : (
        <Button type="submit" icon={icons.send}>
          Send
        </Button>
      )}
    </form>
  );
}

/* ================= D3 · Desktop split view ================= */

function MessagesDesktop({ selectedId }: { selectedId?: string }) {
  const inbox = useInbox();
  const { conversations } = useMessages();
  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];
  const n = neighbors[selected.neighborId];

  return (
    <main className="messages">
      <section className="inbox" aria-label="Conversations">
        <InboxHeader inbox={inbox} />
        <InboxList inbox={inbox} selectedId={selected.id} />
      </section>

      <section className="chat" aria-label={`Conversation with ${n.name}`}>
        <header className="chat__header">
          <Avatar src={n.avatar} size="m" />
          <div className="chat__name">
            <h2 className="t-subheading">{n.name}</h2>
            <p className="t-body-small muted">{selected.meta}</p>
          </div>
          <div className="item-context">
            {selected.itemImage ? (
              <img src={selected.itemImage} alt="" className="item-context__thumb" />
            ) : (
              <span className="item-context__thumb" />
            )}
            <div className="item-context__text">
              <p className="t-label">{selected.itemTitle}</p>
              <p className="t-body-small muted">{selected.contextLine}</p>
            </div>
            {selected.itemHref && (
              <ButtonLink to={selected.itemHref} variant="secondary">
                View item
              </ButtonLink>
            )}
          </div>
        </header>
        <Thread convo={selected} />
        <Composer key={selected.id} convoId={selected.id} />
      </section>
    </main>
  );
}

/* ================= M8 · Mobile inbox ================= */

function InboxMobile() {
  const inbox = useInbox();
  return (
    <>
      <RootTopBar />
      <main className="m-page m-page--flush m-inbox">
        <InboxHeader inbox={inbox} />
        <InboxList inbox={inbox} />
      </main>
    </>
  );
}

/* ================= M9 · Mobile chat ================= */

function ChatMobile({ id }: { id: string }) {
  const { conversations } = useMessages();
  const convo = conversations.find((c) => c.id === id)!;
  const n = neighbors[convo.neighborId];

  const context = (
    <>
      {convo.itemImage ? <img src={convo.itemImage} alt="" className="item-context__thumb" /> : <span className="item-context__thumb" />}
      <span className="m-chat__context-text">
        <span className="t-label">{convo.itemTitle}</span>
        <span className="t-body-small muted">{convo.contextLine}</span>
      </span>
      {convo.statusTag && <Tag label={convo.statusTag} tone="warm" />}
    </>
  );

  return (
    <div className="m-chat">
      <BackTopBar title={n.name} fallback="/messages" />
      {convo.itemHref ? (
        <Link to={convo.itemHref} className="m-chat__context" aria-label={`View ${convo.itemTitle}`}>
          {context}
        </Link>
      ) : (
        <div className="m-chat__context">{context}</div>
      )}
      <Thread convo={convo} />
      <Composer key={convo.id} convoId={convo.id} compact />
    </div>
  );
}
