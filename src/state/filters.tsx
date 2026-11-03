import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { items, type Category, type Item, type Method } from "../data";

export const distances = [
  { label: "0.5 mi", max: 0.5 },
  { label: "1 mi", max: 1 },
  { label: "3 mi", max: 3 },
  { label: "Anywhere", max: Infinity },
] as const;
export type DistanceLabel = (typeof distances)[number]["label"];

export const methodOptions: ("Any" | Method)[] = ["Any", "Random pick", "Tell your story"];

export const sorts = {
  newest: { label: "Newest", compare: (a: Item, b: Item) => a.postedHoursAgo - b.postedHoursAgo },
  nearest: { label: "Nearest", compare: (a: Item, b: Item) => a.distanceMi - b.distanceMi },
  ending: {
    label: "Ending soon",
    // Ended giveaways sink to the bottom.
    compare: (a: Item, b: Item) => (a.ended ? Infinity : a.endsInHours) - (b.ended ? Infinity : b.endsInHours),
  },
} as const;
export type SortKey = keyof typeof sorts;

export interface Filters {
  /** Empty = all categories. */
  categories: Category[];
  distance: DistanceLabel;
  method: "Any" | Method;
  hideEnded: boolean;
  sort: SortKey;
}

// Defaults match the filter state shown in the designs.
export const defaultFilters: Filters = { categories: [], distance: "1 mi", method: "Any", hideEnded: true, sort: "newest" };
export const clearedFilters: Filters = { categories: [], distance: "Anywhere", method: "Any", hideEnded: false, sort: "newest" };

export function applyFilters(f: Filters, query: string): Item[] {
  const maxMi = distances.find((d) => d.label === f.distance)?.max ?? Infinity;
  const q = query.trim().toLowerCase();
  return items
    .filter((i) => f.categories.length === 0 || f.categories.includes(i.category))
    .filter((i) => i.distanceMi <= maxMi)
    .filter((i) => f.method === "Any" || i.method === f.method)
    .filter((i) => !f.hideEnded || !i.ended)
    .filter((i) => !q || i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
    .sort(sorts[f.sort].compare);
}

export const toggleCategory = (list: Category[], c: Category) =>
  list.includes(c) ? list.filter((x) => x !== c) : [...list, c];

interface FiltersState {
  filters: Filters;
  setFilters: (f: Filters | ((f: Filters) => Filters)) => void;
}

const FiltersContext = createContext<FiltersState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
