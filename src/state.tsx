import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface InterestState {
  /** item id → the story the user shared ("" for random-pick items). */
  interests: Record<string, string>;
  setInterest: (itemId: string, story?: string) => void;
  withdraw: (itemId: string) => void;
}

const InterestContext = createContext<InterestState | null>(null);

export function InterestProvider({ children }: { children: ReactNode }) {
  // Matches the design: the user has already raised a hand for the desk chair.
  const [interests, setInterests] = useState<Record<string, string>>({ "rolling-desk-chair": "" });

  const value = useMemo<InterestState>(
    () => ({
      interests,
      setInterest: (id, story = "") => setInterests((s) => ({ ...s, [id]: story })),
      withdraw: (id) =>
        setInterests((s) => {
          const next = { ...s };
          delete next[id];
          return next;
        }),
    }),
    [interests],
  );

  return <InterestContext.Provider value={value}>{children}</InterestContext.Provider>;
}

export function useInterests() {
  const ctx = useContext(InterestContext);
  if (!ctx) throw new Error("useInterests must be used inside InterestProvider");
  return ctx;
}
