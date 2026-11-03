import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { neighbors, seedConversations, type Conversation, type ConversationKind } from "../data";

export const nowLabel = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

interface StartOptions {
  neighborId: string;
  kind: ConversationKind;
  itemTitle: string;
  itemImage?: string;
  itemHref?: string;
  contextLine: string;
  statusTag?: string;
  systemNote?: string;
  /** An opening message from the user. */
  firstMessage?: string;
}

interface MessagesState {
  conversations: Conversation[];
  markRead: (id: string) => void;
  send: (id: string, text: string) => void;
  /** Returns the conversation id — existing thread with that neighbor, or a new one. */
  start: (opts: StartOptions) => string;
}

const MessagesContext = createContext<MessagesState | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState(seedConversations);

  const send = useCallback((id: string, text: string) => {
    const body = text.trim();
    if (!body) return;
    const time = nowLabel();
    setConversations((list) => {
      const target = list.find((c) => c.id === id);
      if (!target) return list;
      const updated: Conversation = {
        ...target,
        time,
        preview: body,
        messages: [...target.messages, { id: crypto.randomUUID(), from: "me", text: body, time, status: "Delivered" }],
      };
      // Most recent thread first.
      return [updated, ...list.filter((c) => c.id !== id)];
    });
  }, []);

  const start = useCallback(
    (opts: StartOptions) => {
      const existing = conversations.find((c) => c.neighborId === opts.neighborId && c.itemTitle === opts.itemTitle);
      if (existing) {
        if (opts.firstMessage) send(existing.id, opts.firstMessage);
        return existing.id;
      }
      const n = neighbors[opts.neighborId];
      const id = `${opts.neighborId}-${Date.now()}`;
      const time = nowLabel();
      const convo: Conversation = {
        id,
        neighborId: opts.neighborId,
        kind: opts.kind,
        itemTitle: opts.itemTitle,
        itemImage: opts.itemImage,
        itemHref: opts.itemHref,
        statusTag: opts.statusTag,
        time,
        preview: opts.firstMessage ?? "Start the conversation",
        unread: false,
        meta: `${n.distanceMi} mi away`,
        contextLine: opts.contextLine,
        systemNote: opts.systemNote,
        messages: opts.firstMessage
          ? [{ id: crypto.randomUUID(), from: "me", text: opts.firstMessage, time, status: "Delivered" }]
          : [],
      };
      setConversations((list) => [convo, ...list]);
      return id;
    },
    [conversations, send],
  );

  const value = useMemo<MessagesState>(
    () => ({
      conversations,
      send,
      start,
      markRead: (id) => setConversations((l) => l.map((c) => (c.id === id && c.unread ? { ...c, unread: false } : c))),
    }),
    [conversations, send, start],
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used inside MessagesProvider");
  return ctx;
}
