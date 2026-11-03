import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { icons } from "../assets";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { Icon } from "../components/Icon";
import { ItemCard } from "../components/ItemCard";
import { ToggleRow } from "../components/Toggle";
import { categories, items, NEIGHBOR_COUNT, NEIGHBORHOOD, type Item, type Method } from "../data";
import { useInterests } from "../state";

const distances = [
  { label: "0.5 mi", max: 0.5 },
  { label: "1 mi", max: 1 },
  { label: "3 mi", max: 3 },
  { label: "Anywhere", max: Infinity },
] as const;

const methods: ("Any" | Method)[] = ["Any", "Random pick", "Tell your story"];

const sorts = {
  newest: { label: "Newest", compare: (a: Item, b: Item) => a.postedHoursAgo - b.postedHoursAgo },
  nearest: { label: "Nearest", compare: (a: Item, b: Item) => a.distanceMi - b.distanceMi },
  popular: { label: "Most interested", compare: (a: Item, b: Item) => b.interestedCount - a.interestedCount },
} as const;
type SortKey = keyof typeof sorts;

const PAGE_SIZE = 6;

// Defaults match the filter state shown in the design.
const DEFAULTS = { distance: "1 mi", hideEnded: true };

export function Browse() {
  const [params, setParams] = useSearchParams();
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const category = params.get("category") ?? "All";

  const [distance, setDistance] = useState<string>(DEFAULTS.distance);
  const [method, setMethod] = useState<(typeof methods)[number]>("Any");
  const [hideEnded, setHideEnded] = useState(DEFAULTS.hideEnded);
  const [sort, setSort] = useState<SortKey>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { interests, setInterest, withdraw } = useInterests();
  const navigate = useNavigate();

  const toggleInterest = (item: Item) => {
    if (item.id in interests) withdraw(item.id);
    // "Tell your story" giveaways need a story, which is written on the details page.
    else if (item.method === "Tell your story") navigate(`/item/${item.id}`);
    else setInterest(item.id);
  };

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params);
    if (c === "All") next.delete("category");
    else next.set("category", c);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const maxMi = distances.find((d) => d.label === distance)?.max ?? Infinity;
    return items
      .filter((i) => category === "All" || i.category === category)
      .filter((i) => i.distanceMi <= maxMi)
      .filter((i) => method === "Any" || i.method === method)
      .filter((i) => !hideEnded || !i.ended)
      .filter((i) => !query || i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query))
      .sort(sorts[sort].compare);
  }, [category, distance, method, hideEnded, query, sort]);

  const clearAll = () => {
    setCategory("All");
    setDistance("Anywhere");
    setMethod("Any");
    setHideEnded(false);
  };

  return (
    <main>
      <section className="hero">
        <div className="hero__text">
          <h1 className="t-display-xl">
            Free finds, <em>next door.</em>
          </h1>
          <p className="t-subheading">
            Give what you don’t need. Find what you do — from {NEIGHBOR_COUNT} neighbors in {NEIGHBORHOOD}.
          </p>
        </div>
        <Button variant="secondary">How it works</Button>
      </section>

      <div className="browse-body">
        <aside className="filters" aria-label="Filters">
          <h2 className="t-headline-s">
            Filter &amp; <em>sort</em>
          </h2>

          <fieldset className="filter-group">
            <legend className="t-label">Category</legend>
            <div className="chip-group">
              {["All", ...categories].map((c) => (
                <Chip key={c} label={c} selected={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend className="t-label">Distance</legend>
            <div className="chip-group">
              {distances.map((d) => (
                <Chip key={d.label} label={d.label} selected={distance === d.label} onClick={() => setDistance(d.label)} />
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend className="t-label">Giving method</legend>
            <div className="chip-group">
              {methods.map((m) => (
                <Chip key={m} label={m} selected={method === m} onClick={() => setMethod(m)} />
              ))}
            </div>
          </fieldset>

          <ToggleRow label="Hide ended giveaways" checked={hideEnded} onChange={setHideEnded} />

          <Button variant="secondary" fullWidth onClick={clearAll}>
            Clear all filters
          </Button>
        </aside>

        <section className="results" aria-label="Results">
          <div className="results__header">
            <p className="t-subheading" aria-live="polite">
              {results.length} {results.length === 1 ? "item" : "items"} near you
            </p>
            <label className="sort-select">
              <Icon src={icons.sort} size={20} />
              <span className="t-supporting">Sort: {sorts[sort].label}</span>
              <Icon src={icons.chevronDown} size={20} />
              <select aria-label="Sort items" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                {Object.entries(sorts).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <p className="t-headline-s">Nothing here — yet.</p>
              <p className="t-body muted">Try widening the distance or clearing a filter.</p>
              <Button variant="secondary" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="card-grid">
              {results.slice(0, visible).map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  interested={item.id in interests}
                  onToggleInterest={() => toggleInterest(item)}
                />
              ))}
            </div>
          )}

          {results.length > visible && (
            <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more items
            </Button>
          )}
        </section>
      </div>
    </main>
  );
}
