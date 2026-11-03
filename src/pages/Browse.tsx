import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { icons } from "../assets";
import { Button } from "../components/Button";
import { Chip } from "../components/Chip";
import { FilterSheet } from "../components/FilterSheet";
import { Icon } from "../components/Icon";
import { ItemCard } from "../components/ItemCard";
import { SearchBar } from "../components/SearchBar";
import { ToggleRow } from "../components/Toggle";
import { RootTopBar } from "../components/TopBar";
import { allCategories, categories, NEIGHBOR_COUNT, NEIGHBORHOOD, type Category, type Item } from "../data";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  applyFilters,
  clearedFilters,
  distances,
  methodOptions,
  sorts,
  toggleCategory,
  useFilters,
  type SortKey,
} from "../state/filters";
import { useInterests } from "../state/interests";

const PAGE_SIZE = 6;

/** Shared Browse logic: filters, search query, results and interest toggling. */
function useBrowse() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const { filters, setFilters } = useFilters();
  const { interests, setInterest, withdraw } = useInterests();
  const navigate = useNavigate();

  // Breadcrumb links arrive as /?category=Furniture — apply once, then drop the param.
  useEffect(() => {
    const c = params.get("category");
    if (c && (allCategories as string[]).includes(c)) {
      setFilters((f) => ({ ...f, categories: [c as Category] }));
      const next = new URLSearchParams(params);
      next.delete("category");
      setParams(next, { replace: true });
    }
  }, [params, setParams, setFilters]);

  const results = useMemo(() => applyFilters(filters, query), [filters, query]);

  const setQuery = (q: string) => {
    const next = new URLSearchParams(params);
    if (q) next.set("q", q);
    else next.delete("q");
    setParams(next, { replace: true });
  };

  const toggleInterest = (item: Item) => {
    if (item.id in interests) withdraw(item.id);
    // "Tell your story" giveaways need a story, which is written on the details page.
    else if (item.method === "Tell your story") navigate(`/item/${item.id}`);
    else setInterest(item.id);
  };

  const clearAll = () => setFilters((f) => ({ ...clearedFilters, sort: f.sort }));

  return { query, setQuery, filters, setFilters, results, interests, toggleInterest, clearAll };
}

const countLabel = (n: number) => `${n} ${n === 1 ? "item" : "items"} near you`;

export function Browse() {
  return useIsMobile() ? <BrowseMobile /> : <BrowseDesktop />;
}

/* ================= D1 · Desktop ================= */

function BrowseDesktop() {
  const { filters, setFilters, results, interests, toggleInterest, clearAll } = useBrowse();
  const [visible, setVisible] = useState(PAGE_SIZE);

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
              <Chip
                label="All"
                selected={filters.categories.length === 0}
                onClick={() => setFilters((f) => ({ ...f, categories: [] }))}
              />
              {categories.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={filters.categories.includes(c)}
                  onClick={() => setFilters((f) => ({ ...f, categories: toggleCategory(f.categories, c) }))}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend className="t-label">Distance</legend>
            <div className="chip-group">
              {distances.map((d) => (
                <Chip
                  key={d.label}
                  label={d.label}
                  selected={filters.distance === d.label}
                  onClick={() => setFilters((f) => ({ ...f, distance: d.label }))}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend className="t-label">Giving method</legend>
            <div className="chip-group">
              {methodOptions.map((m) => (
                <Chip key={m} label={m} selected={filters.method === m} onClick={() => setFilters((f) => ({ ...f, method: m }))} />
              ))}
            </div>
          </fieldset>

          <ToggleRow
            label="Hide ended giveaways"
            checked={filters.hideEnded}
            onChange={(v) => setFilters((f) => ({ ...f, hideEnded: v }))}
          />

          <Button variant="secondary" fullWidth onClick={clearAll}>
            Clear all filters
          </Button>
        </aside>

        <section className="results" aria-label="Results">
          <div className="results__header">
            <p className="t-subheading" aria-live="polite">
              {countLabel(results.length)}
            </p>
            <label className="sort-select">
              <Icon src={icons.sort} size={20} />
              <span className="t-supporting">Sort: {sorts[filters.sort].label}</span>
              <Icon src={icons.chevronDown} size={20} />
              <select
                aria-label="Sort items"
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortKey }))}
              >
                {(Object.keys(sorts) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {sorts[key].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <EmptyResults onClear={clearAll} />
          ) : (
            <div className="card-grid">
              {results.slice(0, visible).map((item) => (
                <ItemCard key={item.id} item={item} interested={item.id in interests} onToggleInterest={() => toggleInterest(item)} />
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

/* ================= M1 · Mobile ================= */

function BrowseMobile() {
  const { query, setQuery, filters, setFilters, results, interests, toggleInterest, clearAll } = useBrowse();
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeFilterCount =
    (filters.distance !== "Anywhere" ? 1 : 0) + (filters.method !== "Any" ? 1 : 0) + (filters.hideEnded ? 1 : 0);

  return (
    <>
      <RootTopBar />
      <main className="m-page m-browse">
        <section className="m-hero">
          <h1 className="t-display-l">
            Free finds, <em>next door.</em>
          </h1>
          <p className="t-body muted">
            Give what you don’t need. Find what you do — from {NEIGHBOR_COUNT} neighbors in {NEIGHBORHOOD}.
          </p>
        </section>

        <div className="m-search-row">
          <SearchBar label="Search items" placeholder="Search free items near you" value={query} onChange={setQuery} />
          <button
            type="button"
            className="round-button round-button--outlined"
            aria-label={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
            aria-haspopup="dialog"
            onClick={() => setSheetOpen(true)}
          >
            <Icon src={icons.filter} size={24} />
          </button>
        </div>

        <div className="chip-scroller" role="group" aria-label="Category">
          <Chip label="All" selected={filters.categories.length === 0} onClick={() => setFilters((f) => ({ ...f, categories: [] }))} />
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={filters.categories.includes(c)}
              onClick={() => setFilters((f) => ({ ...f, categories: toggleCategory(f.categories, c) }))}
            />
          ))}
        </div>

        <div className="m-results-header">
          <p className="t-label" aria-live="polite">
            {countLabel(results.length)}
          </p>
          <button type="button" className="m-sort-button t-supporting" aria-haspopup="dialog" onClick={() => setSheetOpen(true)}>
            <Icon src={icons.sort} size={20} />
            {sorts[filters.sort].label}
            <Icon src={icons.chevronDown} size={20} />
          </button>
        </div>

        {results.length === 0 ? (
          <EmptyResults onClear={clearAll} />
        ) : (
          <div className="m-item-list">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} interested={item.id in interests} onToggleInterest={() => toggleInterest(item)} />
            ))}
          </div>
        )}
      </main>

      {sheetOpen && (
        <FilterSheet
          initial={filters}
          query={query}
          onClose={() => setSheetOpen(false)}
          onApply={(f) => {
            setFilters(f);
            setSheetOpen(false);
          }}
        />
      )}
    </>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="empty-state">
      <p className="t-headline-s">Nothing here — yet.</p>
      <p className="t-body muted">Try widening the distance or clearing a filter.</p>
      <Button variant="secondary" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}
