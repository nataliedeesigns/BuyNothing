import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { icons } from "../assets";
import { Avatar } from "../components/Avatar";
import { Button, ButtonLink } from "../components/Button";
import { Chip } from "../components/Chip";
import { ConversationRow } from "../components/ConversationRow";
import { Icon } from "../components/Icon";
import { MessageBubble } from "../components/MessageBubble";
import { SearchBar } from "../components/SearchBar";
import { conversations as seed, getItem, neighbors, type Conversation, type ConversationKind } from "../data";

type Filter = "All" | ConversationKind;
const filters: Filter[] = ["All", "Giving", "Receiving"];

const nowLabel = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Build the starting inbox, adding a fresh thread when arriving from "Message <giver>". */
function initialConversations(to: string | null, itemId: string | null): Conversation[] {
  const giver = to ? neighbors[to] : undefined;
  const item = itemId ? getItem(itemId) : undefined;
  if (!giver || !item || seed.some((c) => c.id === giver.id)) return seed;
  return [
    {
      id: giver.id,
      name: giver.name,
      avatar: giver.avatar,
      kind: "Receiving",
      itemId: item.id,
      time: "Now",
      preview: "Start the conversation",
      unread: false,
      meta: `${item.distanceMi} mi away`,
      contextLine: `${giver.firstName} is giving · ${item.endsLabel}`,
      messages: [],
    },
    ...seed,
  ];
}

export function Messages() {
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState(() => initialConversations(params.get("to"), params.get("item")));
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedId = params.get("c") ?? params.get("to") ?? list[0].id;
  const selected = list.find((c) => c.id === selectedId) ?? list[0];
  const item = getItem(selected.itemId);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list
      .filter((c) => filter === "All" || c.kind === filter)
      .filter((c) => !q || `${c.name} ${getItem(c.itemId)?.title} ${c.preview}`.toLowerCase().includes(q));
  }, [list, filter, search]);

  // Opening a thread marks it read.
  useEffect(() => {
    if (selected.unread) setList((l) => l.map((c) => (c.id === selected.id ? { ...c, unread: false } : c)));
  }, [selected.id, selected.unread]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [selected.id, selected.messages.length]);

  const select = (id: string) => setParams({ c: id }, { replace: true });

  const send = (text: string) => {
    const body = text.trim();
    if (!body) return;
    const time = nowLabel();
    setList((l) =>
      l.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              time,
              preview: body,
              messages: [...c.messages, { id: crypto.randomUUID(), from: "me", text: body, time, status: "Delivered" }],
            }
          : c,
      ),
    );
    setDraft("");
  };

  return (
    <main className="messages">
      <section className="inbox" aria-label="Conversations">
        <div className="inbox__header">
          <h1 className="t-display-l">
            <em>Messages</em>
          </h1>
          <SearchBar label="Search conversations" placeholder="Search conversations" value={search} onChange={setSearch} />
          <div className="chip-group chip-group--nowrap">
            {filters.map((f) => (
              <Chip key={f} label={f} selected={filter === f} onClick={() => setFilter(f)} />
            ))}
          </div>
        </div>
        <ul className="inbox__list">
          {visible.map((c) => (
            <ConversationRow key={c.id} conversation={c} selected={c.id === selected.id} onSelect={() => select(c.id)} />
          ))}
          {visible.length === 0 && <li className="inbox__empty t-body-small muted">No conversations match.</li>}
        </ul>
      </section>

      <section className="chat" aria-label={`Conversation with ${selected.name}`}>
        <header className="chat__header">
          <Avatar src={selected.avatar} size="m" />
          <div className="chat__name">
            <h2 className="t-subheading">{selected.name}</h2>
            <p className="t-body-small muted">{selected.meta}</p>
          </div>
          {item && (
            <div className="item-context">
              <img src={item.thumbImage ?? item.image} alt="" className="item-context__thumb" />
              <div className="item-context__text">
                <p className="t-label">{item.title}</p>
                <p className="t-body-small muted">{selected.contextLine}</p>
              </div>
              <ButtonLink to={`/item/${item.id}`} variant="secondary">
                View item
              </ButtonLink>
            </div>
          )}
        </header>

        <div className="chat__thread" ref={threadRef} role="log" aria-live="polite">
          <p className="t-label-small muted chat__day">TODAY</p>
          {selected.systemNote && (
            <p className="system-note t-label-small">
              <Icon src={icons.shuffle} size={16} />
              {selected.systemNote}
            </p>
          )}
          {selected.messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {selected.messages.length === 0 && (
            <p className="t-body-small muted chat__empty">Say hi to {selected.name.split(" ")[0]} 👋</p>
          )}
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <button type="button" className="icon-button" aria-label="Attach a photo" onClick={() => fileRef.current?.click()}>
            <Icon src={icons.camera} size={24} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) send(`📷 ${file.name}`);
              e.target.value = "";
            }}
          />
          <label className="pill-input composer__input">
            <span className="visually-hidden">Message</span>
            <input placeholder="Write a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          </label>
          <Button type="submit" icon={icons.send}>
            Send
          </Button>
        </form>
      </section>
    </main>
  );
}
