import { useEffect, useRef, useState } from "react";
import { icons } from "../assets";
import { categories } from "../data";
import {
  applyFilters,
  clearedFilters,
  distances,
  methodOptions,
  sorts,
  toggleCategory,
  type Filters,
  type SortKey,
} from "../state/filters";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { Icon } from "./Icon";
import { ToggleRow } from "./Toggle";

interface Props {
  initial: Filters;
  query: string;
  onApply: (f: Filters) => void;
  onClose: () => void;
}

/** M2 · Filter & sort bottom sheet. Edits a draft; "Show N items" applies it. */
export function FilterSheet({ initial, query, onApply, onClose }: Props) {
  const [draft, setDraft] = useState(initial);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = applyFilters(draft, query).length;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-scrim" aria-label="Close filters" tabIndex={-1} onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet__handle" aria-hidden="true" />
        <div className="sheet__header">
          <h2 id="sheet-title" className="t-headline-m">
            Filter &amp; <em>sort</em>
          </h2>
          <button ref={closeRef} type="button" className="round-button" aria-label="Close" onClick={onClose}>
            <Icon src={icons.x} size={24} />
          </button>
        </div>

        <fieldset className="filter-group">
          <legend className="t-label">Sort by</legend>
          <div className="chip-group">
            {(Object.keys(sorts) as SortKey[]).map((k) => (
              <Chip key={k} label={sorts[k].label} selected={draft.sort === k} onClick={() => set("sort", k)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="t-label">Category</legend>
          <div className="chip-group">
            {categories.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={draft.categories.includes(c)}
                onClick={() => set("categories", toggleCategory(draft.categories, c))}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="t-label">Distance</legend>
          <div className="chip-group">
            {distances.map((d) => (
              <Chip key={d.label} label={d.label} selected={draft.distance === d.label} onClick={() => set("distance", d.label)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend className="t-label">Giving method</legend>
          <div className="chip-group">
            {methodOptions.map((m) => (
              <Chip key={m} label={m} selected={draft.method === m} onClick={() => set("method", m)} />
            ))}
          </div>
        </fieldset>

        <ToggleRow label="Hide ended giveaways" checked={draft.hideEnded} onChange={(v) => set("hideEnded", v)} />

        <div className="sheet__actions">
          <Button variant="secondary" onClick={() => setDraft({ ...clearedFilters, sort: draft.sort })}>
            Clear all
          </Button>
          <Button className="sheet__apply" onClick={() => onApply(draft)}>
            Show {count} {count === 1 ? "item" : "items"}
          </Button>
        </div>
      </div>
    </div>
  );
}
