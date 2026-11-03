import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { seedGiveaways, type Giveaway } from "../data";

interface GivingState {
  giveaways: Giveaway[];
  add: (g: Omit<Giveaway, "id">[]) => string[];
  update: (id: string, patch: Partial<Giveaway>) => void;
  draftSaved: boolean;
  saveDraft: () => void;
}

const GivingContext = createContext<GivingState | null>(null);

export function GivingProvider({ children }: { children: ReactNode }) {
  const [giveaways, setGiveaways] = useState(seedGiveaways);
  const [draftSaved, setDraftSaved] = useState(false);

  const value = useMemo<GivingState>(
    () => ({
      giveaways,
      draftSaved,
      saveDraft: () => setDraftSaved(true),
      add: (list) => {
        const withIds = list.map((g) => ({ ...g, id: `g-${crypto.randomUUID().slice(0, 8)}` }));
        setGiveaways((cur) => [...withIds, ...cur]);
        return withIds.map((g) => g.id);
      },
      update: (id, patch) => setGiveaways((cur) => cur.map((g) => (g.id === id ? { ...g, ...patch } : g))),
    }),
    [giveaways, draftSaved],
  );

  return <GivingContext.Provider value={value}>{children}</GivingContext.Provider>;
}

export function useGiving() {
  const ctx = useContext(GivingContext);
  if (!ctx) throw new Error("useGiving must be used inside GivingProvider");
  return ctx;
}
